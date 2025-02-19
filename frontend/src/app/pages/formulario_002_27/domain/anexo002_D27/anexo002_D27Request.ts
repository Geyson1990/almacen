import { Anexo } from "src/app/core/models/Anexos/AnexoMain";
import { TipoDocumentoModel } from "src/app/core/models/TipoDocumentoModel";


export class Anexo002_D27Request extends Anexo {
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
  empresa: string ;
  servicio: string ;
  nombreEstacion: string ;
  tipo: string ;
  ubicacionEstacion: string ;
  departamento: string ;
  provincia: string ;
  distrito: string ;
  localidad: string ;
  corGradoLO: string ;
  corMinutoLO: string ;
  corSegundosLO: string ;
  corGradoLS: string ;
  corMinutoLS: string ;
  corSegundosLS: string ;
  altitud: string ;
  indicativo: string ;
  nroportadorastransmision: string ;
  frecuenciaUplink: string ;
  frecuenciaDownlink: string ;
  bloqueHorario: string ;
  fechaInstalacion: string ;
}

export class Seccion2 {
  marca: string ;
  modelo: string ;
  potenciaW: string ;
  potenciadBm: string ;
  rangoFrecuencia: string ;
  capacidadPortadora: string ;
  tipoEmision: string ;
  nroTranspondedor: string ;
  amplificadorHPA: string ;
  amplificadorSSPA: string ;
}

export class Seccion3 {
  tipoAntena:string ;
  marca:string ;
  modelo:string ;
  ganancia:string ;
  diametroAntena:string ;
  anguloEleva:string ;
  azimut:string ;
  pireW:string ;
  pireDbm:string ;
  alturaTorre:string ;
  alturaEdificio:string ;
  alturaInstalada:string ;
  distanciaDeAnteanaPuntoAccesible:string ;
}

export class Seccion4 {
  orbitalSatelite:string;
}

export class Seccion5 {
  datosContacto: DatosContacto;
  constructor() {
    this.datosContacto = new DatosContacto();
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
  cip: string;

  constructor() {
    this.tipoDocumento = new TipoDocumentoModel();
  }
}

export class Seccion6 {
  declaracion_1:boolean;
}
