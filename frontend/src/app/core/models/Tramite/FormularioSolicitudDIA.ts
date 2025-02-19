import { Archivo } from "../SignNet/ServicioFirmaResponseModel";

export interface FormularioSolicitudDIA {
  IdSolicitud: number;
  ResumenEjecutivo: ResumenEjecutivo;
  DescripcionProyecto: DescripcionProyecto;
  Objetivo: string;
  //LocalizacionGeografica: LocalizacionGeografica;
  //Delimitacion: Delimitacion;
  //AreasInfluencia: AreasInfluencia;
  //CronogramaInversion: CronogramaInversion;
  //DescripcionEtapas: DescripcionEtapas;
  DescripcionMedioFisico: DescripcionMedioFisico;
  DescripcionMedioBiologico: DescripcionMedioBiologico;
  PuntoMuestreo: ArchivoAdjunto[];
  Cartografia: ArchivoAdjunto[];
  DescripcionAspectoSocial: DescripcionAspectoSocial;
  Arqueologia: Arqueologia;
  PlanMinimizacion: PlanMinimizacion;
  PlanContingencia: PlanContingencia;
  ProtocoloRelacionamiento: ProtocoloRelacionamiento;
  PlanCierre: PlanCierre;
  ParticipacionCiudadana: ParticipacionCiudadana;
  ImpactosAmbientales: ArchivoAdjunto[];
  PlanManejoAmbiental: PlanManejoAmbiental;
  Consultora: Consultora;
  SolicitudTitulo: SolicitudTitulo;
  SavePuntoMuestreo: boolean;
  SaveCartografia: boolean;
  SaveImpactosAmbientales: boolean;
  // StatePuntoMuestreo: number;
  // StateCartografia: number;
  // StateImpactosAmbientales: number;
  FechaRegistroPuntoMuestreo: string;
  FechaRegistroCartografia: string;
  FechaRegistroImpactosAmbientales: string;
}


