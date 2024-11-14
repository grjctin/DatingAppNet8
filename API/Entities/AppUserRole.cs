using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

//join intre appuser si role
public class AppUserRole : IdentityUserRole<int>
{
    public AppUser User { get; set; } = null!;
    public AppRole Role { get; set; } = null!;
}
