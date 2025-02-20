using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.Infraestructure
{
    public static class CustomFunctions
    {

        public static ClaimsPrincipal GetClaimsPrincipalFromToken(string token)
        {
            // Configura la validación del token
            TokenValidationParameters tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SBqAzE70Dlj4Hjwk4IYQZCARwJWH4YzL")),
                ValidateIssuer = false, // Puedes establecer esto como true si deseas validar el emisor del token
                ValidateAudience = false // Puedes establecer esto como true si deseas validar la audiencia del token
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            // Intenta validar y leer el token
            try
            {
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch (Exception ex)
            {
                // Manejar cualquier error de validación de token
                Console.WriteLine($"Error al validar el token: {ex.Message}");
                return null;
            }
        }


    }
}
