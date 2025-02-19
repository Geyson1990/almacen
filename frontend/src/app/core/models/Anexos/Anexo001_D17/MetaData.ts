import { TipoSolicitudModel } from '../../TipoSolicitudModel';
import { A001_D17_Seccion1, A001_D17_Seccion2, A001_D17_Seccion3 } from './Secciones';

export class MetaData {
    tipoSolicitud:TipoSolicitudModel;
    seccion1: A001_D17_Seccion1;
    seccion2: A001_D17_Seccion2[];
    seccion3: A001_D17_Seccion3;

    constructor() {
        this.seccion1 = new A001_D17_Seccion1();
        this.seccion2 = [];
        this.seccion3 = new A001_D17_Seccion3();
    }
}