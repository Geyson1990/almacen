import { Anexo } from '../../../../core/models/Anexos/AnexoMain';

export class Anexo001_A17_03Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion3a: Seccion3a;
    seccion5: Seccion5;
    seccion6: Seccion6;

    constructor() {
        this.seccion3a = new Seccion3a();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
    }
}

export class Seccion3a {
    codigoProcedimiento:string;
    listaPostulante: Postulante[];

    constructor() {
        this.listaPostulante = [];
    }
}

export class Postulante {
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    tipoDocumento: string;
    tipoDocumentoAbrev: string;
    nroDocumento: string;
    tipoVehiculo: string;
    restricciones: string;
    lcFerroviaria: string;
    viaFerrea: string;
    tramite: string;
    codTipoVehiculo: string;
    codRestriccion: string;
}

export class Seccion5 {
    declaracion1: string;
}

export class Seccion6 {
    nroDocumento: string;
    nombreCompleto: string;
    razonSocial: string;

    tipoDocumentoSolicitante: string; 
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string;
}
