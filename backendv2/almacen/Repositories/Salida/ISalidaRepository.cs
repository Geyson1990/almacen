using almacen.Models.Autenticacion;
using almacen.Models.Salida;
using almacen.Models.Inventario;
using static almacen.Utils.Message;

namespace almacen.Repositories.Salida
{
    public interface ISalidaRepository
    {
        Task<StatusResponse<IEnumerable<ListarSalidaResponse>>> GetAll();
        //Task<StatusResponse<IEnumerable<ListarUnidadesMedidaResponse>>> ListarUnidadesMedida();
        Task<StatusResponse<long>> GrabarSalida(GrabarSalidaRequest request);
        Task<StatusResponse<long>> InsertarStockInicial(GrabarStockInicialRequest request);
        Task<StatusResponse<ObtenerSalidaResponse>> ObtenerSalida(long idEntrada);
        Task<StatusResponse<long>> EliminarSalida(long id);
        Task<StatusResponse<IEnumerable<ListarAreasSolicitantesResponse>>> ListarAreasSolicitantes();
    }
}
