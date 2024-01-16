using Microsoft.AspNetCore.Mvc;
using TicketingApplicationAPI.Context;
using TicketingApplicationAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace TicketingApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        // Endpoint to authenticate user login.
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            // If user tries to send a blank form, return a bad request.
            if (userObj == null)
                return BadRequest();

            // Check if the user is in the database.
            var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username && x.Password == userObj.Password);

            // If user isn't in the database, return a not found response.
            if (user == null)
                return NotFound(new { Message = "User Doesnt Exist" });

            // If authentication is successful, return an Ok response with a success message.
            return Ok(new
            {
                Message = "Login Successful"
            });
        }



        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] User userObj)
        {
            try
            {
                if (userObj == null)
                {
                    Console.WriteLine("Error: Invalid user object received in SignUp method.");
                    return BadRequest(new { Message = "Invalid user object received." });
                }

                Console.WriteLine($"Info: Received signup request for user {userObj.Username}");

                // Add the new user to the Users DbSet in the database context.
                _authContext.Users.Add(userObj);

                Console.WriteLine("Info: Saving changes to the database...");

                // Save changes to the database.
                await _authContext.SaveChangesAsync();

                Console.WriteLine($"Info: User {userObj.Username} registered successfully.");

                return Ok(new { Message = "User Registered Successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in SignUp method: {ex.Message}");
                return StatusCode(500, new { Message = "Internal Server Error", Error = ex.Message });
            }
        }


    }
}
