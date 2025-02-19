import { TipoDocumentoModel } from '../../TipoDocumentoModel';


export class Seccion1 {
  relacionMateriales: Material[];
  constructor(){
    this.relacionMateriales = [];
  }
}

export class Seccion2 {
  relacionRepresentanteLegal: RepLegal[];
  constructor(){
    this.relacionRepresentanteLegal = [];
  }
}

export class Seccion3 {
  relacionConductores: Conductor[];
  constructor(){
    this.relacionConductores = [];
  }
}

export class Conductor{
  tipoDocumento:TipoDocumentoModel;
  nombresApellidos:string;
  numeroDocumento: string;
  numeroLicencia: string;
  constructor(){
    this.tipoDocumento = new TipoDocumentoModel();
  }
}

export class Material{
  nombreMaterial:string;
}

export class RepLegal{
  TipoDocumento:TipoDocumentoModel;
  NumeroDocumento:string;
  ApellidosNombres:string;
  PartidaRegistral:string;
  NumeroAsiento:string;
  constructor(){
    this.TipoDocumento = new TipoDocumentoModel();
  }
}