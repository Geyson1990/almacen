import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { RequisitoModel } from './RequisitoModel';

export class TupaModel {
    idTupa:number;
    id: number;
    codigo: string;
    dirGeneral: string;
    acronimo: string;
    tipoEvaluacion: string;
    nombre: string;
    plazoDias: number;
    tieneCosto: boolean;
    costo: number;
    codigoTributo: string;
    esGratuito: boolean;
    requisitos: RequisitoModel[];
    tipoSolicitud: TipoSolicitudModel[];
    dirLinea: string;

    denominacion:string;
    plazo:number;
    dependencia: string;
}



export class DonwloadDocument{
    id:number;
    nombre: string;
    base64Documento:string;
}


export interface Document{
    Name:string;
}
