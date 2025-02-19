import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';

export class Formulario004_17_3Request extends Formulario {
    metaData: MetaData;

    constructor() {
        super()
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion4: Seccion4;
    seccion5: Seccion5;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion4 = new Seccion4();
        this.seccion5 = new Seccion5();
    }
}

export class Seccion1 {
    codigoProcedimiento: string;
    ambitoGeografico:string;
}

export class Seccion2 {
    modalidad: string;
}

export class Seccion3 {
    tipoSolicitante: string;
    tipoDocumento: string;
    numeroDocumento: string;
    ruc: string;
    razonSocial: string;
    domicilioLegal: string;
    departamento: string;
    provincia: string;
    distrito: string;
    telefono: string;
    celular: string;
    email: string;
    representanteLegal: RepresentanteLegal;
    constructor() {
        this.representanteLegal = new RepresentanteLegal()
    }
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    domicilioLegal: string;
    zona:string;
    oficinaRegistral: OficinaRegistralModel;
    partida: string;
    asiento: string;
    sede: string;
    distrito: UbigeoResponse;
    provincia: UbigeoResponse;
    departamento: UbigeoResponse;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
        this.departamento = new UbigeoResponse();
        this.provincia = new UbigeoResponse();
        this.distrito = new UbigeoResponse();
    }
}

export class Seccion4 {
    declaracion_1: boolean;
    declaracion_2: boolean;
    dcv_013_dj_1: boolean; 
    dcv_013_dj_2: boolean; 
    dcv_013_dj_3: boolean; 
    dcv_013_dj_4: boolean; 
    dcv_013_dj_5: boolean; 
    dcv_013_dj_6: boolean; 
    dcv_013_dj_7: boolean; 

    dcv_011_dj_1: boolean; 
    dcv_011_dj_2: boolean; 
    dcv_011_dj_3: boolean; 
    dcv_011_dj_4: boolean; 
    dcv_011_dj_5: boolean; 
    dcv_011_dj_6: boolean; 
    dcv_011_dj_7: boolean; 

    dcv_012_dj_1: boolean; 
    dcv_014_dj_1: boolean; 

    partidaRegistral: string; 
    asiento: string; 
    resolucionGases: string; 
    fechaResolucionGases: string; 
    resolucionAutorizacion: string; 
    fechaResolucionAutorizacion: string; 
}

export class Seccion5 {
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string
}