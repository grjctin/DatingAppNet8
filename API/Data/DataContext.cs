using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    //Users va fi numele tabelului in db
    public DbSet<AppUser> Users { get; set; }
}
