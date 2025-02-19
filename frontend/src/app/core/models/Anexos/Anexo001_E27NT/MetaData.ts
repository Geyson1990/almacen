import { Seccion1, Seccion2, Seccion3} from './Secciones';

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;

    constructor() {
      this.seccion1 = new Seccion1();
      this.seccion2 = new Seccion2();
      this.seccion3 = new Seccion3();
  }
}
