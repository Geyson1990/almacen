using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Entity.Autenticacion
{
    public class USP_SELECT_OBTENER_USUARIO_Request
    {
        public string? alias { get; set; }
        public string? contrasenia { get; set; }
    }
}
