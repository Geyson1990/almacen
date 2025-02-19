using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Data
{
    public class Minem_Db_Context : DbContext
    {
        public Minem_Db_Context(DbContextOptions<Minem_Db_Context> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
            => base.OnModelCreating(modelBuilder);        
    }    
}
