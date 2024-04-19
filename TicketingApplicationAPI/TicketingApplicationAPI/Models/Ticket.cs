using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketingApplicationAPI.Models
{
    public class Ticket
    {
        [Key]
        public int TicketID { get; set; }

        // Foreign key property
        public int? UserID { get; set; }

        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        public int? AssignedRoleID { get; set; }


        public string? Status { get; set; }
        public string Subject { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }
        public int AssignedTo { get; set; } // will be foreign key 

       

        // Use DateTime for dateCreated
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? DateCreated { get; set; } = DateTime.UtcNow.AddHours(1); /*DateTime.UtcNow;*/
        public string DateResolved { get; set; }

        // Additional properties to access user's first and last names
        [NotMapped] // Not mapped to the database
        public string UserFirstName => User?.FirstName;

        [NotMapped] // Not mapped to the database
        public string UserLastName => User?.LastName;

        // Get formatted date string
        [NotMapped] // Not mapped to the database
        public string FormattedDateCreated => DateCreated?.ToString("dddd, dd MMMM yyyy h:mm tt");


    }
}
