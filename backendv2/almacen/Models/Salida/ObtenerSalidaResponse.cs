namespace almacen.Models.Salida
{
    public class ObtenerSalidaResponse
    {
        public long idSalida { get; set; }
        public long idProducto { get; set; }
        public int cantidad { get; set; }
        public long idAreaSolicitante { get; set; }
        public string personaSolicitante { get; set; }
    }
}
