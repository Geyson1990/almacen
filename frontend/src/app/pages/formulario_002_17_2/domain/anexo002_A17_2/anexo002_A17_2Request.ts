import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { PaisResponse } from '../../../../core/models/Maestros/PaisResponse';

export class Anexo002_A17_2Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
  seccion1: A002_A17_2_Seccion1;
  seccion2: A002_A17_2_Seccion2;
  seccion3: A002_A17_2_Seccion3[];
  tipoDocumentoSolicitante:string;
  nombreTipoDocumentoSolicitante:string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante:string;
  constructor() {
      this.seccion1 = new A002_A17_2_Seccion1();
      this.seccion2 = new A002_A17_2_Seccion2();
      this.seccion3 = [];
  }
}

export class A002_A17_2_Seccion1 {
  paisesOperar: PaisResponse[];
  origen: string;
  destino: PaisResponse;
  ciudadesOperar: string;
  numeroFrecuencias: string;
  horariosSalida: string;
  tiempoPromedioViaje: number;
  paisesTransito: string;

  constructor() {
      this.paisesOperar = [];
  }
}

export class A002_A17_2_Seccion2 {
  flotaAlta: boolean;
  flotaBaja: boolean;
}

export class A002_A17_2_Seccion3 {
  placaRodaje: string;
  soat: string;
  citv: string;
  caf: boolean;
  file?: File;
  pathName?: string;

}

export class A002_A17_2_Seccion4 {
  tipoDocumentoSolicitante: string;
  nombreDocumentoSolicitante:string;
  nombreSolicitante:string;
}