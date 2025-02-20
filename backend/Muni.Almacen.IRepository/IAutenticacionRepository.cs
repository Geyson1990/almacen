using Muni.Almacen.Entity;
using Muni.Almacen.Entity.Autenticacion;

namespace Muni.Almacen.IRepository
{
    public interface IAutenticacionRepository
    {
        Task<USP_SELECT_OBTENER_USUARIO_Response> AutenticarUsuario(USP_SELECT_OBTENER_USUARIO_Request request);
    }
}
