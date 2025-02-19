
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    dstt_006: boolean;
    dstt_007: boolean;
    dstt_008: boolean;
    dstt_009: boolean;
    dstt_010: boolean;
    dstt_011: boolean;
    dstt_012: boolean;
    dstt_013: boolean;
    dstt_014: boolean;
    dstt_015: boolean;
    dstt_016: boolean;
    dstt_017: boolean;
    dstt_018: boolean;
    dstt_019: boolean;
    dstt_020: boolean;
    dstt_021: boolean;
    dstt_022: boolean;
    dstt_023: boolean;
    dstt_024: boolean;
}

export class Seccion3 {
    tipoSolicitante: string;
    nombresApellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    ruc: string;
    razonSocial: string;
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
    telefono: string;
    celular: string;
    email: string;
    representanteLegal: RepresentanteLegal;
    constructor() {
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    domicilioLegal: string;
    oficinaRegistral: OficinaRegistralModel;
    partida: string;
    asiento: string;
    distrito: string;
    provincia: string;
    departamento: string;
    cargo: string;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Seccion4 {
    declaracion_41: boolean;
    declaracion_42: boolean;
    declaracion_43: boolean;
    declaracion_44: boolean;
    declaracion_45: boolean;
    declaracion_46: boolean;
    declaracion_47: boolean;
    declaracion_48: boolean;
    declaracion_49: boolean;
}

export class Seccion5 {
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante:string;
    nombresApellidosSolicitante:string;
}

export class Seccion6 {
    Tripulantes: boolean;
    Pasajeros: boolean;
    pathNameTripulantes: string;
    pathNamePasajeros: string;
    fileTripulantes: File;
    filePasajeros: File;
}

export class Seccion7 {
    RelacionConductores:Conductor[];
    FlotaVehicular:Flota[];
    RelacionPasajeros:Pasajero[];
    constructor(){
        this.RelacionConductores = [];
        this.FlotaVehicular = [];
        this.RelacionPasajeros = []
    }
}
export class Flota {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    file?: File;
    pathName?: string;
    vin:boolean;
    nroVinculado:string;
    fileVin?:File;
    pathNameVin?:string;
}

export class Conductor{
    tipoDocumentoConductor: string;
    numeroDocumentoConductor: string;
    nombresApellidos: string;
    edad: string;
    numeroLicencia: string;
    categoria: string;
    subcategoria: string;
}

export class Pasajero{
    tipoDocumentoPasajero: string;
    nombreTipoDocumentoPasajero: string;
    numeroDocumentoPasajero: string;
    nombresApellidos: string;
}

export class Tripulante{
    tipoDocumentoTripulante: string;
    numeroDocumentoTripulante: string;
    nombresApellidos: string;
}
