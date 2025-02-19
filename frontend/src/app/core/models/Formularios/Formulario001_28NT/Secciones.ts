import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  modalidadServicio: string;
  modalidadOtroServicio:string;
}

export class ModalidadServicio {
  fijo: boolean;
  movil: boolean;
  microondas: boolean;
  servicioSat: boolean;
  circCeTv: boolean;
  otros: boolean;
  otrosDesc: string;
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

export class Seccion5 {
  declaracion1: boolean;
  declaracion2: boolean;
}

export class Seccion6 {
  dni: string;
  nombre: string;
}
