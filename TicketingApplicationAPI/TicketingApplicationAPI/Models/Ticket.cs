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
        public string Subject { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }

        public string AssignedTo { get; set; } // will be foreign key 

        // Use DateTime for dateCreated
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? DateCreated { get; set; } = DateTime.UtcNow;
        public string DateResolved { get; set; }
    }
}
