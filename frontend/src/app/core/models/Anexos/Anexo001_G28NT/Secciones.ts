
export class Seccion2 {
    terreBanda: BandaAntena;
    mariBanda: BandaAntena;
    aeroBanda: BandaAntena;
    sateliteFijo: boolean;
    sateliteMovil: boolean;
    estacionFijo: boolean;
    estacionMovil: boolean;

    constructor() {
        this.terreBanda = new BandaAntena();
        this.mariBanda = new BandaAntena();
        this.aeroBanda = new BandaAntena();
    }
}

export class Seccion3 {
    ubicacion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    lonOeste: UbicacionGMS;
    latSur: UbicacionGMS;
    estacionTransRecep: boolean;
    estacionSoloTrans: boolean;

    constructor() {
        this.lonOeste = new UbicacionGMS();
        this.latSur = new UbicacionGMS();
    }
}

export class Seccion3a {
    proveedorSat: string;
    nombreSat: string;
    listaSatelite: Satelite[];

    constructor() {
        this.listaSatelite = [];
    }
}

export class Seccion3b {
    listaEquipo: Equipo[];
    listaAntena: Antena[];
    alturaTorre: string;
    alturaEdificio: string;

    constructor() {
        this.listaEquipo = [];
        this.listaAntena = [];
    }
}

export class Seccion4 {
    colegioPro: string;
    nroColegiatura: string;
}

export class Seccion5 {
    declaracion1: string;
}

export class Seccion6 {
    nroDocumento: string;
    nombreCompleto: string;
    razonSocial: string;
}

export class BandaAntena {
    hf: boolean;
    vhf: boolean;
    uhf: boolean;
    shf: boolean;
}

export class UbicacionGMS {
    grados: string;
    minutos: string;
    segundos: string;
}

export class Satelite {
    transponder: string;
    frecSubida: string;
    frecBajada: string;
    polarizacion: string;
    anchoBanda: string;
    tasaSimbolo: string;
    modulacion: string;
    fec: string;
}

export class Equipo {
    tipo: string;
    marca: string;
    modelo: string;
    nroSerie: string;
    codHomologa: string;
    caracteristica: string;
}

export class Antena {
    tipo: string;
    marca: string;
    modelo: string;
    ganancia: string;
    codHomologa: string;
}
