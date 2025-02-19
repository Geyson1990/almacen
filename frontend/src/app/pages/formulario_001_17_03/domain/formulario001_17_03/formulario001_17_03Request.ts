import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';


export class Formulario001_17_03Request extends Formulario {
   metaData: MetaData;

   constructor() {
      super()
      this.metaData = new MetaData();
   }

}

export class MetaData {

   seccion1: Seccion1;
   seccion3: Seccion3;
   seccion4: Seccion4;
   seccion6: Seccion6;


   constructor() {
      this.seccion1 = new Seccion1();
      this.seccion3 = new Seccion3();
      this.seccion4 = new Seccion4();
      this.seccion6 = new Seccion6();
   }
}

export class Seccion1 {
   codigoProcedimiento: string;
}

export class Seccion3 {
   tipoSolicitante: string;
   nombresApellidos: string;
   tipoDocumento: string;
   numeroDocumento: string;
   ruc: string;
   razonSocial: string;
   domicilioLegal: string;
   pn_departamento: UbigeoResponse;
   pn_provincia: UbigeoResponse;
   pn_distrito: UbigeoResponse;
   distrito: string;
   provincia: string;
   departamento: string;
   telefono: string;
   celular: string;
   email: string;

   representanteLegal: RepresentanteLegal;
   datosContacto: DatosContacto;
   constructor() {
      this.representanteLegal = new RepresentanteLegal();
      this.datosContacto = new DatosContacto();
      this.pn_departamento = new UbigeoResponse();
      this.pn_provincia = new UbigeoResponse();
      this.pn_distrito = new UbigeoResponse();
   }
}

export class RepresentanteLegal {
   nombres: string;
   apellidoPaterno: string;
   apellidoMaterno: string;
   tipoDocumento: TipoDocumentoModel;
   numeroDocumento: string;
   domicilioLegal: string;
   zona: string;
   oficinaRegistral: OficinaRegistralModel;
   partida: string;
   asiento: string;
   distrito: UbigeoResponse;
   provincia: UbigeoResponse;
   departamento: UbigeoResponse;
   cargo: string;
   constructor() {
      this.tipoDocumento = new TipoDocumentoModel();
      this.oficinaRegistral = new OficinaRegistralModel();
      this.departamento = new UbigeoResponse();
      this.provincia = new UbigeoResponse();
      this.distrito = new UbigeoResponse();
   }
}

export class DatosContacto {
   nombres: string;
   apellidoPaterno: string;
   apellidoMaterno: string;
   tipoDocumento: TipoDocumentoModel;
   numeroDocumento: string;
   telefono: string;
   celular: string;
   email: string;

   constructor() {
      this.tipoDocumento = new TipoDocumentoModel();
   }
}

export class Seccion4 {
   declaracion_1: boolean;
   declaracion_2: boolean;
   declaracion_3: boolean;
}

export class Seccion6 {
   tipoDocumentoSolicitante: string;
   documento: string;
   numeroDocumentoSolicitante: string;
   nombreSolicitante: string
}



