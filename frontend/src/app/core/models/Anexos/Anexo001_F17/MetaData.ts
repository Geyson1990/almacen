import { SelectionModel } from '../../SelectionModel';
import { TipoSolicitudModel } from '../../TipoSolicitudModel';

export class MetaData {
    tipoSolicitud:TipoSolicitudModel;
    nombreUsuario: string;
    numeroDocumento: string;
    domicilio: string;
    razonSocial: string;
    nacionalidad: SelectionModel;
    dia:string;
    mes:string;
    anio:string;
    file:File
}