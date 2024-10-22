using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        //proprietatile care au nume identic se mappeaza automat
        
        //pt ca in AppUser avem o metoda GetAge
        //automapper-ul o va folosi pentru a popula 
        //proprietatea Age din MemberDto

        //Pentru celelalte prop trebuie configurat automapper-ul
        CreateMap<AppUser, MemberDto>()
            .ForMember(d => d.Age,
                o => o.MapFrom(s=> s.DateOfBirth.CalculateAge()))
            .ForMember(d => d.PhotoUrl, 
                o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        //d - destination, o - options, s - source
        CreateMap<Photo, PhotoDto>();  

        CreateMap<MemberUpdateDto, AppUser>();
    }
}
