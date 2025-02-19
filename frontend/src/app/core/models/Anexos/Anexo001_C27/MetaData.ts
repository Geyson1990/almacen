import {  A001_C27_Seccion1, A001_C27_Seccion2, A001_C27_Seccion3 } from './Secciones';

export class MetaData {
    seccion1: A001_C27_Seccion1;
    seccion2: A001_C27_Seccion2;
    seccion3: A001_C27_Seccion3;

    constructor() {
        this.seccion1 = new A001_C27_Seccion1();
        this.seccion2 = new A001_C27_Seccion2();
        this.seccion3 =new  A001_C27_Seccion3();
    }
}