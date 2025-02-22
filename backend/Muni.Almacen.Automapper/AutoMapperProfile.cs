using AutoMapper;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.Dto.Inventario;
using Muni.Almacen.Entity.Autenticacion;
using Muni.Almacen.Entity.Inventario;
using System;
namespace Muni.Almacen.Automapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            #region Autenticacion
            CreateMap<LoginRequestDto, USP_SELECT_OBTENER_USUARIO_Request>().ReverseMap();
            CreateMap<USP_SELECT_OBTENER_USUARIO_Response, LoginResponseDto>().ReverseMap();
            #endregion Autenticacion    

            #region Inventario
            CreateMap<USP_SELECT_LISTAR_INVENTARIO_Response, ListarInventarioResponseDto>().ReverseMap();
            #endregion Inventario

        }
    }
}
