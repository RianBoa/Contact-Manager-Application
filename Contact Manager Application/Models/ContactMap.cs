using Contact_Manager_Application.Models;
using CsvHelper.Configuration;

public class ContactMap : ClassMap<Contact>
{
    public ContactMap()
    {
     
        Map(m => m.Name);
        Map(m => m.DateOfBirth);
        Map(m => m.Married);
        Map(m => m.Phone);
        Map(m => m.Salary);
    }
}