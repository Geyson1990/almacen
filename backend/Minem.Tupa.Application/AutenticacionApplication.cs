using AutoMapper;
using Microsoft.Extensions.Configuration;
using Minem.Tupa.Dto.Autenticacion;
using Minem.Tupa.Entity;
using Minem.Tupa.Entity.Tupa;
using Minem.Tupa.IApplication;
using Minem.Tupa.Infraestructure;
using Minem.Tupa.IRepository;
using Minem.Tupa.Utils;
using System.Security.Claims;

namespace Minem.Tupa.Application
{
    public class AutenticacionApplication : IAutenticacionApplication
    {
        private readonly IMapper _mapper;
        private readonly IAutenticacionRepository _autenticacionRepository;
        private readonly IConfiguration _configuration;

        public AutenticacionApplication(IAutenticacionRepository autenticacionRepository, IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
            _autenticacionRepository = autenticacionRepository;
        }
        public async Task<StatusResponse<LoginResponseDto>> AutenticarUsuarios(LoginRequestDto request)
        {
            try
            {
                //var respuesta = _mapper.Map<LoginResponseDto>(await _autenticacionRepository.AutenticarUsuario(_mapper.Map<USP_S_Persona_Buscar_DNI_Request_Entity>(request)));
                var usuario = await AutenticarUsuario(request);
                
                if (usuario == null) throw new Exception("Usuario o contraseña no válido.");

              
                return Message.Successful(new LoginResponseDto());                
            }
            catch(Exception ex)
            {
                return Message.Exception<LoginResponseDto>(ex);
            }
            
        }

        private async Task<SEMovUsuario> AutenticarUsuario(LoginRequestDto request)
        {
            request.Password = Criptografia.Encriptar(request.Password);

            if (request.TipoUsuario.Equals(Constante.CodigoFuncionario) && request.Ruc == string.Empty)
            {
                string variable = "10062018";// _configuration.GetSection("Configurations:MasterKey").Value;

                if (!CustomFunctions.GetAuthenticate(request, variable)) return null;

                return await _autenticacionRepository.ObtenerTrabajadorPorUsuario(request.Username);
            }
            else if (request.Ruc == string.Empty && !request.TipoUsuario.Equals(Constante.CodigoFuncionario))
            {
               return await _autenticacionRepository.AutenticarUsuario(_mapper.Map<USP_S_Persona_Buscar_DNI_Request_Entity>(request));
            }
            else
            {
                return null;
                //return await _autenticacionRepository.AutenticarUsuarioJuridico(_mapper.Map<USP_S_Persona_Buscar_DNI_Request_Entity>(request));
            }
        }

        public async Task<ClaimsIdentity> LoadRolToUser(ClaimsIdentity oAuthIdentity, SEMovUsuario usuario)
        {
            var roles = await _autenticacionRepository.ListarPorUsuario(usuario.CodMovUsuario);
            foreach (var rol in roles)
            {
                oAuthIdentity.AddClaim(new Claim(ClaimTypes.Role, rol.Denominacion));
            }
            return oAuthIdentity;
        }



    }
}
