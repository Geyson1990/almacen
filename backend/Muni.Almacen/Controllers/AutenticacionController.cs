using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Muni.Almacen.Dto;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.IApplication;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace Muni.Almacen.Controllers
{
    //[Authorize(Roles = "TRAMITE_GESTOR_CIUDADANO")]
    //[EnableCors("_corsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacionController(IAutenticacionApplication service) : ControllerBase
    {
        private readonly IAutenticacionApplication _service = service;

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
        {
            var respuesta = await _service.AutenticarUsuarios(request);
            return Ok(respuesta);
        }

    }
}
