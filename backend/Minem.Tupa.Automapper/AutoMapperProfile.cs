using AutoMapper;
using Minem.Tupa.Dto.Formulario;
using Minem.Tupa.Dto.Mapa;
using Minem.Tupa.Dto.Observacion;
using Minem.Tupa.Dto.Profesional;
using Minem.Tupa.Dto.Tramite;
using Minem.Tupa.Dto.Tupa;
using Minem.Tupa.Entity;
using Minem.Tupa.Entity.Formulario;
using Minem.Tupa.Entity.Mapa;
using Minem.Tupa.Entity.Observacion;
using Minem.Tupa.Entity.Profesional;
using Minem.Tupa.Entity.Tramite;
using Minem.Tupa.Entity.Tupa;
using System;
namespace Minem.Tupa.Automapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Tupa
            CreateMap<PersonaDto, USP_S_Persona_Buscar_DNI_Response_Entity>().ReverseMap();
            CreateMap<RequisitoEntity, RequisitoDto>().ReverseMap();
            CreateMap<SectorEntity, SectorDto>().ReverseMap();
            CreateMap<TupaEntity, TupaDto>().ReverseMap();
            #endregion Tupa

            #region Tramite
            CreateMap<ObtenerNotasRequestDto, SP_OBTENER_NOTAS_Request_Entity>().ReverseMap();
            CreateMap<SP_OBTENER_NOTAS_Response_Entity, ObtenerNotasResponseDto>().ReverseMap();

            CreateMap<ObtenerDocumentosRequestDto, SP_OBTENER_TRAMITE_DOCS_Request_Entity>().ReverseMap();
            CreateMap<SP_OBTENER_TRAMITE_DOCS_Response_Entity, ObtenerDocumentosResponseDto>().ReverseMap();

            CreateMap<SP_OBTENER_PROFESIONES_Response_Entity, ObtenerProfesionesResponseDto>().ReverseMap();
            CreateMap<SP_OBTENER_PROFESIONES_Response_Entity, ObtenerProfesionesResponseDto>().ReverseMap();

            CreateMap<ObtenerTramiteRequestDto, SP_OBTENER_TRAMITE_Request_Entity>().ReverseMap();
            CreateMap<SP_OBTENER_TRAMITE_Response_Entity, ObtenerTramiteResponseDto>().ReverseMap();

            CreateMap<ObtenerTramiteRequestDto, SP_OBTENER_TRAMITE_Request_Entity>().ReverseMap();
            CreateMap<SP_OBTENER_REQUISITOS_TRAMITE_Response_Entity, TramiteRequisito>().ReverseMap();

            CreateMap<EnviarSolicitudRequestDto, SP_OBTENER_TRAMITE_Request_Entity>().ReverseMap();
            CreateMap<USP_S_OBTENER_MIS_TRAMITES_Response_Entity, ObtenerMisTramitesResponseDto>().ReverseMap();

            CreateMap<USP_S_OBTENER_DOCUMENTOS_ADCIONALES_Response_Entity, ObtenerDocumentoAdicionalResponseDto>().ReverseMap();
            CreateMap<USP_S_OBTENER_FORMULARIO_DIA_Response_Entity, ObtenerFormularioDiaResponseDto>().ReverseMap();
            CreateMap<USP_S_OBTENER_FORMULARIO_DIA_Response_Entity, ObshistjsonDto>().ReverseMap();
            CreateMap<USP_S_OBTENER_TIPO_COMUNICACION_Response_Entity, ObtenerTipoComunicacionResponseDto>().ReverseMap();
            CreateMap<USP_S_OBTENER_TIPO_DOCUMENTO_Response_Entity, ObtenerTipoDocumentoResponseDto>().ReverseMap();

            CreateMap<ObtenerDocumentoAdicionalResponseDto, USP_S_OBTENER_DOCUMENTOS_ADCIONALES_DETALLE_Response_Entity>().ReverseMap();

            CreateMap<SP_INSERT_REGISTRO_DIA_Response_Entity, RegistrarEstudioResponseDto>().ReverseMap();
            #endregion Tramite
            
            #region Observacion         
            CreateMap<PRC_S_ULTIMOTUMOVMETADAHISTORICO_Response_Entity, TumovmetadahistoricoDto>().ReverseMap();
            CreateMap<PRC_S_OBSHISTJSON_Response_Entity, ObshistjsonDto>().ReverseMap();

            CreateMap<ObshistjsonDto, PRC_I_OBSHISTJSON_Request_Entity>().ReverseMap();
            CreateMap<DetobshistjsonDto, PRC_I_DETOBSHISTJSON_Request_Entity>().ReverseMap();
            #endregion Observacion

            #region Mapa
            CreateMap<SP_SELECT_TIPO_AREA_Response_Entity, TipoAreaResponseDto>()
                .ForMember(dest => dest.IdTipoArea, opt => opt.MapFrom(src => src.ID_TIPO_AREA))
                .ForMember(dest => dest.NombreActividad, opt => opt.MapFrom(src => src.NOMBRE_ACTIVIDAD))
                .ReverseMap();
            #endregion Mapa

        }
    }
}
