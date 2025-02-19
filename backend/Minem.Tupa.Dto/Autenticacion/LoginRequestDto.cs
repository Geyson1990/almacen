using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Dto.Autenticacion
{
    public class LoginRequestDto
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Ruc { get; set; }
        public string? TipoUsuario { get; set; }
        public string? IndUsuarioExterno { get; set; }
    }
}
