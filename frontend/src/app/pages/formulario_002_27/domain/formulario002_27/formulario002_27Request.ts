
import { Formulario } from 'src/app/core/models/Formularios/FormularioMain';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Formulario002_27Request extends Formulario {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}

export class MetaData {
  seccion1: Seccion1;
  seccion2: Seccion2;
  seccion3: Seccion3;
  seccion4: Seccion4;
  seccion6: Seccion6;

  constructor() {
    this.seccion1 = new Seccion1();
    this.seccion2 = new Seccion2();
    this.seccion3 = new Seccion3();
    this.seccion4 = new Seccion4();
    this.seccion6 = new Seccion6();
  }
}

export class Seccion1 {
  codigoProcedimiento: string;
}

export class Seccion2 {
  modalidad: string;
}

export class Seccion3 {
  tipoSolicitante: string;
  nombresApellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  ruc: string;
  razonSocial: string;
  domicilioLegal: string;
  pn_departamento: UbigeoResponse;
  pn_provincia: UbigeoResponse;
  pn_distrito: UbigeoResponse;
  distrito: string;
  provincia: string;
  departamento: string;
  telefono: string;
  celular: string;
  email: string;
  representanteLegal: RepresentanteLegal;
  datosContacto: DatosContacto;
  habilitacionProfesional:HabilitacionProfesional

  constructor() {
      this.representanteLegal = new RepresentanteLegal();
      this.datosContacto = new DatosContacto();
      this.habilitacionProfesional = new HabilitacionProfesional();
      this.pn_departamento = new UbigeoResponse();
      this.pn_provincia = new UbigeoResponse();
      this.pn_distrito = new UbigeoResponse();
  }
}

export class RepresentanteLegal {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  domicilioLegal: string;
  oficinaRegistral: OficinaRegistralModel;
  partida: string;
  asiento: string;
  distrito: UbigeoResponse;
  provincia: UbigeoResponse;
  departamento: UbigeoResponse;
  cargo: string;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
    this.oficinaRegistral = new OficinaRegistralModel();
    this.departamento = new UbigeoResponse();
    this.provincia = new UbigeoResponse();
    this.distrito = new UbigeoResponse();
  }
}

export class DatosContacto {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  telefono: string;
  celular: string;
  email: string;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
  }
}
export class HabilitacionProfesional{
  colegioProfesional:string;
  nroColegiatura:string;
}

export class Seccion4 {
  declaracion_1: boolean;
  declaracion_2: boolean;
}

export class Seccion6 {
  tipoDocumentoSolicitante: string;
  documento: string;
  numeroDocumentoSolicitante: string;
  nombreSolicitante: string
}
