import { RequisitoModel } from "./Tramite/RequisitoModel";

export class TipoSolicitudModel {
    codigo: number;
    codigostr: string;
    descripcion: string;
    tipoEvaluacion: string;
    plazoAtencion: number;
    //detalle: string;
    requisitos?: RequisitoModel[]
}
