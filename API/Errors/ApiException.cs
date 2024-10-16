using System;

namespace API.Errors;

public class ApiException(int statusCode, string message, string? details)
{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;

    //trebuie sa fie in format JSON ca sa putem returna ca Json format error message
}
