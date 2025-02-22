using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Muni.Almacen.IApplication;

namespace Muni.Almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventarioController(IInventarioApplication service) : ControllerBase
    {
        private readonly IInventarioApplication _service = service;

        [AllowAnonymous]
        [HttpGet("listar-inventario")]
        public async Task<ActionResult> ListarInventario([FromQuery] long CodMaeSolicitud)
        {
            var respuesta = await _service.ListarInventario(CodMaeSolicitud);
            return Ok(respuesta);
        }


       
    }
}
