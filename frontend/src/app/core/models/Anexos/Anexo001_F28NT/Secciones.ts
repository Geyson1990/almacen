
export class Seccion1 {
    frecModul: boolean;
    sonOndMed: boolean;
    ondCorTrop: boolean;
    ondCorInt: boolean;
    tvVhf: boolean;
    tvUhf: boolean;
    autorizacion: string;
    indicativo: string;
}

export class Seccion2 {
    servicio:string
    /*movil: boolean;
    fijo: boolean;
    analogico: boolean;
    digital: boolean;*/
}

export class Seccion3 {
    ubicacion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    lonOeste: UbicacionGMS;
    latSur: UbicacionGMS;
    file?: File;
    pathName?: string;

    constructor() {
        this.lonOeste = new UbicacionGMS();
        this.latSur = new UbicacionGMS();
    }
}

export class Seccion3a {
    equipo: string;
    marca: string;
    modelo: string;
    nroSerie: string;
    potencia: string;
    sensibilidad: string;
    bandaFrec: string;
    veloTrans: string;
    nroCanales: string;
    anchoBanda: string;
    codHomologa: string;
    antena: Antena;
    file?: File;
    pathName?: string;

    constructor() {
        this.antena = new Antena();
    }
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

export class UbicacionGMS {
    grados: string;
    minutos: string;
    segundos: string;
}

export class Antena {
    tipo: string;
    marca: string;
    modelo: string;
    codHomologa: string;
    diametro: string;
    ganancia: string;
    alturaTorre: string;
    alturaEdificio: string;
    alturaRadia: string;
    file?: File;
    pathName?: string;
}
