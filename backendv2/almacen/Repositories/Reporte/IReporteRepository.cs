using almacen.Models.Reporte;
using static almacen.Utils.Message;

namespace almacen.Repositories.Reporte
{
    public interface IReporteRepository
    {
        Task<StatusResponse<IEnumerable<ReporteKardexResponse>>> ReporteKardex(ReporteKardexRequest request);
        Task<StatusResponse<IEnumerable<ReporteIngresoResponse>>> ReporteIngreso(ReporteKardexRequest request);
        Task<StatusResponse<IEnumerable<ReporteSalidaResponse>>> ReporteSalida(ReporteKardexRequest request);
    }
}
