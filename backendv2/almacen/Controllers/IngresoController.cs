using almacen.Models.Ingreso;
using almacen.Models.Inventario;
using almacen.Repositories.Ingreso;
using almacen.Repositories.Inventario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngresoController(IIngresoRepository service) : ControllerBase
    {
        private readonly IIngresoRepository _service = service;

        [AllowAnonymous]
        [HttpGet("listar-ingreso")]
        public async Task<ActionResult> ListarIngreso()
        {
            var respuesta = await _service.GetAll();
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("obtener-ingreso")]
        public async Task<ActionResult> ObtenerIngreso([FromQuery]int id)
        {
            var respuesta = await _service.ObtenerIngreso(id);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("grabar-ingreso")]
        public async Task<ActionResult> GrabarIngreso([FromBody]GrabarIngresoRequest request)
        {
            var respuesta = await _service.GrabarIngreso(request);           
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpPost("eliminar-ingreso")]
        public async Task<ActionResult> EliminarIngreso([FromBody] EliminarIngresoRequest request)
        {
            var respuesta = await _service.EliminarIngreso(request.id);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("listar-tipo-ingreso")]
        public async Task<ActionResult> ListarTipoIngreso()
        {
            var respuesta = await _service.ListarTipoIngreso();
            return Ok(respuesta);
        }
    }
}
