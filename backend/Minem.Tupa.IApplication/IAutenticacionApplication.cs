using Minem.Tupa.Dto;
using Minem.Tupa.Dto.Autenticacion;
using Minem.Tupa.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.IApplication
{
    public interface IAutenticacionApplication
    {
        Task<StatusResponse<LoginResponseDto>> AutenticarUsuarios(LoginRequestDto request);
    }
}
