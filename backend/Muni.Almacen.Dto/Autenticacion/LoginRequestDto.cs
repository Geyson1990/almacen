using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Dto.Autenticacion
{
    public class LoginRequestDto
    {
        public string? alias { get; set; }
        public string? contrasenia { get; set; }
    }
}
