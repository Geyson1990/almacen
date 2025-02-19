import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class Anexo004_A17_3Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
    }
}

export class Seccion1 {
    codigoProcedimiento: string;
    declaracion_1: boolean;
    declaracion_2: boolean;
}

export class Seccion2 {
    listaPersonal: Personal[];
    pathNameDocumentos: string;
    fileDocumentos: File;
}

export class Personal {
    apellidosNombres: string;
    tipoDocumento: TipoDocumentoModel;
    nroDocumento: string;
    funcion: Funcion;
    especialidad: string;
    cip: string;
    constructor() {
        this.funcion = new Funcion();
        this.tipoDocumento = new TipoDocumentoModel();
    }
}

export class Funcion {
    value: string;
    text: string;
}

