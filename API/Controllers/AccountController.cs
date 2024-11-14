using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper) : BaseApiController
{
    // [HttpPost("register")] //...api/account/register
    // public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    // {
    //     if(await UserExists(registerDto.Username)) 
    //         return BadRequest("Username is taken");

    //     using var hmac = new HMACSHA512();

    //     var user = mapper.Map<AppUser>(registerDto);

    //     user.UserName = registerDto.Username.ToLower();
    //     user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
    //     user.PasswordSalt = hmac.Key;

    //     context.Users.Add(user);
    //     await context.SaveChangesAsync();

    //     return new UserDto
    //     {
    //         Username = user.UserName,
    //         Token = tokenService.CreateToken(user),
    //         KnownAs = user.KnownAs,
    //         Gender = user.Gender
    //     };
    // }

    [HttpPost("register")] //...api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username))
            return BadRequest("Username is taken");

        var user = mapper.Map<AppUser>(registerDto);

        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        //Cred ca va trebui injectat aici userRepo si eliminat context
        var user = await userManager.Users
            .Include(x => x.Photos)
                .FirstOrDefaultAsync(x =>
                    x.NormalizedUserName == loginDto.Username.ToUpper());

        if (user == null || user.UserName == null) return Unauthorized("Invalid username");

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result) return Unauthorized();

        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Gender = user.Gender
        };
    }



    // [HttpPost("login")]
    // public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    // {
    //     //Cred ca va trebui injectat aici userRepo si eliminat context
    //     var user = await context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x =>
    //          x.UserName == loginDto.Username.ToLower());

    //     if(user == null) return Unauthorized("Invalid username");

    //     using var hmac = new HMACSHA512(user.PasswordSalt);

    //     var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

    //     for (int i = 0; i < computedHash.Length; i++)
    //     {
    //         if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
    //     }

    //     return new UserDto
    //     {
    //         Username = user.UserName,
    //         KnownAs = user.KnownAs,
    //         Token = tokenService.CreateToken(user),
    //         PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
    //         Gender = user.Gender
    //     };
    // }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}
