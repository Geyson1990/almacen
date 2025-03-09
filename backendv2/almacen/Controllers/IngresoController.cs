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
        [HttpGet("obtener-producto")]
        public async Task<ActionResult> ObtenerProducto([FromQuery]int id)
        {
            var respuesta = await _service.ObtenerProducto(id);
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
        [HttpPost("eliminar-producto")]
        public async Task<ActionResult> EliminarProductos([FromBody] EliminarProductoRequest request)
        {
            var respuesta = await _service.EliminarProducto(request.id);
            return Ok(respuesta);
        }


    }
}
