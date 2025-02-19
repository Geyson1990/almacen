import { Formulario } from '../../../core/models/Formularios/FormularioMain';
import { TipoDocumentoModel } from "src/app/core/models/TipoDocumentoModel"

export class Formulario003_12NTRequest extends Formulario {
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
  seccion5: Seccion5;

  constructor() {
    this.seccion1 = new Seccion1()
    this.seccion2 = new Seccion2()
    this.seccion3 = new Seccion3()
    this.seccion4 = new Seccion4()
    this.seccion5 = new Seccion5()
  }
}

export class Seccion1 {
  codigoProcedimiento: string
  tipoLicencia: string
}

export class Seccion2 {
  modalidadNotificacion: string
}

export class Seccion3 {
  nombres: string
  tipoDocumento: TipoDocumentoModel
  numeroDocumento: string
  ruc: string
  telefono: string
  celular: string
  email: string
  domicilioLegal: string
  distrito: string
  provincia: string
  departamento: string
  nacionalidad: string
  fechaNacimiento: string
  registroLicencia: string
  numeroLicencia: string

  constructor(){
    this.tipoDocumento = new TipoDocumentoModel();
  }
}

export class Seccion4 {
  declaracion1: boolean
  declaracion2: boolean
}

export class Seccion5 {
  nombresFirmante: string
  nroDocumentoFirmante: string
}

