import { SelectionModel } from '../../SelectionModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { Tripulacion, A002_I17_Seccion2 } from './Tripulacion';

export class MetaData {
    listaTripulacion: Tripulacion[];
    dia:string;
    mes:string;
    anio:string;
    pathName:string;
    file:File;
    seccion2: A002_I17_Seccion2;
    constructor() {
        this.seccion2 = new A002_I17_Seccion2();
    }
}
