import { Seccion1, Seccion2 } from './Secciones';

export class MetaData {
    personaNatural: boolean;
    personaJuridica: boolean;
    seccion1: Seccion1;
    seccion2: Seccion2;
    dia: string;
    mes: string;
    anio: string;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
    }
}
