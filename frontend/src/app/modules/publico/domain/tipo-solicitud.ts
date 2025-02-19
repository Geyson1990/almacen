import { TupaRequisito } from "./requisito";

export interface TipoSolicitud {
  codigo: number;
  descripcion: string;
  tipoEvaluacion: string;
  plazoAtencion: number;
  requisitos: TupaRequisito[]
}
