using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Minem.Tupa.Dto.Proxy.Externo;
using Minem.Tupa.Infraestructure;
using Minem.Tupa.Proxy.Interface;
using Minem.Tupa.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Minem.Tupa.Proxy.Implementation
{
    public class ExternoService(HttpClient httpClient, IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            // IOptions<AppSettings> appSettings, 
             IOptions<ExternoService> transversalSvcSettings,
             ILogService logService) : IExternoService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        //private readonly IOptions<AppSettings> _appSettings = appSettings;
        private readonly IOptions<ExternoService> _transversalSvcSettings = transversalSvcSettings;
        //private string BASE_URL = appSettings.Value.MsSettings.ExternoSvcSettings.BaseUrl;
        private readonly ILogService _logService = logService;


        public async Task<string> ObtenerRepresentantePorCliente(RepresentanteRequestDto request)
        {
            string response;
            try
            {
                var authorizationHeader = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString();

                string obtenerRepresentantePorCliente = "";//_appSettings.Value.MsSettings.ExternoSvcSettings.EndPoint.GetRepresentantePorCliente;
                string urlEndPoint = $"{obtenerRepresentantePorCliente}?IdOficina={request.IdCliente}"; //+
                    //$"&IdTipoDocumento={request.IdTipoDocumento}" +
                    //$"&FlgActualiza={request.FlgActualiza}&IdUsuario={request.IdUsuario}&IpPc={request.IpPc}";


                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorizationHeader);
                _logService.WriteLog("Token:  " + authorizationHeader);
                var httpResponseMessage = await _httpClient.GetAsync(urlEndPoint);
                _logService.WriteLog("absolutePAth: " + _httpClient?.BaseAddress?.AbsolutePath);
                _logService.WriteLog("httpResponseMessage:  ");
                //Funciones.WriteLog("Respuesta de Notificacion httpNotificacionInternaResponseMessage :::>" + httpNotificacionInternaResponseMessage);
                var responseString = await httpResponseMessage.Content.ReadAsStringAsync();
                _logService.WriteLog("responseString:  " + responseString);
                var apiResponse = JsonSerializer.Deserialize<StatusResponse<string>>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                _logService.WriteLog("apiResponse:  ");
                if (apiResponse is null)
                {
                    return null;
                }
                response = apiResponse.Data;
            }
            catch (Exception ex)
            {
                //Funciones.WriteLog("Respuesta del servicio Notificacion :::>" + ex.Message);
                throw;
            }
            return response;
        }
    }
}
