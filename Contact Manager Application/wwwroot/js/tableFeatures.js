function filterTable() {
    // Отримуємо значення фільтрів
    const nameFilter = document.getElementById('filterName')?.value.toLowerCase();
    const ageFilter = document.getElementById('filterAge')?.value.trim();
    const phoneFilter = document.getElementById('filterPhone')?.value.toLowerCase();
    const salaryFilter = document.getElementById('filterSalary')?.value.trim();

    // Отримуємо всі рядки таблиці
    const rows = document.querySelectorAll('#contactsTable tbody tr');

    rows.forEach(row => {
        const cells = row.children;

        // Перевіряємо кожну колонку
        const matchesName = cells[0]?.textContent.toLowerCase().includes(nameFilter || '');

        // Обчислюємо вік на основі `DateOfBirth`
        const birthDateText = cells[1]?.textContent.trim();
        const birthDate = birthDateText ? new Date(birthDateText) : null;
        const age = birthDate ? calculateAge(birthDate) : null;
        const matchesAge = age !== null && matchRangeFilter(age, ageFilter);

        const matchesPhone = cells[3]?.textContent.toLowerCase().includes(phoneFilter || '');
        const salaryValue = parseFloat(cells[4]?.textContent.trim()) || 0;
        const matchesSalary = matchRangeFilter(salaryValue, salaryFilter);

        // Показуємо рядок тільки якщо всі фільтри збігаються
        const isRowVisible =
            matchesName &&
            matchesAge &&
            matchesPhone &&
            matchesSalary;
        row.style.display = isRowVisible ? '' : 'none';
    });
}

function matchRangeFilter(value, filter) {
    if (!filter) return true;// Якщо фільтр порожній, повертаємо збіг

    if (filter.endsWith('+')) {
        const minValue = parseFloat(filter.slice(0, -1)); // Забираємо `+` і перетворимо на число
        return !isNaN(minValue) && value >= minValue;
    }

    const exactValue = parseFloat(filter);
    return !isNaN(exactValue) && value === exactValue;
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}



function sortTable(columnIndex) {
    const table = document.getElementById('contactsTable');
    const rows = Array.from(table.rows).slice(1);

    const isAscending = table.dataset.sortOrder === 'asc';
    table.dataset.sortOrder = isAscending ? 'desc' : 'asc';

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex];
        let cellB = rowB.cells[columnIndex];
        let valueA, valueB;

        // Перевіряємо, якщо колонка це чекбокс (columnIndex 2 для Married)
        if (columnIndex === 2) {
            valueA = cellA.querySelector('input[type="checkbox"]').checked ? 1 : 0;
            valueB = cellB.querySelector('input[type="checkbox"]').checked ? 1 : 0;
            return isAscending ? valueA - valueB : valueB - valueA;
        }

        // Перевіряємо, якщо колонка - це зарплата (columnIndex 4)
        if (columnIndex === 4) {
            valueA = parseFloat(cellA.textContent.trim()) || 0;
            valueB = parseFloat(cellB.textContent.trim()) || 0;
            return isAscending ? valueA - valueB : valueB - valueA;
        }

        // Перевіряємо, якщо колонка - це дата народження (columnIndex 1)
        if (columnIndex === 1) {
            valueA = new Date(cellA.textContent.trim());
            valueB = new Date(cellB.textContent.trim());
            return isAscending ? valueA - valueB : valueB - valueA;
        }

        // Для решти колонок
        valueA = cellA.textContent.trim();
        valueB = cellB.textContent.trim();

        return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));

    // Виклик функції оновлення стрілок і підсвічування
    updateSortIndicators(columnIndex, table.dataset.sortOrder);
}

function updateSortIndicators(columnIndex, sortOrder) {
    const headers = document.querySelectorAll('#contactsTable th');
    headers.forEach((header, index) => {
        const indicator = header.querySelector('.sort-indicator');
        header.style.backgroundColor = '';
        indicator.textContent = '';
        if (index === columnIndex) {
            header.style.backgroundColor = '#f0f0f0';
            indicator.textContent = sortOrder === 'asc' ? '▲' : '▼';
        }
    });
}
