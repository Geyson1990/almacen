using almacen.Models.Autenticacion;
using almacen.Models.Ingreso;
using almacen.Models.Inventario;
using static almacen.Utils.Message;

namespace almacen.Repositories.Ingreso
{
    public interface IIngresoRepository
    {
        Task<StatusResponse<IEnumerable<ListarIngresoResponse>>> GetAll();
        //Task<StatusResponse<IEnumerable<ListarUnidadesMedidaResponse>>> ListarUnidadesMedida();
        Task<StatusResponse<long>> GrabarIngreso(GrabarIngresoRequest request);
        Task<StatusResponse<long>> InsertarStockInicial(GrabarStockInicialRequest request);
        Task<StatusResponse<GrabarProductoResponse>> ObtenerProducto(long idProducto);
        Task<StatusResponse<long>> EliminarProducto(long id);
    }
}
