using System.ComponentModel.DataAnnotations;

public static class ContactValidation
{
    public static ValidationResult ValidateDateOfBirth(DateTime dateOfBirth, ValidationContext context)
    {
        if (dateOfBirth > DateTime.Now)
        {
            return new ValidationResult("Date of birth cannot be in the future");
        }

        var age = DateTime.Now.Year - dateOfBirth.Year;
        if (dateOfBirth > DateTime.Now.AddYears(-age)) age--; // Враховуємо, якщо день народження ще не пройшов цього року

        return ValidationResult.Success;
    }
}