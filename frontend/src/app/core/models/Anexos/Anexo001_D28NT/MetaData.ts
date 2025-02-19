import { Seccion2, Seccion3, Seccion3a, Seccion3b, Seccion4, Seccion5, Seccion6 } from './Secciones';

export class MetaData {
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion3a: Seccion3a;
    seccion3b: Seccion3b;
    seccion4: Seccion4;
    seccion5: Seccion5;
    seccion6: Seccion6;

    constructor() {
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion3a = new Seccion3a();
        this.seccion3b = new Seccion3b();
        this.seccion4 = new Seccion4();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
    }
}
