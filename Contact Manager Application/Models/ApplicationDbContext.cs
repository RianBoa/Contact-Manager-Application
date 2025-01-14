using Microsoft.EntityFrameworkCore;

namespace Contact_Manager_Application.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        
        public DbSet<Contact> Contacts { get; set; }
    }
}
