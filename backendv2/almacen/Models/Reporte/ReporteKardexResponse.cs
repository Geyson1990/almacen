namespace almacen.Models.Reporte
{
    public class ReporteKardexResponse
    {
        public int registro { get; set; }
        public long idProducto { get; set; }
        public string producto { get; set; }
        public DateTime fecha { get; set; }
        public string tipoMovimiento { get; set; }
        public int cantidad { get; set; }
        public int stockAcumulado { get; set; }
        public string detalle { get; set; }
        public string material { get; set; }
        public string color { get; set; }
        public string talla { get; set; }
        public string marca { get; set; }
    }
}
