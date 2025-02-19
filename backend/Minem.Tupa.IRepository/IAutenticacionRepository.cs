using Minem.Tupa.Entity;
using Minem.Tupa.Entity.Tupa;

namespace Minem.Tupa.IRepository
{
    public interface IAutenticacionRepository
    {
        Task<SEMovUsuario> AutenticarUsuario(USP_S_Persona_Buscar_DNI_Request_Entity request);
        Task<SEMovUsuario> ObtenerTrabajadorPorUsuario(string? nombreUsuario);
        Task<IEnumerable<SEMaeRol>> ListarPorUsuario(int codMovUsuario);
    }
}
