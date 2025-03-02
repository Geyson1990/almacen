using almacen.Models.Autenticacion;
using almacen.Repositories.Autenticacion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace almacen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutenticacionController(IAutenticacionRepository service) : ControllerBase
    {
        private readonly IAutenticacionRepository _service = service;

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
        {
            var respuesta = await _service.AutenticarUsuario(request);
            return Ok(respuesta);
        }

    }
}
