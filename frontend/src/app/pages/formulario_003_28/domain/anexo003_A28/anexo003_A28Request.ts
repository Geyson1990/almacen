import { Anexo } from 'src/app/core/models/Anexos/AnexoMain';

export class Anexo003_A28Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super();
    this.metaData = new MetaData();
  }
}

export class MetaData {
  seccion2: Seccion2;
  seccion3: Seccion3;
  seccion4: Seccion4;
  seccion5: Seccion5;
  seccion6: Seccion6;

  constructor() {
    this.seccion2 = new Seccion2();
    this.seccion3 = new Seccion3();
    this.seccion4 = new Seccion4();
    this.seccion5 = new Seccion5();
    this.seccion6 = new Seccion6();
  }
}

export class Seccion2 {
  listaEquipoTrans: EquipoTrans[];

  constructor() {
    this.listaEquipoTrans = [];
  }
}

export class Seccion3 {
  tipoAntena: string;
  marca: string;
  modelo: string;
  ganancia: string;
  tipoCable: string;
  filtro: string;
}

export class Seccion4 {
  listaEquipoAux: EquipoAux[];

  constructor() {
    this.listaEquipoAux = [];
  }
}

export class Seccion5 {
  declaracion1: string;
}

export class Seccion6 {
  nroDocumento: string;
  nombreCompleto: string;
  razonSocial: string;
}

export class EquipoTrans {
  marca: string;
  modelo: string;
  nroSerie: string;
  potencia: string;
  tipoEmision: string;
  bandaOpera: string;
  anio: string;
}

export class EquipoAux {
  descripcion: string;
  marca: string;
  modelo: string;
  nroSerie: string;
  anio: string;
}
