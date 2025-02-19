import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    nombresApellidos: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    ruc: string;
    telefono: string;
    celular: string;
    correo: string;
    domicilio: string;
    distrito: string;
    provincia: string;
    departamento: string;
    ubigeo?:string

    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
    }
}

export class Seccion2 {
    declaracion1: boolean
    dia:string
    mes:string
    anio:string
}
