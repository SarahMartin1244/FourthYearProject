using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketingApplicationAPI.Context;
//using TicketingApplicationAPI.Helpers;
using TicketingApplicationAPI.Models;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

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

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            try
            {
                // If user tries to send a blank form, return a bad request.
                if (userObj == null)
                    return BadRequest(new { Message = "Invalid user object received." });

                // Retrieve the user from the database based on the username.
                var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);

                // If user isn't in the database, return a not found response.
                if (user == null)
                    return NotFound(new { Message = "User doesn't exist." });

                // Verify the password using the PasswordHasher.
                if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
                    return BadRequest(new { Message = "Invalid password." });

                user.Token = CreateJwt(user);


                // If authentication is successful, return an Ok response with a success message.
                return Ok(new
                {
                    Token = user.Token,
                    Message = "Login successful"
                }) ;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in Authenticate method: {ex}");
                return StatusCode(500, new { Message = "Internal Server Error", Error = ex.ToString() });
            }
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

                // Check if username is valid.
                if (await CheckUserNameExistAysnc(userObj.Username))
                {
                    return BadRequest(new { Message = "Username already exists" });
                }

                // Check if email exists.
                if (await CheckEmailExistAysnc(userObj.Email))
                {
                    return BadRequest(new { Message = "Email already exists" });
                }

                // Check the strength of the password.
                var pass = CheckPasswordStrenght(userObj.Password);
                if (!string.IsNullOrEmpty(pass))
                    return BadRequest(new { Message = pass });

                userObj.Password = PasswordHasher.HashPassword(userObj.Password);
                userObj.Role = "User";
                userObj.Token = "";

                Console.WriteLine($"Info: Received signup request for user {userObj.Username}");

                // Add the new user to the Users DbSet in the database context.
                _authContext.Users.Add(userObj);

                Console.WriteLine("Info: Saving changes to the database...");

                // Save changes to the database.
                await _authContext.SaveChangesAsync();

                Console.WriteLine($"Info: User {userObj.Username} registered successfully.");

                return Ok(new { Message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in SignUp method: {ex}");
                return StatusCode(500, new { Message = "Internal Server Error", Error = ex.Message });
            }
        }

        private Task<bool> CheckUserNameExistAysnc(string username)
        {
            return _authContext.Users.AnyAsync(x => x.Username == username);
        }

        private Task<bool> CheckEmailExistAysnc(string email)
        {
            return _authContext.Users.AnyAsync(x => x.Email == email);
        }

        private string CheckPasswordStrenght(string password)
        {
            StringBuilder sb = new StringBuilder();

            if (password.Length < 8)
            {
                sb.Append("Password is too short (Minimum length is 8 characters)" + Environment.NewLine);
            }
            else
            {
                if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                    && Regex.IsMatch(password, "[0-9]")))
                {
                    sb.Append("Password should contain at least one lowercase letter, one uppercase letter, and one digit." + Environment.NewLine);
                }

                if (!Regex.IsMatch(password, "[<>,@!?+-]"))
                {
                    sb.Append("Password should contain at least one of the following special characters: <, >, @, !, ?, +, -." + Environment.NewLine);
                }
            }

            return sb.ToString();
        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identify = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identify,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }


        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authContext.Users.ToListAsync());
        }
    }


}
