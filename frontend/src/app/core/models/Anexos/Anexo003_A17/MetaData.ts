import { A003_A17_Seccion1, A003_A17_Seccion2, A003_A17_Seccion3 } from './Secciones';

export class MetaData {
    seccion1: A003_A17_Seccion1;
    seccion2: A003_A17_Seccion2;
    seccion3: A003_A17_Seccion3;

    constructor() {
        this.seccion1 = new A003_A17_Seccion1();
        this.seccion2 = new A003_A17_Seccion2();
        this.seccion3 = new A003_A17_Seccion3();
    }
}
