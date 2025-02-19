import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { TripulacionModel } from '../../../../core/models/TripulacionModel';
import { PaisResponse } from '../../../../core/models/Maestros/PaisResponse';
import { SelectionModel } from '../../../../core/models/SelectionModel';
import { TipoSolicitudModel } from '../../../../core/models/TipoSolicitudModel';


export class Anexo003_B17_2Request extends Anexo {
  metaData: MetaData;
  
  constructor() {
    super()
    this.metaData = new MetaData();
  }
}

export class MetaData {
  tipoSolicitud:TipoSolicitudModel;
  listaTripulacion: Tripulacion[];
  dia:string;
  mes:string;
  anio:string;
  file:File;
  tipoDocumentoSolicitante:string;
  nombreTipoDocumentoSolicitante:string;
  numeroDocumentoSolicitante: string;
  nombresApellidosSolicitante:string
}

export class Tripulacion extends TripulacionModel{
  cargo: SelectionModel;
}

