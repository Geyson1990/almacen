using Microsoft.EntityFrameworkCore;

namespace Muni.Almacen.Data
{
    public class Minem_Db_Context : DbContext
    {
        public Minem_Db_Context(DbContextOptions<Minem_Db_Context> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
            => base.OnModelCreating(modelBuilder);        
    }    
}