export interface ResumenEjecutivo {
  Resumen: string;
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface DescripcionProyecto {
  Antecedentes: Antecedentes;
  Objetivo: string;
  LocalizacionGeografica: LocalizacionGeografica;
  Delimitacion: Delimitacion;
  AreasInfluencia: AreasInfluencia;
  CronogramaInversion: CronogramaInversion;
  DescripcionEtapas: DescripcionEtapas;
  Save: boolean;
  FechaRegistro: string;
  State: number;
  StateObjetivo: number;
}

export interface Antecedentes {
  DatosGenerales: DatosGenerales;
  DatosTitular: DatosTitular;
  DatosRepresentante: DatosRepresentante;
  CorreoNotificacion: CorreoNotificacion;
  PasivosAmbientales: PasivoAmbiental[];
  ComponentesNoCerrados: ComponenteNoCerrado[];
  MapaComponentes: ArchivoAdjunto[];
  Estudios: Estudio[];
  Permisos: Permiso[];
  PropiedadSuperficial: ArchivoAdjunto[];
  AreasProtegidas: AreaProtegida[];
  Distanciamiento: Distancia[];
  MapaAreasNaturales: ArchivoAdjunto[];
  Save: boolean;
  State: number;
  FechaRegistro: string;
}

export interface DatosGenerales {
  NombreProyecto: string;
  InversionEstimada: string;
  UnidadMinera: number;
  NuevaUnidadMinera: string;
  Tipo: string;
  NombreUnidadMinera: string;
}

export interface DatosTitular {
  NombreTitular: string;
  Direccion: string;
  Region: string;
  Telefono: string;
  Fax: string;
  Ruc: string;
  Email: string;
  PaginaWeb: string;
}

export interface DatosRepresentante {
  IdRepresentante: number;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombres: string;
  Cargo: string;
  DocumentoIdentidad: string;
  EmailRepresentante: string;
}

export interface CorreoNotificacion {
  EmailNotificacion1: string;
  EmailNotificacion2: string;
  Telefono1: string;
  Telefono2: string;
}

export interface PasivoAmbiental {
  NombreActivo: string;
  TipoComponente: string;
  SubTipoComponente: string;
  UbicacionEste: number;
  UbicacionNorte: number;
  UbicacionZona: number;
  UbicacionDatum: number;
  Responsable: number;
}

export interface ComponenteNoCerrado {
  Id: number;
  NombrePasivo: string;
  Condicion: string;
  Datum: string;
  ComponenteExUnidadMinera: ComponenteExUnidadMinera[];
}

export interface ComponenteExUnidadMinera {
  Id: number;
  Nombre: string;
  Tipo: string;
  DescripcionTipo: string;
  Subtipo: string;
  DescripcionSubtipo: string;
  Este: string;
  Norte: string;
  Zona: string;
  DescripcionZona: string;
  Datum: string;
  DescripcionDatum: string;
}

export interface Estudio {
  Id: number;
  NroExpediente: string;
  TipoEstudio: string;
  DescripcionTipoEstudio: string;
  Proyecto: string;
  Estado: string;
  FechaEnvio: string;
  AutoridadCompetente: string;
}

export interface Permiso {
  Id: number;
  TipoEstudio: string;
  Institucion: string;
  Certificacion: string;
  NroRD: string;
  Fecha: string;
  Plazo: number;
}

export interface AreaProtegida {
  Nombre: string;
  Tipo: string;
  Categoria: string;
  Clase: string;
  Fuente: string;
}

export interface Distancia {
  Id: number;
  AreaNatural: string;
  Distancia: string;
}

export interface LocalizacionGeografica {
  Localizacion: string;
  UbicacionGeografica: UbicacionGeografica;
  LocalizacionSuperpuesta: ArchivoAdjunto[];
  DistanciaPobladosCercanos: DistanciaPobladosCercanos[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface UbicacionGeografica {
  Region: string;
  Este: string;
  Norte: string;
}

export interface DistanciaPobladosCercanos {
  Id: number;
  Nombre: string;
  Distancia: string;
  Vias: string;
}

  export interface Delimitacion {
    //DelimitacionPerimetral: string;
    AreasActividadMinera: AreaActividadMinera[];
    AreasUsoMinero: AreaActividadMinera[];
    CoordenadaPuntoEste: string;
    CoordenadaPuntoNorte: string;
    Zona: string;
    Datum: string;
    Documentos: ArchivoAdjunto[];
    Save: boolean;
    State: number;
    FechaRegistro: string;
  }

export interface AreaActividadMinera {
  Id: number;
  Zona: string;
  Datum: string;
  IdActividad:number;
  Actividad: string;
  Descripcion: string;
  Estado: string;
  Validacion: string;
  Coordenadas: [number, number][];
}

export interface Coordenada {
  Nro: number;
  Este: string;
  Norte: string;
  ZonaUMT: string;
}

export interface AreasInfluencia {
  AreaDirectaAmbiental: AreaActividadMinera[];
  AreaIndirectaAmbiental: AreaActividadMinera[];
  AreaDirectaSocial: AreaActividadMinera[];
  AreaIndirectaSocial: AreaActividadMinera[];
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface AreaAmbiental {
  Nro: number;
  Zona: string;
  Datum: string;
  Validacion: string;
}

export interface AreaSocial {
  Nro: number;
  Zona: string;
  Datum: string;
  Validacion: string;
}

export interface CronogramaInversion {
  Construccion: FechaInversion;
  Exploracion: FechaInversion;
  Cierre: FechaInversion;
  PostCierre: FechaInversion;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface FechaInversion {
  FechaInicio: string;
  FechaFin: string;
  TotalMeses: string;
  Inversion: string;
}

export interface DescripcionEtapas {
  Documento: ArchivoAdjunto[];
  MineralAExplotar: Mineral[];
  ComponentesPrincipales: ComponentePrincipal;
  Residuos: Residuos[];
  RequerimientoAgua: RequerimientoAgua[];
  ComponentesProyecto: ComponentesProyecto[];
  BalanceAgua: ArchivoAdjunto[];
  Archivos: ArchivoAdjunto[];
  Instalaciones: ArchivoAdjunto[];
  ArchivosMDS: ArchivoAdjunto[];
  MapaComponentes: ArchivoAdjunto[];
  Insumos: Insumos[];
  Maquinarias: Maquinarias[];
  Equipos: Equipos[];
  ViasAccesoExistente: ViasAccesoExistente[];
  ViasAccesoNueva: ViasAccesoNueva[];
  ManoObra: ManoObra;
  TipoManoObra: TipoManoObra[];
  FuenteAbastecimientoEnergia: FuenteAbastecimientoEnergia[];
  CierrePostCierre: string;
  Save: boolean;
  FechaRegistro: string;
  State:number; 
  TopSoil: ArchivoAdjunto[];
}

export interface Mineral {
  Id: number;
  Tipo: string;
  DescripcionTipo: string;
  Recurso: string;
  DescripcionRecurso: string;
  Porcentaje: string;
}

export interface ComponentePrincipal {
  NroPerforaciones: string;
  NroPlataformas: string;
  Zona: string;
  Datum: string;
  PlataformasPerforaciones: PlataformasPerforaciones[];
}

export interface PlataformasPerforaciones {
  Id: number;
  Plataforma: string;
  Este: string;
  Norte: string;
  Largo: string;
  Ancho: string;
  Profundidad: string;
  Cota: string;
  Distancia: string;
  FuenteAgua: string;
  DescripcionFuenteAgua: string;
  NumeroSondaje: string;
}

export interface ComponentesProyecto {
  Id: number;
  Principal: string;
  DescripcionPrincipal: string;
  Largo: string;
  Ancho: string;
  Profundidad: string;
  Cantidad: string;
  Area: string;
  Volumen: string;
  TopSoil: string;
  Actividades: string;
}

export interface Residuos {
  Id: number;
  Clasificacion: string;
  DescripcionClasificacion: string;
  Tipo: string;
  DescripcionTipo: string;
  Residuos: string;
  DescripcionResiduos: string;
  VolumenPorDia: string;
  Volumen: string;
  UnidadesPeso: string;
  DescripcionUnidadPeso: string;
  PesoPerCapita: string;
  Peso: string;
  Frecuencia: string;
  DescripcionFrecuencia: string;
  VolumenTotal: string;
  PesoTotal: string;
  AlmacenajeTemporal: string;
  Comercializacion: string;
  Reaprovechamiento: string;
  Minimizacion: string;
  CantidadTotal: string;
  ECRRSS: boolean;
  EPSRRSS: boolean;
  Cantidad: string;
  TipoTratamiento: string;
  Observaciones: string;
  TratamientoEPSRRSS: boolean;
}

export interface RequerimientoAgua {
  Id: number;
  Fase: string;
  DescripcionFase: string;
  Etapa: string;
  DescripcionEtapa: string;
  Cantidad: string;
  NroDias: string;
  Total: string;
  NombreFuente: string;
  FuenteAbastecimiento: string;
  DescripcionFuente: string;
  Este: string;
  Norte: string;
  Zona: string;
  DescripcionZona: string;
  Datum: string;
  DescripcionDatum: string;
  DisponibilidadEstacional: string;
  UsosExistentes: string;
  SistemaCaptacion: string;
  SistemaConduccion: string;
  RequerimientoAguaPorMetro: string;
  LongitudPerforacion: string;
  CantidadDiariaUso: string;
  PorcentajeRetorno: string;
  CantidadAguaReciclada: string;
  CantidadAguaFresca: string;

}

export interface Insumos {
  Id: number;
  Insumos: string;
  DescripcionInsumos: string;
  Cantidad: string;
  UnidadMedida: string;
  DescripcionUnidadMedida: string;
  Almacenamiento: string;
  Manejo: string;
}

export interface Maquinarias {
  Id: number;
  Maquinaria: string;
  Descripcion: string;
  Cantidad: string;
}

export interface Equipos {
  Id: number;
  Equipo: string;
  Descripcion: string;
  Cantidad: string;
}

export interface ViasAccesoExistente {
  Id: number;
  TipoVia: string;
  DescripcionTipoVia: string;
  RutaInicio: string;
  RutaFin: string;
  Distancia: string;
  Tiempo: string;
}

export interface ViasAccesoNueva {
  Id: number;
  TipoVia: string;
  DescripcionTipoVia: string;
  Largo: string;
  Ancho: string;
  Material: string;
  Equipos: string;
}

export interface ManoObra {
  Construccion: string;
  PorcentajeConstruccion: string;
  Exploracion: string;
  PorcentajeExploracion: string;
  Cierre: string;
  PorcentajeCierre: string;
  Total: string;
}

export interface TipoManoObra {
  Id: number;
  NroPersonal: string;
  Origen: string;
  DescripcionOrigen: string;
  Especializacion: string;
}

export interface FuenteAbastecimientoEnergia {
  Id: number;
  FuenteEnergia: string;
  Caracteristicas: string;
}

export interface DescripcionMedioFisico {
  Metereologia: string;
  CalidadAire: string;
  CalidadRuidoAmbiental: string;
  Topografia: string;
  Geologia: string;
  Geomorfologia: string;
  Hidrologia: string;
  Hidrogeologia: string;
  CalidadAgua: string;
  EstudioSuelo: string;
  ClasificacionTierras: string;
  UsoActualTierra: string;
  CalidadSuelos: string;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface DescripcionMedioBiologico {
  CriteriosEvaluacion: string;
  DescripcionEcosistemas: string;
  Ecosistemas: string;
  FloraTerrestre: string;
  FaunaTerrestre: string;
  Hidrobiologia: string;
  EcosistemasFragiles: string;
  AreasNaturales: string;
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface DescripcionAspectoSocial {
  Indices: string;
  Descripcion: string;
  OtrosAspectos: string;
  Save: boolean;
  FechaRegistro: string;
  State:number;
}

export interface Arqueologia {
  Descripcion: string;
  Documentos: ArchivoAdjunto[];
  Save: true;
  FechaRegistro: string;
  State: number;
}

export interface PlanMinimizacion {
  Descripcion: string;
  Save: boolean;
  FechaRegistro: string;
  State:number;
}

export interface PlanContingencia {
  Descripcion: string;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}
export interface ProtocoloRelacionamiento {
  Descripcion: string;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}
export interface PlanCierre {
  DescripcionCierre: string;
  DescripcionPostCierre: string;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface ParticipacionCiudadana {
  Mecanismos: Mecanismos[];
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface Mecanismos {
  Id: number;
  Mecanismos: string;
  DescripcionMecanismo: string;
  Descripcion: string;
  Secuencia: string;
  DescripcionSecuencia: string;
  NroPersonas: string;
  Lugar: Lugar[];
  Participantes: Participantes[];
  Fechas: Fechas[];
  Documentacion: ArchivoAdjunto[];
}

export interface Lugar {
  Id: number;
  Region: string;
  DescripcionRegion: string;
  Provincia: string;
  DescricionProvincia: string;
  Distrito: string;
  DescripcionDistrito: string;
  Localidad: string;
  DescripcionLocalidad: string;
  Lugar: string;
  Direccion: string;
}

export interface Participantes {
  Id: number;
  Region: string;
  DescripcionRegion: string;
  Provincia: string;
  DescricionProvincia: string;
  Distrito: string;
  DescripcionDistrito: string;
  Localidad: string;
  DescripcionLocalidad: string;
  Descripcion: string;
}

export interface Fechas {
  Id: number;
  FechaInicio: string;
  HoraInicio: string;
  MinutoInicio: string;
  FechaFin: string;
  HoraFin: string;
  MinutoFin: string;
}

export interface Documentacion {
  Id: number;
  TipoAdjunto: string;
  Numero: string;
  Descripcion: string;
  ArchivoAdjunto: string;
}

export interface PlanManejoAmbiental {
  PlanManejo: PlanManejo[];
  Save: boolean;
  Resumen: Resumen;
  PlanVigilanciaAmbiental: PlanVigilanciaAmbiental;
  FechaRegistro: string;
  StatePlanManejo:  number;
}

export interface PlanManejo {
  Etapa: string;
  Medidas: string;
  Riesgos: string;
}

export interface PlanVigilanciaAmbiental {
  PuntosMonitoreo: PuntosMonitoreo[];
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State:number;
}

export interface PuntosMonitoreo {
  Codigo: string;
  TipoMuestra: string;
  ClaseMonitoreo: string;
  ZonaMuestreo: string;
  TipoProcedencia: string;
  Descripcion: string;
  Este: string;
  Norte: string;
  Zona: string;
  Datum: string;
  Altitud: string;
  ParametrosPlanVigilancia: ParametrosPlanVigilancia[];
  documentos: ArchivoAdjunto[];
}

export interface ParametrosPlanVigilancia {
  CodigoParametro: string;
  Parametro: string;
  FrecuenciaMuestreo: string;
  FrecuenciaReporte: string;
}

export interface Resumen {
  Compromisos: Compromisos[];
  MontoInversion: string;
  UnidadMonetaria: string;
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface Compromisos {
  Descripcion: string;
  Etapas: string;
  TipoActividad: string;
  CostoEstimado: string;
  Tecnologia: string;
}


export interface Consultora {
  EmpresaConsultora: EmpresaConsultora;
  ProfesionalConsultora: ProfesionalConsultora[];
  OtroProfesionalConsultora: OtroProfesionalConsultora[]
  Documentos: ArchivoAdjunto[];
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface EmpresaConsultora {
  Ruc: string;
  Nombre: string;
  IdCliente: number;
}

export interface ProfesionalConsultora {
  IdProfesional: number;
  Apellidos: string;
  //ApellidoMaterno:string;
  Nombres: string;
  Profesion: string;
  Colegiatura: string;
}

export interface OtroProfesionalConsultora {
  IdProfesional: number;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Nombres: string;
  Profesion: string;
  Colegiatura: string;
  Email: string;
}


export interface SolicitudTitulo {
  SolicitaTitulo: string;
  RequisitoA: SolicitudTituloRequisito;
  RequisitoB: SolicitudTituloRequisito;
  RequisitoC: SolicitudTituloRequisito;
  RequisitoD: SolicitudTituloRequisito;
  RequisitoE: SolicitudTituloRequisito;
  RequisitoF: SolicitudTituloRequisito;
  Save: boolean;
  FechaRegistro: string;
  State: number;
}

export interface SolicitudTituloRequisito {
  Requisito: boolean;
  Formato: string;
  Pago: string;
}

export interface DatosGeneralesEmpresa {
  DatosTitular: DatosTitular;
  DatosRepresentante: DatosRepresentante;
}

export interface RepresentanteAcreditado {
  idRepresentante: number;
  nombres: string;
}

export interface DerechosMineros {
  IdUnidad: string;
  Nombre: string;
  TipoExpediente: string;
  Titularidad: string;
  PorcentajeParticipacion: number;
  FecFormulacion: string;
}

export interface ArchivoAdjunto {
  Id: number;
  Nombre: string;
  Tipo: number;
  DescripcionTipo: string;
}