import { Anexo } from 'src/app/core/models/Anexos/AnexoMain';

export class Anexo003_B28Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}

export class MetaData {
  seccion1: Seccion1;
  seccion2: Seccion2;
  seccion3: Seccion3;
  seccion4: Seccion4;
  seccion5: Seccion5;
  seccion6: Seccion6;

  constructor() {
    this.seccion1 = new Seccion1();
    this.seccion2 = new Seccion2();
    this.seccion3 = new Seccion3();
    this.seccion4 = new Seccion4();
    this.seccion5 = new Seccion5();
    this.seccion6 = new Seccion6();
  }
}

export class Seccion1 {
  denominacion: string;
  nroLicencia: string;
  indicativo: string;
}

export class Seccion2 {
  ubicacion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  lonOeste: UbicacionGMS;
  latSur: UbicacionGMS;

  constructor() {
    this.lonOeste = new UbicacionGMS();
    this.latSur = new UbicacionGMS();
  }
}

export class UbicacionGMS {
  grados: string;
  minutos: string;
  segundos: string;
}

export class Seccion3 {
  marca: string;
  modelo: string;
  nroSerie: string;
  potencia: string;
  subTono: string;
  banda: string;
  anio: string;
}

export class Seccion4 {
  tipoAntena: string;
  marca: string;
  modelo: string;
  ganancia: string;
  tipoCable: string;
  filtro: string;
}

export class Seccion5 {
  declaracion1: string;
}

export class Seccion6 {
  nroDocumento: string;
  nombreCompleto: string;
  razonSocial: string;
}
