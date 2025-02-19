import { Anexo } from "src/app/core/models/Anexos/AnexoMain";
import { TipoDocumentoModel } from "src/app/core/models/TipoDocumentoModel";

export class Anexo002_E27Request extends Anexo {
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
  empresa: string;
  servicio: string;
  nombreEstacion: string;
  ubicacionEstacion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  localidad: string;

  corGradoLO: string;
  corMinutoLO: string;
  corSegundosLO: string;
  corGradoLS: string;
  corMinutoLS: string;
  corSegundosLS: string;
  altitud: string;

  indicativo: string ;
  bloqueHorario: string;
}

export class Seccion2 {
  marca: string;
  modelo: string;
  potenciaW: string;
  potenciadBm: string;
  rangoFrecuenciaTx: string;
  rangoFrecuenciaRx: string;
  capacidadPortadora: string;
  tipoEmision: string;
}

export class Seccion3 {
  tipoAntenaSector1: string;
  tipoAntenaSector2: string;
  tipoAntenaSector3: string;
  tipoAntenaSector4: string;

  marcaSector1: string;
  marcaSector2: string;
  marcaSector3: string;
  marcaSector4: string;

  modeloSector1: string;
  modeloSector2: string;
  modeloSector3: string;
  modeloSector4: string;

  gananciadBiSector1: string;
  gananciadBiSector2: string;
  gananciadBiSector3: string;
  gananciadBiSector4: string;

  pireWSector1: string;
  pireWSector2: string;
  pireWSector3: string;
  pireWSector4: string;

  pireDbmSector2: string;
  pireDbmSector1: string;
  pireDbmSector3: string;
  pireDbmSector4: string;

  alturaInstaladaSector1: string;
  alturaInstaladaSector2: string;
  alturaInstaladaSector3: string;
  alturaInstaladaSector4: string;

  distanciaDeAnteanaSector1: string;
  distanciaDeAnteanaSector2: string;
  distanciaDeAnteanaSector3: string;
  distanciaDeAnteanaSector4: string;

  alturaTorre: string;
  alturaEdificio: string;
  numeroSectores: string;
}

export class Seccion4 {
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

export class Seccion5 {
  declaracion_1: boolean;
}
