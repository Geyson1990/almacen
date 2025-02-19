import { A001_B28_Seccion1, A001_B28_Seccion2 } from './Secciones';

export class MetaData {
    seccion1: A001_B28_Seccion1;
    seccion2: A001_B28_Seccion2;

    constructor() {
        this.seccion1 = new A001_B28_Seccion1();
        this.seccion2 = new A001_B28_Seccion2();
    }
}