
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';

export class A002_B28_Seccion1 {
    razonSocial: string;
    tipoDocumento: string;
    nroDocumento: string;
    nombreApellido: string;
}

export class A002_B28_Seccion2 {
    socios: Socio[];
    lugar: string;
    fecha: string;
    solicitante: string;
    tipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    constructor(){
      this.socios = [];
    }
}
  
export class Socio{
    tipoDocumentoSocio: TipoDocumentoModel;
    numeroDocumentoSocio: string;
    nombresApellidos: string;
    nacionalidad: string;
    cargo: string;
    capital: string;
}