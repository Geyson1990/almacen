import { A002_A28_Seccion1, A002_A28_Seccion2 } from './Secciones';
/*
export class MetaData {
    anexosSolicitados : AnexoSolicitado[];
    constructor() {
        this.anexosSolicitados = [];
    }
}*/

export class MetaData{
    seccion1: A002_A28_Seccion1;
    seccion2: A002_A28_Seccion2;

    constructor() {
        this.seccion1 = new A002_A28_Seccion1();
        this.seccion2 = new A002_A28_Seccion2();
    }
}