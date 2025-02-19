import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo009_B17_3Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string;
    constructor() {
        this.seccion1 = new Seccion1();
    }
}

export class Seccion1 {
    codigoProcedimiento:string;
    listaFlotaVehicular: FlotaVehicular[];
}

export class FlotaVehicular {
    marca: string ;
    modelo: string;
    clase: string ;
    vin: string;
    serieChasis: string;
    serieMotor: string;
    anioFabricacion: string;
    placa: string;
    file?: File;
    pathName?: string;
    fileCertificado?: File;
    pathNameCertificado?: string;
} 

export class Opciones {
    value: string;
    text: string;
    id: number;
    categoria:string
}