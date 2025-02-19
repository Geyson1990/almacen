using Minem.Tupa.Dto.Proxy.Externo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Minem.Tupa.Proxy.Interface
{
    public interface IExternoService
    {
        Task<string> ObtenerRepresentantePorCliente(RepresentanteRequestDto request);
    }
}
