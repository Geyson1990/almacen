import { TipoSolicitudModel } from "../../TipoSolicitudModel";

export class MetaData {
    tipoSolicitud:TipoSolicitudModel;
    nombreUsuario: string;
    numeroDocumento: string;
    enCalidadDe: string;
    empresa: string;
    poderInscrito: string;
    domicilio: string;
    dia:string;
    mes:string;
    anio:string;
    file: File
}