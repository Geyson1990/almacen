
export class Seccion2 {
    terreBanda: string;
    //mariBanda: string;
    //aeroBanda: string;
    mariBanda: BandaAntena;
    aeroBanda: BandaAntena;
    file?: File;
    pathName?: string;
    fileExcel?: File;
    pathNameExcel?: string;
    constructor() {
        //this.terreBanda = new BandaAntena();
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
    //file?: File;
    //pathName?: string;

    constructor() {
        this.lonOeste = new UbicacionGMS();
        this.latSur = new UbicacionGMS();
    }
}

export class Seccion3a {
    equipo: string;
    cantidad: string;
    marca: string;
    modelo: string;
    nroSerie: string;
    potencia: string;
    bandaFrec: string;
    codHomologa: string;
    antena: Antena;
    //file?: File;
    //pathName?: string;

    constructor() {
        this.antena = new Antena();
    }
}

export class Seccion4 {
    portZonaOpera: string;
    vehiZonaOpera: string;
    vehiPlaca: string;
    EmbarMatricula: string;
    AeroMatricula: string;
}

export class Seccion5 {
    colegioPro: string;
    nroColegiatura: string;
}

export class Seccion6 {
    declaracion1: string;
}

export class Seccion7 {
    nroDocumento: string;
    nombreCompleto: string;
    razonSocial: string;
}

export class BandaAntena {
    hf: boolean;
    vhf: boolean;
    uhf: boolean;
}

export class UbicacionGMS {
    grados: string;
    minutos: string;
    segundos: string;
}

export class Antena {
    tipo: string;
    marca: string;
    modelo: string;
    ganancia: string;
    codHomologa: string;
    alturaTorre: string;
    alturaRadia: string;
    //file?: File;
    //pathName?: string;
}
