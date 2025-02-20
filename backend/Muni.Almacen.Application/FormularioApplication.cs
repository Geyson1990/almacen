using AutoMapper;
using Microsoft.Extensions.Configuration;
using Muni.Almacen.Dto.Formulario;
using Muni.Almacen.IApplication;
using Muni.Almacen.Infraestructure;
using Muni.Almacen.IRepository;
using Muni.Almacen.Utils;

namespace Muni.Almacen.Application
{
    public class FormularioApplication : IFormularioApplication
    {
        private readonly IMapper _mapper;
        private readonly IFormularioRepository _formularioRepository;
        private readonly IConfiguration _configuration;
        //private readonly ITramiteRepository _tramiteRepository;

        public FormularioApplication(IFormularioRepository formularioRepository, IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
            _formularioRepository = formularioRepository;
            //_tramiteRepository = tramiteRepository;
        }

        //public async Task<StatusResponse<long>> GuardarFormulario(GuardarFormularioRequestDto request)
        //{
        //    try
        //    {
        //        var response = await _formularioRepository.GuardarFormulario(request.codMaeSolicitud, request.dataJson);
        //        return Message.Successful(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Message.Exception<long>(ex);
        //    }
        //}

        //public async Task<StatusResponse<ObtenerFormularioDiaResponseDto>> ObtenerFormularioDia(long CodMaeSolicitud)
        //{
        //    try
        //    {
        //        var respuesta = _mapper.Map<ObtenerFormularioDiaResponseDto>(
        //            await _formularioRepository.ObtenerFormularioDia(CodMaeSolicitud));

        //        if (string.IsNullOrEmpty(respuesta.DataJson)){
        //            respuesta.DataJson = Constante.JsonData;
        //        }

        //        return Message.Successful(respuesta);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Message.Exception<ObtenerFormularioDiaResponseDto>(ex);
        //    }

        //}



    }
}
