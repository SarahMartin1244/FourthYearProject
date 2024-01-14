using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketingApplicationAPI.Context;
using TicketingApplicationAPI.Models;
using System.Linq; 
using Microsoft.EntityFrameworkCore;

namespace TicketingApplicationAPI.Controllers
{
    // Controller for managing user-related actions in the API.
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        // Constructor to initialize the UserController with an instance of AppDbContext.
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

        // Endpoint to register a new user.
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            // If the user object is null, return a bad request.
            if (userObj == null)
                return BadRequest();

            // Add the new user to the Users DbSet in the database context.
            await _authContext.Users.AddAsync(userObj);

            // Save changes to the database.
            await _authContext.SaveChangesAsync();

            // Return an Ok response with a success message.
            return Ok(new
            {
                Message = "User Registered Successfully"
            });
        }
    }
}
