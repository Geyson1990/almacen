using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Minem.Tupa.Dto;
using Minem.Tupa.Dto.Autenticacion;
using Minem.Tupa.Dto.Formulario;
using Minem.Tupa.Dto.Tupa;
using Minem.Tupa.IApplication;
using Minem.Tupa.Utils;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace Minem.Tupa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormularioController(IFormularioApplication service) : ControllerBase
    {
        private readonly IFormularioApplication _service = service;

        [AllowAnonymous]
        [HttpPost("guardar")]
        public async Task<ActionResult> Guardar([FromBody] GuardarFormularioRequestDto request)
        {
            var respuesta = await _service.GuardarFormulario(request);
            return Ok(respuesta);
        }

        [AllowAnonymous]
        [HttpGet("formulario-dia")]
        public async Task<ActionResult> ObtenerFormularioDia([FromQuery] long CodMaeSolicitud)
        {
            var respuesta = await _service.ObtenerFormularioDia(CodMaeSolicitud);
            return Ok(respuesta);
        }


        [AllowAnonymous]
        [HttpPost("plantilla-dia")]
        public async Task<ActionResult> DescargarPlantilla([FromBody] DescargarPlantillaDiaRequestDto request)
        {
            var respuesta = await _service.DescargarDocumento(request);
            return Ok(respuesta);
        }
    }
}
