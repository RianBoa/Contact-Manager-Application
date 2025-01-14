using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Contact_Manager_Application.Models;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using System.Globalization;
using System.ComponentModel.DataAnnotations;


namespace Contact_Manager_Application.Controllers
{
    public class ContactsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                ModelState.AddModelError("", "Please upload a valid CSV file.");
                return RedirectToAction(nameof(Index));
            }

            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                var csv = new CsvHelper.CsvReader(reader, CultureInfo.InvariantCulture);

                // Ігнорувати перевірку заголовків
                csv.Context.Configuration.HeaderValidated = null;

                // Налаштувати ігнорування поля Id
                csv.Context.RegisterClassMap<ContactMap>();

                var records = csv.GetRecords<Contact>().ToList();

                _context.Contacts.AddRange(records);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }



        // GET: Contacts
        public async Task<IActionResult> Index()
        {
            return View(await _context.Contacts.ToListAsync());
        }

        // GET: Contacts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var contact = await _context.Contacts
                .FirstOrDefaultAsync(m => m.Id == id);
            if (contact == null)
            {
                return NotFound();
            }

            return View(contact);
        }



        // GET: Contacts/Edit/5
        [HttpPost]
        [Route("Contact/Update")]
        public IActionResult Update([FromBody] UpdateRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is null.");
            }

            Console.WriteLine($"Request received: ID={request.Id}, Field={request.Field}, Value={request.Value}");

            // Знайти запис у базі даних з ID
            var record = _context.Contacts.Find(request.Id);
            if (record == null)
            {
                return NotFound("Record not found.");
            }

            // Перевірити, чи існує вказане поле
            var propertyInfo = typeof(Contact).GetProperty(request.Field);
            if (propertyInfo == null)
            {
                return BadRequest($"Invalid field name: {request.Field}");
            }

            try
            {
                object convertedValue;

                // Перетворити значення в залежності від типу поля
                if (propertyInfo.PropertyType == typeof(bool))
                {
                    if (bool.TryParse(request.Value, out bool boolValue))
                    {
                        convertedValue = boolValue;
                    }
                    else
                    {
                        return BadRequest("Invalid value for a boolean field.");
                    }
                }
                else if (propertyInfo.PropertyType == typeof(int))
                {
                    if (int.TryParse(request.Value, out int intValue))
                    {
                        convertedValue = intValue;
                    }
                    else
                    {
                        return BadRequest("Invalid value for an integer field.");
                    }
                }
                else if (propertyInfo.PropertyType == typeof(decimal))
                {
                    if (decimal.TryParse(request.Value, out decimal decimalValue))
                    {
                        convertedValue = decimalValue;
                    }
                    else
                    {
                        return BadRequest("Invalid value for a decimal field.");
                    }
                }
                else
                {
                    // Для рядків та інших типів
                    convertedValue = Convert.ChangeType(request.Value, propertyInfo.PropertyType);
                }

                // Встановити нове значення у запис
                propertyInfo.SetValue(record, convertedValue);

                // Зберегти зміни у базі даних
                _context.SaveChanges();

                return Ok("Record updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating field: {ex.Message}");
            }
        }





        // GET: Contacts/Delete/5
        [HttpDelete]
        [Route("Contact/Delete/{id}")]
        public IActionResult Delete(int id)
        {
            var record = _context.Contacts.Find(id);
            if (record != null)
            {
                _context.Contacts.Remove(record);
                _context.SaveChanges();
                return Ok(); 
            }
            return NotFound(); 
        }

        // POST: Contacts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact != null)
            {
                _context.Contacts.Remove(contact);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}
