import { Seccion1, Seccion2} from './Secciones';

export class MetaData {
    hojaDatos: HojaDatos[];

    constructor() {
        this.hojaDatos = [];
    }
}

export class HojaDatos {
    seccion1: Seccion1;
    seccion2: Seccion2;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
    }
}
