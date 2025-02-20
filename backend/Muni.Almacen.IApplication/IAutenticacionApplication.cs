using Muni.Almacen.Dto;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Muni.Almacen.IApplication
{
    public interface IAutenticacionApplication
    {
        Task<StatusResponse<LoginResponseDto>> AutenticarUsuarios(LoginRequestDto request);
    }
}
