import { A003_C17_Seccion1, A003_C17_Seccion2} from './Secciones';

export class MetaData {
    seccion1: A003_C17_Seccion1;
    seccion2: A003_C17_Seccion2;
    
    constructor() {
        this.seccion1 = new A003_C17_Seccion1();
        this.seccion2 = new A003_C17_Seccion2();        
    }
}
