export class Seccion1 {
    // distrito: string;
    // provincia: string;
    // departamento: string;
    // ubigeo?:string
    // 
    areas: Area[]

    constructor() {
        this.areas = []
    }
    flagANivelNacional: boolean
}

export class Area {
  departamento: string
  provincia: string
  distrito: string
  //ubigeo?:string
}

export class Seccion2 {
  almacenamientoRetransmision: boolean
  facsimil: boolean
  mensajeriaInterpersonal: boolean
  mensajeriaVoz: boolean
  servicioConsulta: boolean
  conmutacionDatos: boolean
  teleproceso: boolean
  telealarma: boolean
  telemando: boolean
  teleaccion: boolean
  teletexto: boolean
  teletex: boolean
  videotex: boolean
  suministroInformacion: boolean
  concesionarios: Concesionario[]

  constructor() {
    this.concesionarios = []
  }
}
export class Seccion3 {
  equipos: Equipo[]

  constructor() {
      this.equipos = []
  }
}

export class Seccion4 {
  descripcionServicio: string
}
export class Seccion5 {
  diagramaConexionRed: DiagramaConexionRed

  constructor() {
    this.diagramaConexionRed = new DiagramaConexionRed()
  }
}

export class Equipo {
    nombre: string
    marca: string
    modelo: string
    cantidad: number
}
export class DiagramaConexionRed {
    nombre: string
    tamanio: number
    extension?: string
    ruta: string
    archivo: File
}

export class Concesionario {
  ruc: string
  nombre: string
}
