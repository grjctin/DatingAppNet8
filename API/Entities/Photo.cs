using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

//Pentru a nu crea un nou DbSet pentru tabelul photos
//mentionam aici numele tabelului pe care ef il va crea automat
[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }
    
    //Navigation properties 
    //necesare pentru crearea relatiei de 
    //required one to many dintre AppUser si Photo
    //Daca stergem un AppUser se sterg automat si pozele lui
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;
    
}