using Muni.Almacen.Dto;
using Muni.Almacen.Dto.Inventario;
using Muni.Almacen.Utils;

namespace Muni.Almacen.IApplication
{
    public interface IInventarioApplication
    {
        Task<StatusResponse<IEnumerable<ListarInventarioResponseDto>>> ListarInventario(long CodMaeSolicitud);
    }
}
