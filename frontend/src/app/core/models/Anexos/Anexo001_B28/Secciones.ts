
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
export class A001_B28_Seccion1 {
    tipoDocumento: string;
    nroDocumento: string;
    nombreApellido: string;
    nacionalidad: string;
    domicilioLegal: string;
    distrito: UbigeoResponse;
    provincia: UbigeoResponse;
    departamento: UbigeoResponse;
    telefono: string;
    celular: string;
    correo: string;
    ocupacion: string;
    centroLaboral: string;
}
export class A001_B28_Seccion2 {
    familiares: Familiar[];
    lugar: string;
    fecha: string;
    constructor(){
      this.familiares = [];
    }
}
  
export class Familiar{
    tipoDocumentoFamiliar: TipoDocumentoModel;
    numeroDocumentoFamiliar: string;
    nombresApellidos: string;
    parentesco: Parentesco;
    ocupacion: string;
}

export class Parentesco{
    id: number;
    descripcion: string;
}

