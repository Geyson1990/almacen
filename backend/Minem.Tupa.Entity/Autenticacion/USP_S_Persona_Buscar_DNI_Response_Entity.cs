using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Entity
{
    public class USP_S_Persona_Buscar_DNI_Response_Entity
    {
        public long CodMovPersona { get; set; }
        public string? Nombre { get; set; }
        public string? ApePaterno { get; set; }
        public string? ApeMaterno { get; set; }
        public string? NumDocumento { get; set; }
        public string? CodTabUbigeo { get; set; }
    }
}
