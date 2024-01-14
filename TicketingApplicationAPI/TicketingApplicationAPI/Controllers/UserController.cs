using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketingApplicationAPI.Context;

namespace TicketingApplicationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public UserController(AppDbContext authContext)
        {
            _authContext = AppDbContext;
        }
    }
}
