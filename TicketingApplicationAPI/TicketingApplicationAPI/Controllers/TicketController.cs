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







    }
}