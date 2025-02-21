using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.Entity.Autenticacion;
using Muni.Almacen.IApplication;
using Muni.Almacen.Infraestructure;
using Muni.Almacen.IRepository;
using Muni.Almacen.Utils;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime;
using System.Security.Claims;
using System.Text;

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

                var token = GenerateToken(usuario);
                usuario.accessToken = token;

                return Message.Successful(usuario);
            }
            catch(Exception ex)
            {
                return Message.Exception<LoginResponseDto>(ex);
            }
        }

        public string GenerateToken(LoginResponseDto userClaims)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SBqAzE70Dlj4Hjwk4IYQZCARwJWH4YzL"));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var header = new JwtHeader(signingCredentials);

           // string rolesList = JsonConvert.SerializeObject(userClaims.Roles);

            var claims = new[]
            {
            new Claim("userid",new Guid().ToString(), ClaimValueTypes.String),//id
            new Claim("nombre", userClaims.nombres, ClaimValueTypes.String),//nombre
            new Claim("apellidoPaterno", userClaims.apellidoPaterno, ClaimValueTypes.String),//
            new Claim("apellidoMaterno", userClaims.apellidoMaterno, ClaimValueTypes.String),//
            new Claim("numeroDocumento", userClaims.numeroDocumento, ClaimValueTypes.String),//           
        };

            var payload = new JwtPayload
            (
            "https://munisayan.gob.pe",
            "https://munisayan.gob.pe",
                claims,
                DateTime.Now,
                DateTime.UtcNow.AddMinutes(60)
            );

            var token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
