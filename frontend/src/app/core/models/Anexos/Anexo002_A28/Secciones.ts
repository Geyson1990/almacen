
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
export class A002_A28_Seccion1 {
    tipoDocumento: string;
    nroDocumento: string;
    nombreApellido: string;
    peruano: boolean;
    nacionalidad: string;
    domicilioLegal: string;
    departamento: UbigeoResponse;
    provincia: UbigeoResponse;
    distrito: UbigeoResponse;
    telefono: string;
    celular: string;
    correo: string;
    ocupacion: string;
    centroLaboral: string;
    constructor(){
        this.departamento = new UbigeoResponse();
        this.provincia= new UbigeoResponse();
        this.distrito=new UbigeoResponse();
    }
}
export class A002_A28_Seccion2 {
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

