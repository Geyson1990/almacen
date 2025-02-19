import { TipoSolicitudModel } from '../../TipoSolicitudModel';
import { A001_A17_Seccion1, A001_A17_Seccion2, A001_A17_Seccion3, A001_A17_Seccion4 } from './Secciones';

export class MetaData {
    permisoOriginario: boolean;
    permisoOcasional: boolean;
    tipoSolicitud:TipoSolicitudModel;
    seccion1: A001_A17_Seccion1;
    seccion2: A001_A17_Seccion2;
    seccion3: A001_A17_Seccion3;
    seccion4: A001_A17_Seccion4[]

    constructor() {
        this.seccion1 = new A001_A17_Seccion1();
        this.seccion2 = new A001_A17_Seccion2();
        this.seccion3 = new A001_A17_Seccion3();
        this.seccion4 = [];
    }
}