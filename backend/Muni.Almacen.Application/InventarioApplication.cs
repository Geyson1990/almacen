using AutoMapper;
using Muni.Almacen.Dto.Inventario;
using Muni.Almacen.IApplication;
using Muni.Almacen.Infraestructure;
using Muni.Almacen.IRepository;
using Muni.Almacen.Utils;

namespace Muni.Almacen.Application
{
    public class InventarioApplication(IInventarioRepository repository, IMapper mapper) : IInventarioApplication
    {
        private readonly IMapper _mapper = mapper;
        private readonly IInventarioRepository _repository = repository;

        public async Task<StatusResponse<IEnumerable<ListarInventarioResponseDto>>> ListarInventario(long CodMaeSolicitud)
        {
            try
            {
                var respuesta = _mapper.Map<IEnumerable<ListarInventarioResponseDto>>(await _repository.ListarInventario(CodMaeSolicitud));
                if (!respuesta.Any()) throw new Exception("No hay información");
                return Message.Successful(respuesta);
            }
            catch (Exception ex)
            {
                return Message.Exception<IEnumerable<ListarInventarioResponseDto>>(ex);
            }

        }



    }
}
