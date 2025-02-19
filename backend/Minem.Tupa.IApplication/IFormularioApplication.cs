using Minem.Tupa.Dto;
using Minem.Tupa.Dto.Autenticacion;
using Minem.Tupa.Dto.Formulario;
using Minem.Tupa.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.IApplication
{
    public interface IFormularioApplication
    {
        Task<StatusResponse<long>> GuardarFormulario(GuardarFormularioRequestDto request);
        Task<StatusResponse<ObtenerFormularioDiaResponseDto>> ObtenerFormularioDia(long CodMaeSolicitud);
        Task<StatusResponse<DescargarPlantillaDiaResponseDto>> DescargarDocumento(DescargarPlantillaDiaRequestDto request);
    }
}
