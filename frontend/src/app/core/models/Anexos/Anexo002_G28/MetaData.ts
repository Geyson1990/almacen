import { A002_G28_Seccion1, A002_G28_Seccion2, A002_G28_Seccion3, A002_G28_Seccion4 } from './Secciones';

export class MetaData {
    seccion1: A002_G28_Seccion1;
    seccion2: A002_G28_Seccion2;
    seccion3: A002_G28_Seccion3;
    seccion4: A002_G28_Seccion4;

    constructor() {
        this.seccion1 = new A002_G28_Seccion1();
        this.seccion2 = new A002_G28_Seccion2();
        this.seccion3 = new A002_G28_Seccion3();
        this.seccion4 = new A002_G28_Seccion4();
    }
}