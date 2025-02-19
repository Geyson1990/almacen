import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';

export class Anexo001_A17_2Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1 : Seccion1;
    seccion2 : Seccion2;
    seccion3 : Seccion3;
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
    }
}

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
