
export class Seccion0 {
    cambioUbicacion: boolean;
    ampliaFrecuencia: boolean;
    cambioFrecuencia: boolean;
    cancelaFrecuencia: boolean;
    ampliaHorario: boolean;
    cambioHorario: boolean;
    cancelaHorario: boolean;
    otros: boolean;
}

export class Seccion1 {
    indicativo: string;
    ubicacion: string;
    frecuenciaOpera: string;
    horarioOpera: string;
}

export class Seccion2 {
    estacionFija: EstacionFija;
    estacionMovil: EstacionMovil;

    constructor() {
        this.estacionFija = new EstacionFija();
        this.estacionMovil = new EstacionMovil();
    }
}

export class Seccion3 {
    ampliaFrecuencia: AmpliaFrecuencia;
    cambioFrecuencia: CambioFrecuencia;
    cancelaFrecuencia: string;

    constructor() {
        this.ampliaFrecuencia = new AmpliaFrecuencia();
        this.cambioFrecuencia = new CambioFrecuencia();
    }
}

export class Seccion4 {
    ampliaHorario: AmpliaHorario;
    cambioHorario: CambioHorario;
    cancelaHorario: CancelaHorario;

    constructor() {
        this.ampliaHorario = new AmpliaHorario();
        this.cambioHorario = new CambioHorario();
        this.cancelaHorario = new CancelaHorario();
    }
}

export class Seccion5 {
    indicaModifica: string;
    caractActual: string;
    nuevaCaract: string;
}

export class Seccion6 {
    declaracion1: string;
}

export class Seccion7 {
    nroDocumento: string;
    nombreCompleto: string;
}

export class EstacionFija {
    ubicacion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    lonOeste: UbicacionGMS;
    latSur: UbicacionGMS;

    constructor() {
        this.lonOeste = new UbicacionGMS();
        this.latSur = new UbicacionGMS();
    }
}

export class EstacionMovil {
    portZonaOperacion: string;
    vehiZonaOperacion: string;
    embarMatricula: string;
    aeroMatricula: string;
}

export class UbicacionGMS {
    grados: string;
    minutos: string;
    segundos: string;
}

export class AmpliaFrecuencia {
    frecAdicional: string;
    horaOperacion: string;
}

export class CambioFrecuencia {
    frecCambio: string;
    nuevaFrec: string;
}

export class AmpliaHorario {
    horaAdicional: string;
    frecuencia: string;
}

export class CambioHorario {
    horaCambio: string;
    nuevoHorario: string;
    frecuencia: string;
}

export class CancelaHorario {
    horaCancela: string;
    frecuencia: string;
}
