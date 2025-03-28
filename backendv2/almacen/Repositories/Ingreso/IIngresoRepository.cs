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
        Task<StatusResponse<ObtenerIngresoResponse>> ObtenerIngreso(long idEntrada);
        Task<StatusResponse<long>> EliminarIngreso(long id);
        Task<StatusResponse<IEnumerable<ListarTipoIngresoResponse>>> ListarTipoIngreso();
    }
}
