namespace almacen.Models.Ingreso
{
    public class ListarIngresoResponse
    {
        public long registro { get; set; }
        public DateTime? fecha { get; set; }
        public long idEntrada { get; set; }
        public long idProducto { get; set; }
        public string? nombre { get; set; }
        public string? material { get; set; }
        public string? color { get; set; }
        public string? talla { get; set; }
        public string? tipo { get; set; }
        public string? medidas { get; set; }
        public string? marca { get; set; }
        public int idUnidadMedida { get; set; }
        public string? nombreUnidadMedida { get; set; }
        public long cantidad { get; set; }
       // public int estadoStock { get; set; }
        public DateTime? fechaVencimiento { get; set; }
        //public int estado { get; set; }
    }
}
