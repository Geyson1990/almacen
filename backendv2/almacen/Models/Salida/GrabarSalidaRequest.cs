namespace almacen.Models.Salida
{
    public class GrabarSalidaRequest
    {
        public long idSalida {  get; set; }
        public long idProducto { get; set; }
        public DateTime? fecha { get; set; }
        public int cantidad { get; set; }
        public long idAreaSolicitante { get; set; }
        public string personaSolicitante { get; set; }
        public int idTipoSalida { get; set; }
        public string documentoSalida { get; set; }
    }

    public class GrabarSalidaResponse: GrabarSalidaRequest { }
}
