using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Entity
{
    public class USP_S_Persona_Buscar_DNI_Request_Entity
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Ruc { get; set; }
        public string? TipoUsuario { get; set; }
        public string? IndUsuarioExterno { get; set; }
    }
}
