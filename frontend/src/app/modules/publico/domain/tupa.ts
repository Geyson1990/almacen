import { TupaRequisito } from "./requisito";
import { TipoSolicitud } from "./tipo-solicitud";

export interface Tupa {
  id: number;
  codigo: string;
  organizacion: string;
  acronimo: string;
  tipoEvaluacion: string;
  nombre: string;
  plazoDias: number;
  tieneCosto: boolean;
  costo: number;
  codigoTributo: string;
  esGratuito: boolean;
  requisitos: TupaRequisito[];
  tipoSolicitud: TipoSolicitud[];
}

