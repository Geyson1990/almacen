using almacen.Models.Autenticacion;
using almacen.Utils;
using static almacen.Utils.Message;

namespace almacen.Repositories.Autenticacion
{
    public interface IAutenticacionRepository
    {
        Task<StatusResponse<LoginResponseDto>> AutenticarUsuario(LoginRequestDto request);
    }
}
