import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Formulario } from '../../../core/models/Formularios/FormularioMain';

export class Formulario002_12Request extends Formulario {
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
  flagTripulantesTecnicos: boolean
  flagTripulantesAuxiliares: boolean
}

export class Seccion2 {
  modalidadNotificacion:string
}

export class Seccion3 {
  tripulantes: Tripulante[]
  tipoSolicitante: string
  nombres: string
  tipoDocumento: TipoDocumentoModel
  numeroDocumento: string
  ruc: string
  razonSocial: string
  telefono: string
  celular: string
  email: string
  domicilioLegal: string
  distrito: string
  provincia: string
  departamento: string
  representanteLegal: RepresentanteLegal

  constructor(){
      this.tipoDocumento = new TipoDocumentoModel();
      this.representanteLegal = new RepresentanteLegal();
      this.tripulantes = []
  }
}

export class Seccion4 {
  declaracion1: boolean
  declaracion2: boolean
}

export class Seccion5 {
  nombresFirmante: string
  nroDocumentoFirmante:string
}

export class RepresentanteLegal {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  tipoDocumento: TipoDocumentoModel
  numeroDocumento:string
  ruc: string
  telefono: string
  celular: string
  email: string
  domicilioLegal: string
  departamento: string
  provincia: string
  distrito: string
  ubigeo: string
  partida: string
  asiento: string
  oficinaRegistral: OficinaRegistralModel

  constructor(){
      this.tipoDocumento = new TipoDocumentoModel();
      this.oficinaRegistral = new OficinaRegistralModel();
  }
}

export class Tripulante {
  tipoDocIdentidad: string
  docIdentidad: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  tipoEvaluacionEquipo: string
}


