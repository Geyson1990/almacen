import { Seccion1, Seccion2} from './Secciones';

export class MetaData {
    
    seccion1: Seccion1;
    seccion2: Seccion2;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
    }
}
