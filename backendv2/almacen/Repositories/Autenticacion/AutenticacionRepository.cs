using almacen.Models.Autenticacion;
using almacen.Utils;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static almacen.Utils.Message;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

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

        public async Task<StatusResponse<long>> Registro(RegistroRequestDto request)
        {
            try
            {
                // Consulta SQL para insertar un nuevo usuario
                string sql = @"INSERT INTO [dbo].[usuario] 
                        (APELLIDO_PATERNO, APELLIDO_MATERNO, NOMBRES, NUMERO_DOCUMENTO, ALIAS, CONTRASENIA, CORREO_ELECTRONICO)
                       VALUES 
                        (@ApellidoPaterno, @ApellidoMaterno, @Nombres, @NumeroDocumento, @Alias, @Contrasenia, @CorreoElectronico);
                       SELECT CAST(SCOPE_IDENTITY() as bigint);";

                var parameters = new DynamicParameters();
                parameters.Add("@ApellidoPaterno", request.apellidoPaterno);
                parameters.Add("@ApellidoMaterno", request.apellidoMaterno);
                parameters.Add("@Nombres", request.nombres);
                parameters.Add("@NumeroDocumento", request.numeroDocumento);
                parameters.Add("@Alias", request.numeroDocumento);
                parameters.Add("@Contrasenia", request.contrasenia);
                parameters.Add("@CorreoElectronico", request.correoElectronico);

                // Ejecuta la consulta y obtiene el ID del nuevo usuario
                var newUserId = await _conn.Connection.ExecuteScalarAsync<long>(sql, parameters);
                return Message.Successful(newUserId);
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }
        }

        public async Task<StatusResponse<long>> OlvideContrasenia(OlvideContraseniaRequestDto request)
        {
            try
            {
                if ((string.IsNullOrEmpty(request.email) || string.IsNullOrWhiteSpace(request.email)))
                    throw new Exception("El correo electrónico no puede estar vacío.");

                string sql = @"SELECT
                                [APELLIDO_PATERNO] AS apellidoPaterno,
                                [APELLIDO_MATERNO] AS apellidoMaterno,
                                [NOMBRES] AS nombres,
                                [NUMERO_DOCUMENTO] AS numeroDocumento,
                                [CONTRASENIA] AS contrasenia           
                            FROM [dbo].[usuario]
                            WHERE CORREO_ELECTRONICO = @CorreoElectronico";

                var parameters = new DynamicParameters();
                parameters.Add("@CorreoElectronico", request.email);

                // Ejecuta la consulta y obtiene el primer usuario que coincida con los criterios
                var response = await _conn.Connection.QueryFirstOrDefaultAsync<OlvideContraseniaResponseDto>(sql, parameters) ?? throw new Exception("Usuario no válido");

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("Municipalidad Distrital de Sayán", "xpgeyson@gmail.com"));
                email.To.Add(new MailboxAddress(response.numeroDocumento, request.email));
                email.Subject = "Recuperación de Credenciales - Municipalidad Distrital de Sayán";
                //email.Body = new TextPart("plain") { Text = $"¡Hola, {response.nombres?.ToUpper()}! Este es un correo de prueba desde .NET 8 usando Gmail SMTP." };
                email.Body = new TextPart("plain")
                {
                    Text = $@"Estimado/a {response.nombres},
                              Recibimos una solicitud para recordarle sus credenciales de acceso a nuestra plataforma. A continuación, le proporcionamos sus datos:
                              Usuario: {response.numeroDocumento}
                              Contraseña: {response.contrasenia}

                              Atentamente,

                              Soporte Técnico - Municipalidad Distrital de Sayán"
                };

                using var client = new SmtpClient();
                client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("xpgeyson@gmail.com", "pkcz vhkk ubql bwps");
                client.Send(email);
                client.Disconnect(true);


                return Message.Successful(1L);
            }
            catch (Exception ex)
            {
                return Message.Exception<long>(ex);
            }
        }
    }
}
