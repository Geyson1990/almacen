using almacen.Models.Autenticacion;
using almacen.Models.Inventario;
using static almacen.Utils.Message;

namespace almacen.Repositories.Inventario
{
    public interface IInventarioRepository
    {
        Task<StatusResponse<IEnumerable<ListarInventarioResponse>>> GetAll();
    }
}
