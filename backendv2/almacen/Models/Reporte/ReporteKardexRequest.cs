using System;

namespace almacen.Models.Reporte
{
    public class ReporteKardexRequest
    {
        // Fixed the declaration of nullable DateTime properties
        public DateTime? fechaInicio { get; set; } = DateTime.Now.AddYears(-30);
        public DateTime? fechaFin { get; set; } = DateTime.Now;
    }

}
