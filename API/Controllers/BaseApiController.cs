using System;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")]//localhost:5001/api/users
public class BaseApiController : ControllerBase
{

}
