using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Muni.Almacen.Dto.Formulario;
using Muni.Almacen.IApplication;

namespace Muni.Almacen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormularioController(IFormularioApplication service) : ControllerBase
    {
        private readonly IFormularioApplication _service = service;

        //[AllowAnonymous]
        //[HttpPost("guardar")]
        //public async Task<ActionResult> Guardar([FromBody] GuardarFormularioRequestDto request)
        //{
        //    var respuesta = await _service.GuardarFormulario(request);
        //    return Ok(respuesta);
        //}

        //[AllowAnonymous]
        //[HttpGet("formulario-dia")]
        //public async Task<ActionResult> ObtenerFormularioDia([FromQuery] long CodMaeSolicitud)
        //{
        //    var respuesta = await _service.ObtenerFormularioDia(CodMaeSolicitud);
        //    return Ok(respuesta);
        //}


       
    }
}
