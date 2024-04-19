using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using TicketingApplicationAPI.Context;
using TicketingApplicationAPI.Models;

namespace TicketingApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public TicketController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        // Method to check if a user is logged in and get their user ID
        private int? GetLoggedInUserId()
        {
            var userIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "UserId");

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            return null; // User is not logged in or user ID couldn't be parsed
        }

        // method to compare the user's RoleID to the ticket's AssignedRoleID
        private bool IsUserAuthorized(int userId, int roleId)
        {
            // Retrieve the user from the database based on the user ID
            var user = _authContext.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return false;
            }

            // Check if the user's RoleID matches the required RoleID
            return user.RoleID == roleId;
        }


        [HttpPost("createTicket")]
        public IActionResult CreateTicket([FromBody] Ticket ticketObj)
        {
            try
            {
                // Get the logged-in user's ID
                var loggedInUserId = GetLoggedInUserId();

                if (!loggedInUserId.HasValue)
                {
                    // User is not logged in
                    return Unauthorized(new { Message = "User not logged in" });
                }

                // Log the user ID for debugging
                Console.WriteLine($"Debug: Logged-in User ID: {loggedInUserId.Value}");

                // Set the UserID property of the ticket with the logged-in user's ID
                ticketObj.UserID = loggedInUserId.Value;

                // Save the ticket to the database using the DbContext
                _authContext.Tickets.Add(ticketObj);
                _authContext.SaveChanges();

                return Ok(new
                {
                    Message = "Ticket Created"
                });
            }
            catch (Exception ex)
            {
                // Log any exceptions for debugging
                Console.WriteLine($"Exception in CreateTicket method: {ex}");
                return StatusCode(500, new { Message = "Internal Server Error", Error = ex.ToString() });
            }
        }
        [HttpGet("GetTicketsForUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTicketsForUser(int userId)
        {
            // Retrieve the tickets for the specified user ID
            var tickets = await _authContext.Tickets
                .Where(t => t.UserID == userId)
                .ToListAsync();

            return Ok(tickets);
        }


        //[HttpGet("sharedQueue")]
        //[Authorize] // Allow any authenticated user to access shared queue tickets
        //public async Task<ActionResult<IEnumerable<Ticket>>> GetSharedQueueTickets()
        //{
        //    // Retrieve tickets from the shared queue (tickets not assigned to any user)
        //    var tickets = await _authContext.Tickets
        //        .Where(t => t.AssignedTo == null)
        //        .ToListAsync();

        //    return Ok(tickets);
        //}


        // Method to get all tickets assigned to the logged-in user
        //[HttpGet("myTickets")]
        //public async Task<ActionResult<IEnumerable<Ticket>>> GetMyTickets()
        //{
        //    // Get the logged-in user's ID
        //    var loggedInUserId = GetLoggedInUserId();

        //    if (!loggedInUserId.HasValue)
        //    {
        //        // User is not logged in
        //        return Unauthorized(new { Message = "User not logged in" });
        //    }

        //    // Retrieve tickets assigned to the logged-in user
        //    var tickets = await _authContext.Tickets
        //        .Where(t => t.AssignedTo == loggedInUserId.Value)
        //        .ToListAsync();

        //    return Ok(tickets);
        //}



        [HttpGet("sharedQueue")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetSharedQueueTickets()
        {
            var loggedInUserId = GetLoggedInUserId();

            if (!loggedInUserId.HasValue)
            {
                return Unauthorized(new { Message = "User not logged in" });
            }

            // Retrieve the user's role ID
            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == loggedInUserId.Value);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            // Use the user's role ID as the required role ID
            var requiredRoleId = user.RoleID;

            // Check if the user is authorized to access the shared queue
            if (!IsUserAuthorized(loggedInUserId.Value, (int)requiredRoleId))
            {
                return Unauthorized(new { Message = "User not authorized to access shared queue" });
            }

            // Retrieve tickets from the shared queue with the assigned role ID matching the user's role ID
            var tickets = await _authContext.Tickets
                .Where(t => t.AssignedTo == 0 && t.AssignedRoleID == requiredRoleId)
                .ToListAsync();

            return Ok(tickets);
        }



        // create api called takeover that will allow a user to take over a ticket from the shared queue and assign it to themselves we will pass the ticket id as a parameter and the user id will be taken from the logged in user when a user takes over a ticket the assigned to field should be updated with the user id
        [HttpPost("takeover/{ticketId}")]
        [Authorize]
        public IActionResult TakeOver(int ticketId)
        {
            // Get the logged-in user's ID
            var loggedInUserId = GetLoggedInUserId();

            if (!loggedInUserId.HasValue)
            {
                // User is not logged in
                return Unauthorized(new { Message = "User not logged in" });
            }

            // Check if the user is authorized to access the shared queue
            if (!IsUserAuthorized(loggedInUserId.Value, 1))
            {
                // User is not authorized
                return Unauthorized(new { Message = "User not authorized to access shared queue" });
            }

            // Retrieve the ticket from the database
            var ticket = _authContext.Tickets.FirstOrDefault(t => t.TicketID == ticketId);

            if (ticket == null)
            {
                // Ticket not found
                return NotFound(new { Message = "Ticket not found" });
            }

            // Assign the ticket to the logged-in user
            ticket.AssignedTo = loggedInUserId.Value;

            // Update the ticket in the database
            _authContext.Tickets.Update(ticket);
            _authContext.SaveChanges();

            return Ok(new { Message = "Ticket assigned to user" });
        }

        // create api called updateassignqueue that now displays all tickets assigned to the logged in user
        // create api called updateassignqueue that now displays all tickets assigned to the logged in user
        [HttpGet("updateassignqueue")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Ticket>>> UpdateAssignQueue()
        {
            // Get the logged-in user's ID
            var loggedInUserId = GetLoggedInUserId();

            if (!loggedInUserId.HasValue)
            {
                // User is not logged in
                return Unauthorized(new { Message = "User not logged in" });
            }

            // Retrieve tickets assigned to the logged-in user
            var tickets = await _authContext.Tickets
                .Where(t => t.AssignedTo == loggedInUserId.Value)
                .ToListAsync();

            return Ok(tickets);
        }



    }
}