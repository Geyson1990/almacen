using almacen.Models.Salida;
using almacen.Models.Inventario;
using almacen.Repositories.Salida;
using almacen.Repositories.Inventario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalidaController(ISalidaRepository service) : ControllerBase
    {
        private readonly ISalidaRepository _service = service;

        [AllowAnonymous]
        [HttpGet("listar-salida")]
        public async Task<ActionResult> ListarSalida()
        {
            var respuesta = await _service.GetAll();
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("obtener-salida")]
        public async Task<ActionResult> ObtenerSalida([FromQuery]int id)
        {
            var respuesta = await _service.ObtenerSalida(id);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("grabar-salida")]
        public async Task<ActionResult> GrabarSalida([FromBody]GrabarSalidaRequest request)
        {
            var respuesta = await _service.GrabarSalida(request);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("eliminar-salida")]
        public async Task<ActionResult> EliminarSalida([FromBody] EliminarProductoRequest request)
        {
            var respuesta = await _service.EliminarSalida(request.id);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("area-solicitante")]
        public async Task<ActionResult> ListarAreasSolicitantes()
        {
            var respuesta = await _service.ListarAreasSolicitantes();
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("listar-tipo-salida")]
        public async Task<ActionResult> ListarTipoSalida()
        {
            var respuesta = await _service.ListarTipoSalida();
            return Ok(respuesta);
        }

    }
}
