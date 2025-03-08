namespace almacen.Models.Inventario
{
    public class GrabarProductoRequest
    {
        public long idProducto {  get; set; }
        public string nombre { get; set; } = string.Empty;
        public string material { get; set; } = string.Empty;
        public string color { get; set; } = string.Empty;
        public string talla { get; set; } = string.Empty;
        public string tipo { get; set; } = string.Empty;
        public string medida { get; set; } = string.Empty;
        public string marca { get; set; } = string.Empty;
        public int idUnidadMedida { get; set; }
        public DateTime fechaVencimiento { get; set; }
        public int stockInicial { get; set; }
        public int stockMinimo { get; set; }
    }
}
