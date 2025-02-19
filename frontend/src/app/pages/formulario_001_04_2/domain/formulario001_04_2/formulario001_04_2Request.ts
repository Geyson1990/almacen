import { Formulario } from 'src/app/core/models/Formularios/FormularioMain';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Formulario001_04_2Request extends Formulario {
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
  seccion7: Seccion7;

  constructor() {
    this.seccion1 = new Seccion1();
    this.seccion2 = new Seccion2();
    this.seccion3 = new Seccion3();
    this.seccion4 = new Seccion4();
    this.seccion5 = new Seccion5();
    this.seccion6 = new Seccion6();
    this.seccion7 = new Seccion7();
  }
}

export class Seccion1 {
  unidadOrg: string;
}

export class Seccion2 {
  tipoSolicitante: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  razonSocial: string;
  domicilioLegal: string;
  departamento: string;
  provincia: string;
  distrito: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  telefono: string;
  celular: string;
  email: string;
  ruc: string;
  representanteLegal: RepresentanteLegal;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
    this.representanteLegal = new RepresentanteLegal();
  }
}

export class RepresentanteLegal {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  domicilioLegal: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  oficinaRegistral: OficinaRegistralModel;
  partida: string;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
    this.oficinaRegistral = new OficinaRegistralModel();
  }
}

export class Seccion3 {
  notificaCorreo: boolean;
}

export class Seccion4 {
  infoSolicita: string;
}

export class Seccion5 {
  formaEntrega: number;
  formatoA0: boolean;
  formatoA1: boolean;
  formatoA2: boolean;
}

export class Seccion6 {
  declaracion_1: boolean;
}

export class Seccion7 {
  dni: string;
  nombre: string;
}
