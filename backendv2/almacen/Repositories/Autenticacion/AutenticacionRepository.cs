using almacen.Models.Autenticacion;
using almacen.Utils;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static almacen.Utils.Message;

namespace almacen.Repositories.Autenticacion
{
    public class AutenticacionRepository(IDbSession conn) : IAutenticacionRepository
    {
        private readonly IDbSession _conn = conn;

        public async Task<StatusResponse<LoginResponseDto>> AutenticarUsuario(LoginRequestDto request)
        {
            try
            {
                // Consulta SQL para obtener los datos del usuario que coincide con el alias y la contraseña
                string sql = @"SELECT
                                [APELLIDO_PATERNO] AS apellidoPaterno,
                                [APELLIDO_MATERNO] AS apellidoMaterno,
                                [NOMBRES] AS nombres,
                                [NUMERO_DOCUMENTO] AS numeroDocumento
                            FROM [dbo].[usuario]
                            WHERE ALIAS = @Alias
                            AND CONTRASENIA = @Contrasenia";

                var parameters = new DynamicParameters();
                parameters.Add("@Alias", request.alias);
                parameters.Add("@Contrasenia", request.contrasenia);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryFirstOrDefaultAsync<LoginResponseDto>(sql, parameters) ?? throw new Exception("Usuario no válido");
                response.accessToken = GenerateToken(response);
                return Message.Successful(response);
            }
            catch (Exception ex) 
            {
                return Message.Exception<LoginResponseDto>(ex);
            }
            
        }

        private static string GenerateToken(LoginResponseDto userClaims)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SBqAzE70Dlj4Hjwk4IYQZCARwJWH4YzL"));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var header = new JwtHeader(signingCredentials);

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
