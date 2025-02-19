import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';

export class Formulario010_17_3Request extends Formulario {
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
    seccion6: Seccion6;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion4 = new Seccion4();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
    }
}

export class Seccion1 {
    codigoProcedimiento: string;
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
export class Seccion4{
    domicilioLegal: string;
    nombreTaller:string;
    distrito: UbigeoResponse;
    provincia: UbigeoResponse;
    departamento: UbigeoResponse;
    constructor() {
        this.departamento = new UbigeoResponse();
        this.provincia = new UbigeoResponse();
        this.distrito = new UbigeoResponse();
    }
}

export class Seccion5 {
    declaracion_1: boolean;
    declaracion_2: boolean;
    declaracion_3: boolean;
    declaracion_4: boolean;
    declaracion_5: boolean;
    declaracion_6: boolean;

    partidaRegistral: string; 
    oficinaRegistral: OficinaRegistralModel; 
    autorizacion: string; 
    fechaAutorizacion: string; 
    constructor(){
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Seccion6 {
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante: string
}