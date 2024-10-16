using System;
using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
 IHostEnvironment env)
{
    //nu alegem noi numele metodei, aceasta metoda se apeleaza in lantul de middleware
    //Pentru ca este middleware avem acces la httpcontext
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            //nu facem nimic cu requestul, doar il trimitem mai departe
            //ne intereseaza atunci cand apare o exceptie
            //pe care o tratam in blocul catch
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace)
                : new ApiException(context.Response.StatusCode, ex.Message, "Internal server error");
                
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
