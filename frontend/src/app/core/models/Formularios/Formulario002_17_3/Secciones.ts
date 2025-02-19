
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { UbigeoResponse } from '../../Maestros/UbigeoResponse';

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

