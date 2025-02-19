import { SelectionModel } from '../../SelectionModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { TipoSolicitudModel } from '../../TipoSolicitudModel';
import { Tripulacion } from './Tripulacion';

export class MetaData {
    tipoSolicitud:TipoSolicitudModel;
    listaTripulacion: Tripulacion[];
    dia:string;
    mes:string;
    anio:string;
    file:File;
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string
}