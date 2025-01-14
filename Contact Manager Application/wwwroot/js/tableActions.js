document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("contactsTable");

    // Enable inline editing for editable cells
    table.addEventListener("click", event => {
        const target = event.target;

        if (target.classList.contains("editable")) {
            makeCellEditable(target);
        }
    });

    // Enable editing for checkboxes in Married column
    table.addEventListener("change", event => {
        const target = event.target;

        if (target.classList.contains("editable-checkbox")) {
            const row = target.closest("tr");
            const recordId = row.dataset.id;
            const field = target.dataset.field;
            const value = target.checked;  // Отримуємо true чи false

            updateRecord(recordId, field, value)
                .then(success => {
                    if (!success) {
                        alert("Failed to update checkbox. Please try again.");
                        target.checked = !value; // Повертаємо стан при помилці
                    }
                });
        }
    });

    // Delete record
    table.addEventListener("click", event => {
        const target = event.target;

        if (target.classList.contains("delete-record")) {
            const row = target.closest("tr");
            const recordId = row.dataset.id;

            if (confirm("Are you sure you want to delete this record?")) {
                deleteRecord(recordId, row);
            }
        }
    });
});

function makeCellEditable(cell) {
    const originalValue = cell.textContent.trim(); // Поточне значення осередку
    const field = cell.dataset.field; // Поле для оновлення (наприклад, "Name" або "Salary")
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;

    // Коли користувач завершує редагування
    input.addEventListener("blur", () => {
        const newValue = input.value.trim();

        // Якщо значення змінилося, надсилаємо запит на сервер
        if (newValue !== originalValue) {
            const rowId = cell.closest("tr").dataset.id;
            updateRecord(rowId, field, newValue)
                .then(success => {
                    if (success) {
                        cell.textContent = newValue; // Оновлюємо значення в осередку
                    } else {
                        cell.textContent = originalValue; // Повертаємо вихідне значення за помилки
                        alert("Failed to update record. Please try again.");
                    }
                });
        } else {
            cell.textContent = originalValue; // Повертаємо вихідне значення, якщо не змінено
        }
    });

    // Спрощення редагування: Enter для збереження, Escape для скасування
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            input.blur(); // Завершуємо редагування
        } else if (event.key === "Escape") {
            cell.textContent = originalValue; // Скасуємо зміни
        }
    });

    cell.textContent = ""; // Очищаємо вміст комірки
    cell.appendChild(input);
    input.focus(); // Встановлюємо фокус на введення
}

// Оновлення запису через AJAX
function updateRecord(id, field, value) {
    // Перетворимо значення в рядок перед відправкою
    const formattedValue = typeof value === "boolean" ? value.toString() : value;

    console.log("Sending update:", { id, field, value: formattedValue });

    return fetch(`/Contact/Update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            field: field,
            value: formattedValue, // Відправляємо значення як рядок
        }),
    })
        .then(response => {
            if (response.ok) {
                return true;
            } else {
                return response.json().then(data => {
                    console.error("Error from server:", data);
                    return false;
                });
            }
        })
        .catch(error => {
            console.error("Error updating record:", error);
            return false;
        });
}



function deleteRecord(id, row) {
    fetch(`/Contact/Delete/${id}`, {
        method: "DELETE",
    })
        .then(response => {
            if (response.ok) {
                row.remove();
            } else {
                alert("Failed to delete record. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error deleting record:", error);
            alert("An error occurred while deleting the record.");
        });
}
