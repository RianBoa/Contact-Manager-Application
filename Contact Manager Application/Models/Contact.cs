using System;
using System.ComponentModel.DataAnnotations;

namespace Contact_Manager_Application.Models
{
    public class Contact
    {
        [Key] // Указывает, что это первичный ключ
        public int Id { get; set; } // База данных автоматически будет генерировать значения

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Name can only contain letters and spaces")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date of birth is required")]
        [DataType(DataType.Date)]
        [CustomValidation(typeof(ContactValidation), nameof(ContactValidation.ValidateDateOfBirth))]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public bool Married { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?[0-9\s\-]+$", ErrorMessage = "Invalid phone number format")]
        [MaxLength(15, ErrorMessage = "Phone number cannot be longer than 15 characters")]
        public string Phone { get; set; }


        [Range(0, double.MaxValue, ErrorMessage = "Salary must be a positive value")]
        public decimal Salary { get; set; }
    }
}
