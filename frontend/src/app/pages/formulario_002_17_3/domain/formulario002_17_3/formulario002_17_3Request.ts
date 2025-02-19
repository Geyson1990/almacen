import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';

export class Formulario002_17_3Request extends Formulario {
    metaData: MetaData;

    constructor() {
        super()
        this.metaData = new MetaData();
    }

}

export class MetaData {

    seccion1: Seccion1;
    seccion3: Seccion3;
    seccion5: Seccion5;
    seccion6: Seccion6;
    seccion7: Seccion7;
    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion3 = new Seccion3();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
        this.seccion7 = new Seccion7()
    }
}

export class Seccion1 {
    dcv_004: boolean;
    dcv_005: boolean;
    dcv_006: boolean;
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
    contacto: Contacto;
    representanteLegal: RepresentanteLegal;
    constructor() {
        this.contacto = new Contacto();
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class Contacto {
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    rucContacto:string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    celular: string;
    email: string;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
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
    zona: string;
    partida: string;
    asiento: string;
    distrito: UbigeoResponse;
    provincia: UbigeoResponse;
    departamento: UbigeoResponse;
    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
        this.distrito = new UbigeoResponse();
        this.provincia = new UbigeoResponse();
        this.departamento = new UbigeoResponse()
    }
}

export class Seccion5 {
    Certificados:Certificado[];
    constructor(){
        this.Certificados = []
    }
}

export class Seccion6 {
    declaracion_1: boolean;
    declaracion_2: boolean;
}

export class Seccion7 {
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante:string;
    nombresApellidosSolicitante:string;
}

export class Certificado {
    tipoVehiculo: string;
    nombreTipoVehiculo: string;
    numeroUnidad: string;
    materialPeligroso: string;
}