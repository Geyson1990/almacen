using AutoMapper;
using Muni.Almacen.Dto.Autenticacion;
using Muni.Almacen.Dto.Formulario;
using Muni.Almacen.Entity;
using Muni.Almacen.Entity.Autenticacion;
using Muni.Almacen.Entity.Formulario;
using System;
namespace Muni.Almacen.Automapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            #region Tramite
            CreateMap<LoginRequestDto, USP_SELECT_OBTENER_USUARIO_Request>().ReverseMap();
            CreateMap<USP_SELECT_OBTENER_USUARIO_Response, LoginResponseDto>().ReverseMap();
            #endregion Tramite           

        }
    }
}
