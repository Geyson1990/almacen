import { TipoSolicitudModel } from '../TipoSolicitudModel';
import { RequisitoModel } from './RequisitoModel';

export class ProcedimientoModel {
  id: number;
  codigo: string;
  dirGeneral: string;
  acronimo: string;
  denominacion:string;
  plazo: string;
  tipoEvaluacion: string;
  nombre: string;
  plazoDias: number;
  tieneCosto: boolean;
  costo: number;
  codigoTributo: string;
  esGratuito: boolean;
  requisitos: RequisitoModel[] | any[];
  tipoSolicitud: string | TipoSolicitudModel[]; //se agrega TipoSolicitudModel[]
  // Propiedades adicionales
  tiposPersona?: string | Array<string>;
  flagVuce?: boolean;
  flagDigital?: boolean;
  materia?: string;
  sector?: string;
  uriFicha?: string;
  nombreFicha?: string;
  // tiposSolicitud?: TipoSolicitudModel[]
  tupaNotas?: TupaNota[];
  dirLinea: string;
  idSector:number;
  idTupa:number;
}

export interface TupaNota {
  id: number;
  tupaId: number;
  secuencia: number;
  descripcion: string;
}
