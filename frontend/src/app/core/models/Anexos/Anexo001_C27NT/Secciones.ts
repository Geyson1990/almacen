import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    tipoDeclarante: number
}

export class Seccion2 {
    representante: RepresentanteLegal
    empresa: Empresa

    constructor(){
        this.representante = new RepresentanteLegal();
        this.empresa = new Empresa();
    }
}

export class Seccion3 {
    declaracion1: boolean
    declaracion2: boolean
    dia: string
    mes: string
    anio: string
}

export class RepresentanteLegal {
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    tipoDocumento: TipoDocumentoModel
    numeroDocumento:string
    ruc?: string
    telefono: string
    celular: string
    email: string
    domicilioLegal: string
    departamento: string
    provincia: string
    distrito: string
    ubigeo?: string
    partida: string
    asiento: string
    oficinaRegistral: OficinaRegistralModel
    
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Empresa {
    ruc: string
    razonSocial:string
    domicilioLegal:string
    distrito:string
    provincia:string
    departamento:string
    ubigeo?:string
}