using Muni.Almacen.Entity.Inventario;

namespace Muni.Almacen.IRepository
{
    public interface IInventarioRepository
    {
        Task<IEnumerable<USP_SELECT_LISTAR_INVENTARIO_Response>> ListarInventario(long codMaeSolicitud);
    }
}
