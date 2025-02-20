using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Dto.Formulario
{
    public class GuardarFormularioRequestDto
    {
        public long codMaeSolicitud { get; set; }
        public string? dataJson { get; set; }
    }
}
