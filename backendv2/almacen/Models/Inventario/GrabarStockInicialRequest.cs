namespace almacen.Models.Inventario
{
    public class GrabarStockInicialRequest
    {
        public long idProducto { get; set; } 
        public int cantidad { get; set; }
    }
}
