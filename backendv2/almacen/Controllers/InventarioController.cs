using almacen.Models.Autenticacion;
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



    }
}
