import { Seccion1, Seccion2, Seccion3, Seccion3a, Seccion5, Seccion6, Seccion7 } from './Secciones';

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion3a: Seccion3a;
    seccion4: Seccion3;
    seccion4a: Seccion3a;
    seccion5: Seccion5;
    seccion6: Seccion6;
    seccion7: Seccion7;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion3a = new Seccion3a();
        this.seccion4 = new Seccion3();
        this.seccion4a = new Seccion3a();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
        this.seccion7 = new Seccion7();
    }
}
