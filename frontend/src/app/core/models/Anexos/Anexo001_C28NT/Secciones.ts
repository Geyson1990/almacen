
export class Seccion2 {
    analogico: string;
    digital: string;
    file?: File;
    pathName?: string;
    fileExcel?: File;
    pathNameExcel?: string;
    /*constructor() {
        this.analogico = new SubTipoServicio();
        this.digital = new SubTipoServicio();
    }*/
}

export class Seccion3 {
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

export class Seccion3a {
    equipo: string;
    cantidad: string;
    marca: string;
    modelo: string;
    nroSerie: string;
    potencia: string;
    bandaFrec: string;
    velocidad: string;
    nroCanales: string;
    configuracion: string;
    anchoBanda: string;
    codHomologa: string;
    antena: Antena;

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

export class SubTipoServicio {
    fijo: boolean;
    movil: boolean;
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
    ganancia: string;
    diametro: string;
    acimutRadia: string;
    elevacion: string;
    distancia: string;
}
