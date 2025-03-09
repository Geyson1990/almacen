using almacen.Models.Autenticacion;
using almacen.Models.Inventario;
using almacen.Repositories.Autenticacion;
using almacen.Repositories.Inventario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventarioController(IInventarioRepository service) : ControllerBase
    {
        private readonly IInventarioRepository _service = service;

        [AllowAnonymous]
        [HttpGet("listar-inventario")]
        public async Task<ActionResult> ListarInventario()
        {
            var respuesta = await _service.GetAll();
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("listar-unidades-medida")]
        public async Task<ActionResult> ListarUnidadesMedida()
        {
            var respuesta = await _service.ListarUnidadesMedida();
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
        [HttpPost("grabar-productos")]
        public async Task<ActionResult> GrabarProductos([FromBody]GrabarProductoRequest request)
        {
            var respuesta = await _service.GrabarProductos(request);
            var insertarIngreso = await _service.InsertarStockInicial(new GrabarStockInicialRequest
            {
             idProducto = respuesta.Data,
             cantidad = request.stockInicial
            });
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
