import { Formulario } from 'src/app/core/models/Formularios/FormularioMain';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Formulario003_28Request extends Formulario {
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

  constructor() {
    this.seccion1 = new Seccion1();
    this.seccion2 = new Seccion2();
    this.seccion3 = new Seccion3();
    this.seccion4 = new Seccion4();
    this.seccion5 = new Seccion5();
  }
}

export class Seccion1 {
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
}

export class Seccion2 {
  notificaCorreo: string;
}

export class Seccion3 {
  tipoSolicitante: string;
  perNatural: PerNatural;
  perJuridica: PerJuridica;

  constructor() {
    this.perNatural = new PerNatural();
    this.perJuridica = new PerJuridica();
  }
}

export class Seccion4 {
  declaracion1: boolean;
  declaracion2: boolean;
}

export class Seccion5 {
  tipoDocumentoSolicitante: string;
  nombreTipoDocumentoSolicitante: string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante: string;
}

export class PerNatural {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  ruc: string;
  domicilioLegal: string;
  distrito: string;
  provincia: string;
  departamento: string;
  telefono: string;
  celular: string;
  email: string;
  discapacidad: Discapacidad;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
    this.discapacidad = new Discapacidad();
  }
}

export class Discapacidad {
  resConadis: string;
  visual: boolean;
  auditiva: boolean;
  mental: boolean;
  fisica: boolean;
  lenguaje: boolean;
  intelectual: boolean;
  multiple: boolean;
}

export class PerJuridica {
  ruc: string;
  razonSocial: string;
  domicilioLegal: string;
  distrito: string;
  provincia: string;
  departamento: string;
  representanteLegal: RepresentanteLegal;

  constructor() {
    this.representanteLegal = new RepresentanteLegal();
  }
}

export class RepresentanteLegal {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  telefono: string;
  celular: string;
  email: string;
  domicilioLegal: string;
  oficinaRegistral: OficinaRegistralModel;
  partida: string;
  asiento: string;
  objetoSocial: string;
  distrito: string;
  provincia: string;
  departamento: string;
  cargo: string;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
    this.oficinaRegistral = new OficinaRegistralModel();
  }
}
