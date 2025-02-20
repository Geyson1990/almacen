using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Dto.Formulario
{
    public class ObtenerFormularioDiaResponseDto
    {
        public long Id { get; set; }
        public long CodMaeSolicitud { get; set; }
        public string? DataJson { get; set; }
    }

    public class DescargarPlantillaDiaRequestDto
    {
        public long CodMaeSolicitud { get; set; }
        //public long IdCliente { get; set; }
        //public string RazonSocial { get; set; }
        //public string NumeroDocumento { get; set; }
    }

    public class DescargarPlantillaDiaResponseDto
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string base64Documento { get; set; }
        public string extension { get; set; }
        public long tamanio { get; set; }
    }
}
