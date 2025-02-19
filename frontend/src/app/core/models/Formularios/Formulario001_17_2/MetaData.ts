import { Seccion1,  Seccion3, Seccion5, Seccion6 } from './Secciones';

export class MetaData {

    seccion1: Seccion1;
    seccion3: Seccion3;
    seccion5: Seccion5;
    seccion6: Seccion6;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion3 = new Seccion3();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6()
    }
}