using Microsoft.EntityFrameworkCore;
using TicketingApplicationAPI.Models;

namespace TicketingApplicationAPI.Context
{
    // Represents the database context for the application derived from DbContext.
    public class AppDbContext : DbContext
    {
        // Constructor to initialize the AppDbContext with DbContextOptions.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Represents the DbSet for the user entity in the database.
        public DbSet<User> Users { get; set; }

        // Overrides the OnModelCreating method to configure the model being generated for the database.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configures the User entity to be mapped to the "users" table in the database.
            modelBuilder.Entity<User>().ToTable("users");

          
        }
    }
}
