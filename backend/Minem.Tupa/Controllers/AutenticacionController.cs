using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Minem.Tupa.Dto;
using Minem.Tupa.Dto.Autenticacion;
using Minem.Tupa.IApplication;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace Minem.Tupa.Controllers
{
    //[Authorize(Roles = "TRAMITE_GESTOR_CIUDADANO")]
    //[EnableCors("_corsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacionController(IAutenticacionApplication service) : ControllerBase
    {
        private readonly IAutenticacionApplication _service = service;

        [AllowAnonymous]
        [HttpGet("login")]
        public async Task<ActionResult> Login([FromQuery] LoginRequestDto request)
        {
            var respuesta = await _service.AutenticarUsuarios(request);
            return Ok(respuesta);
        }

    }
}
