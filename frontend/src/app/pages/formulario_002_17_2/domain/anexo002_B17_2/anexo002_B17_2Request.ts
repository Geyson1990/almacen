import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { TripulacionModel } from '../../../../core/models/TripulacionModel';
import { PaisResponse } from '../../../../core/models/Maestros/PaisResponse';

export class Anexo002_B17_2Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {
  seccion1: A002_B17_2_Seccion1;
  seccion2: A002_B17_2_Seccion2;
  seccion3: A002_B17_2_Seccion3[];
  seccion4: A002_B17_2_Seccion4[];
  seccion5: A002_B17_2_Seccion5[];
  tipoDocumentoSolicitante:string;
  nombreTipoDocumentoSolicitante:string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante:string;
  constructor() {
      this.seccion1 = new A002_B17_2_Seccion1();
      this.seccion2 = new A002_B17_2_Seccion2();
      this.seccion3 = [];
      this.seccion4 = [];
      this.seccion5 = [];
  }
}

export class A002_B17_2_Seccion1 {
  ambitoOperacion: string;
  paisesOperar: PaisResponse[];
  rutas: RutasAnexo002_B17_2[];
  constructor() {
      this.paisesOperar = [];
      this.rutas = [];
  }
}

export class RutasAnexo002_B17_2 {
  ruta: string;
  itinerario: string;
  frecuencia: string;
}

export class A002_B17_2_Seccion2 {
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

export class A002_B17_2_Seccion3 {
  placaRodaje: string;
  soat: string;
  citv: string;
  caf: boolean;
  vinculado: boolean;
  /*anioFabricacion: string;
  chasis: string;
  marca: string;
  modelo: string;*/
  file?: File;
  pathName?: string;
  vin:boolean;
  nroVinculado:string;
  fileVin?:File;
  pathNameVin?:string;
}

export class A002_B17_2_Seccion4 extends TripulacionModel {
  licencia: string;
}
export class A002_B17_2_Seccion5 extends TripulacionModel {

}

