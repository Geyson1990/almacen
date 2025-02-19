import { A001_C28_Seccion1, A001_C28_Seccion2 } from './Secciones';

export class MetaData {
    seccion1: A001_C28_Seccion1;
    seccion2: A001_C28_Seccion2;

    constructor() {
        this.seccion1 = new A001_C28_Seccion1();
        this.seccion2 = new A001_C28_Seccion2();
    }
}