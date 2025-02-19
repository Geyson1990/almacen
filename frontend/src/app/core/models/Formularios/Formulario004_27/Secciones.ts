import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    codigoProcedimiento: string
}

export class Seccion2 {
    modalidadNotificacion:string
}

export class Seccion3 {
    tipoSolicitante: string
    nombres: string
    tipoDocumento: TipoDocumentoModel
    numeroDocumento: string
    ruc: string
    razonSocial: string
    telefono: string
    celular: string
    email: string
    domicilioLegal: string
    distrito: string
    provincia: string
    departamento: string
    representanteLegal: RepresentanteLegal

    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class Seccion4 {
    declaracion1: boolean
    declaracion2: boolean
}

export class Seccion5 {
    nombresFirmante: string
    nroDocumentoFirmante: string
    tipoDocumentoFirmante: string
}

export class RepresentanteLegal {
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: TipoDocumentoModel
    numeroDocumento:string
    ruc: string
    telefono: string
    celular: string
    email: string
    domicilioLegal: string
    departamento: string
    provincia: string
    distrito: string
    ubigeo: string
    partida: string
    asiento: string
    oficinaRegistral: OficinaRegistralModel

    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}
