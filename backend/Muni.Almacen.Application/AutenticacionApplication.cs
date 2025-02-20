using AutoMapper;
using Microsoft.Extensions.Configuration;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.Entity.Autenticacion;
using Muni.Almacen.IApplication;
using Muni.Almacen.Infraestructure;
using Muni.Almacen.IRepository;
using Muni.Almacen.Utils;

namespace Muni.Almacen.Application
{
    public class AutenticacionApplication(IAutenticacionRepository autenticacionRepository, IMapper mapper, IConfiguration configuration) : IAutenticacionApplication
    {
        private readonly IMapper _mapper = mapper;
        private readonly IAutenticacionRepository _autenticacionRepository = autenticacionRepository;
        private readonly IConfiguration _configuration = configuration;

        public async Task<StatusResponse<LoginResponseDto>> AutenticarUsuarios(LoginRequestDto request)
        {
            try
            {
                var usuario = _mapper.Map<LoginResponseDto>(await _autenticacionRepository.AutenticarUsuario(_mapper.Map<USP_SELECT_OBTENER_USUARIO_Request>(request)));
              
                if (usuario == null) throw new Exception("Usuario o contraseña no válido.");

            
                return Message.Successful(new LoginResponseDto());                
            }
            catch(Exception ex)
            {
                return Message.Exception<LoginResponseDto>(ex);
            }          
        }
    }
}
