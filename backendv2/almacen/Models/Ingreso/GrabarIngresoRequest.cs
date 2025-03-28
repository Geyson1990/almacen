namespace almacen.Models.Ingreso
{
    public class GrabarIngresoRequest
    {
        public long idEntrada {  get; set; }
        public long idProducto { get; set; }
        public DateTime? fecha { get; set; }
        public int cantidad { get; set; }
        public int idTipoEntrada { get; set; }
        public string ordenCompra { get; set; }
    }

    public class GrabarIngresoResponse: GrabarIngresoRequest { }
}
