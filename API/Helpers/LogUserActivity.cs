using System;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        //Daca vrem sa facem ceva inainte de actiunea din controller
        var resultContext = await next(); //aici se executa actiunea din api controller
        //Daca vrem sa facem ceva dupa actiunea din controller

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;
        var userId = resultContext.HttpContext.User.GetUserId();
        var unitOfWork = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        if (user == null) return;
        user.LastActive = DateTime.UtcNow;
        await unitOfWork.Complete();
    }
}
