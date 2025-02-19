import { ProfesionalModel } from '../Profesional/ProfesionalModel';
import { TipoSolicitudModel } from '../TipoSolicitudModel';

export class TramiteModel {
    claveAcceso: string = '';
    codigoTributo: string;
    completo: boolean;
    docExpediente: string;
    docExpedienteSub: string;
    documentoAtendido: string = '';
    esGratuito: boolean = false;
    estado: string = '';
    fechaAcuseAte: string;
    fechaAcuseObs: string;
    fechaCreacion: string;
    fechaEnvio: string;
    fechaEnvioSub: string;
    fechaRecibido: string;
    id: number;
    numExpdiente: string;
    numSolicitud: string;
    numeroDocumento: string;
    observaciones: string = '';
    requisitos: Requisito[];
    rowId: number;
    tipoDocumento: string;
    tipoPersona: string;
    tipoSolicitud: TipoSolicitudModel;
    codigo: number;
    descripcion: string;
    tipoSubsanacion: string;
    tupaAcronimo: string;
    tupaCodigo: string = '';
    tupaId: number = 0;
    tupaNombre: string = '';
    tupaOrganizacion: string;
    tupaPlazoDias: number;
    tupaTipoEvaluacion: string;
    tupaUnidadId: number;    
    idEstudio:number = 0;
}

export interface Requisito {
    tramiteId: number;
    tramiteReqId: number;
    tupaId: number;
    tupaReqId: number;
    descripcion: string;
    tieneAdjunto: boolean;
    tieneFormAnexo: boolean;
    tieneCosto: boolean;
    completo: boolean;
    codigoFormAnexo: string;
    rutaDocumento: string;
    plantillaAdjunto: string;
    tramiteReqRefId: number;
    movId: number;
    costo: number;
    obligatorio: boolean;
    codigoTributo: string;
    pagoVoucher: string;
    pagoFecha: string;
    pagoOficina: string;
    conforme: boolean;
    observaciones: string;
    clasificador: string;
    orden: number;
    archivoId: string;
    pagosAdicionales: number;
    montoAdicional: number;
    tipoSolicitud: TipoSolicitudModel;
    requiereFirma: boolean;
    firmado: boolean;
    profAsigId?: number;
    costoFormatted: string;
    profAsignado?: ProfesionalModel;
    rutaCarpeta: string;

    tipoSolicitudTupaCod: string | number;
    tipoSolicitudTupaDesc: string;
    xOrden: string | number;
    nombreEstado: string;
}


export interface EnviarSolicitudModel{
    IdSolicitud: number;
    Documentos: ArchivosAdjuntos[];
    NroExpediente:number;
}

export interface ArchivosAdjuntos{
    CodigoGenerado: number;
    IdRequisito: number;
    NombreDocumento: string;
}

export interface AdjuntarAdicional{
    IdTramite:number;
    NombreArchivo:string;
    NumeroDocumentoRespuesta: number;
    TipoTramite:number;
    TipoDocumento:number;
    NumeroDocumento:string;
    Descripcion:string;
}

export interface EnviarTramiteAdicionalModel{
    IdSolicitud: number;
    Documentos: ArchivosAdjuntos[];
    NroExpediente: number;
    TipoComunicacion: number;
}