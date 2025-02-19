import { TipoDocumentoModel } from "src/app/core/models/TipoDocumentoModel"

export class Seccion1 {
    codigoProcedimiento: string
    tipoLicencia: string
}

export class Seccion2 {
    modalidadNotificacion: string
}

export class Seccion3 {
    nombres: string
    tipoDocumento: TipoDocumentoModel
    numeroDocumento: string
    ruc: string
    telefono: string
    celular: string
    email: string
    domicilioLegal: string
    distrito: string
    provincia: string
    departamento: string
    nacionalidad: string
    fechaNacimiento: string
    registroLicencia: string
    numeroLicencia: string

    constructor(){
      this.tipoDocumento = new TipoDocumentoModel();
    }
}

export class Seccion4 {
    declaracion1: boolean
    declaracion2: boolean
}

export class Seccion5 {
    nombresFirmante: string
    nroDocumentoFirmante: string
}

