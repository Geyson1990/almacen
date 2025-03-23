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

        [AllowAnonymous]
        [HttpPost("registro")]
        public async Task<ActionResult> Registro([FromBody] RegistroRequestDto request)
        {
            var respuesta = await _service.Registro(request);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("olvide-pass")]
        public async Task<ActionResult> OlvideContrasenia([FromBody] OlvideContraseniaRequestDto request)
        {
            var respuesta = await _service.OlvideContrasenia(request);
            return Ok(respuesta);
        }
    }
}
