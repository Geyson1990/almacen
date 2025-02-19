import { A002_B17_2_Seccion1, A002_B17_2_Seccion2, A002_B17_2_Seccion3, A002_B17_2_Seccion4, A002_B17_2_Seccion5 } from './Secciones';

export class MetaData {
    seccion1: A002_B17_2_Seccion1;
    seccion2: A002_B17_2_Seccion2;
    seccion3: A002_B17_2_Seccion3[];
    seccion4: A002_B17_2_Seccion4[];
    seccion5: A002_B17_2_Seccion5[];
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string;
    constructor() {
        this.seccion1 = new A002_B17_2_Seccion1();
        this.seccion2 = new A002_B17_2_Seccion2();
        this.seccion3 = [];
        this.seccion4 = [];
        this.seccion5 = [];
    }
}
