import { A002_A17_2_Seccion1, A002_A17_2_Seccion2, A002_A17_2_Seccion3 } from './Secciones';

export class MetaData {
    seccion1: A002_A17_2_Seccion1;
    seccion2: A002_A17_2_Seccion2;
    seccion3: A002_A17_2_Seccion3[];
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string;
    constructor() {
        this.seccion1 = new A002_A17_2_Seccion1();
        this.seccion2 = new A002_A17_2_Seccion2();
        this.seccion3 = [];
    }
}
