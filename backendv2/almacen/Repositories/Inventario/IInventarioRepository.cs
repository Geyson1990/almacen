using almacen.Models.Autenticacion;
using almacen.Models.Inventario;
using static almacen.Utils.Message;

namespace almacen.Repositories.Inventario
{
    public interface IInventarioRepository
    {
        Task<StatusResponse<IEnumerable<ListarInventarioResponse>>> GetAll();
        Task<StatusResponse<IEnumerable<ListarUnidadesMedidaResponse>>> ListarUnidadesMedida();
        Task<StatusResponse<long>> GrabarProductos(GrabarProductoRequest request);
        Task<StatusResponse<long>> InsertarStockInicial(GrabarStockInicialRequest request);
        Task<StatusResponse<GrabarProductoResponse>> ObtenerProducto(long idProducto);
        Task<StatusResponse<long>> EliminarProducto(long id);
    }
}
