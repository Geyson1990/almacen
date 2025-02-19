import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1 {
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    idTipoDocumento: string
    numeroDocumento:string
    telefono: string
    celular: string
    email: string
    domicilioLegal: string
    departamento: string
    provincia: string
    distrito: string
    ubigeo: string

    // constructor(){
    //     this.tipoDocumento = new TipoDocumentoModel();
    // }
}

export class Seccion2 {
  maestriaPostgrado: string
  institucion: string
  titulo: string
  institucionTitulo: string
}

export class Seccion3 {
  colegioProfesional: string
  nroColegiatura: string
}

export class Seccion4 {
    experiencia: Experiencia[]

    constructor(){
      this.experiencia = []
    }
}

export class Experiencia {
  institucion: string
  cargo: string
  periodo: string
  funcion: string
}
