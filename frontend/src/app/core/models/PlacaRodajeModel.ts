export class CitvModel {
    numero: string;
    estado: string;
    tipo: string;
    tipoId: string;
    fechaVencimiento: string;
    ambito: string
}

export class SoatModel {
    numero: string;
    estado: string;
    aseguradora: string;
    servicio: string;
}

export class PropietarioModel {
    tipoDocumento: string;
    documento: string;
    razonSocial: string;
    paterno: string;
    materno: string;
    nombres: string;
    direccion: string;
    fechaPropiedad: string;
}

export class PlacaRodajeModel {
    anioFabricacion: string;
    anioModelo: string;
    marca: string;
    chasis: string;
    modelo: string;
    nuevo: boolean;
    categoria: string;
    citvs: CitvModel[];
    soat: SoatModel;
    propietario: PropietarioModel;
    propietarios: PropietarioModel[];
    pesoBruto:number;
    pesoSeco:number;
    carroceria:string;
    antiguedadModelo:string;
    antiguedadFabricacion:string;
    vin: string;
    clase: string;
    motor: string;
    constructor() {
        this.citvs = [];
        this.propietarios = [];
    }
}

