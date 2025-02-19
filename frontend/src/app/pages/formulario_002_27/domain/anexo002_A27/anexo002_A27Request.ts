import { Anexo } from "src/app/core/models/Anexos/AnexoMain";

export class Anexo002_A27Request extends Anexo {
  metaData: MetaData;

  constructor() {
    super()
    this.metaData = new MetaData();
  }
}

export class MetaData {
  hojaDatos: HojaDatos[];

  constructor() {
      this.hojaDatos = [];
  }
}

export class HojaDatos {
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
  empresa: string
  servicio: string
  nombreEstacion: string
  ubicacionEstacion: string
  departamento: string
  provincia: string
  distrito: string
  localidad: string
  coordenadaGeograficaGradosLO: number
  coordenadaGeograficaMinutosLO: number
  coordenadaGeograficaSegundosLO: number
  coordenadaGeograficaGradosLS: number
  coordenadaGeograficaMinutosLS: number
  coordenadaGeograficaSegundosLS: number
  coordenadaGeograficaAltitud: number
  indicativo: string
  frecuenciaTx: number
  polarizacionTx: string
  frecuenciaRx: number
  polarizacionRx: string
  bloqueHorario: string
  configuracion: string
}

export class Seccion2 {
  marca: string
  modelo: string
  rangoFrecuencia: string
  potenciadBm: number
  potenciaW: number
  tipoEmision: string
  capacidad: number
}

export class Seccion3 {
  tipoAntena: string
  marcaSistemaRadiante: string
  modeloSistemaRadiante: string
  ganancia: string
  piredBm: string
  pireW: string
  alturaTorre: number
  alturaEdificio: number
  alturaInstalada: number
  distanciaAntena: string
}

export class Seccion4 {
  estacion: string
  azimut: number
  distancia: number
}

export class Seccion5 {
  dni: string
  nombresApellidos: string
  cip: string
  telefono: string
  celular: string
}

