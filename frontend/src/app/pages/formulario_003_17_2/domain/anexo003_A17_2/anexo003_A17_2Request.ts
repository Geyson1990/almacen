import { Anexo } from '../../../../core/models/Anexos/AnexoMain';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';
import { PaisResponse } from '../../../../core/models/Maestros/PaisResponse';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';

export class Anexo003_A17_2Request extends Anexo {
   metaData: MetaData;

   constructor() {
      super();
      this.metaData = new MetaData();
   }
}

export class MetaData {
   itinerario: A003_A172_Seccion_Itinerario;
   renat: A003_A172_Seccion_Renat;
   relacionConductores: Conductor[];
   clase: string;
   direccionInfra: string;
   depaInfra: string;
   provInfra: string;
   distInfra: string;
   posesionInfra: string;
   vigenciaInfra: string;
   tipoDocumentoSolicitante: string;
   nombreTipoDocumentoSolicitante: string;
   numeroDocumentoSolicitante: string;
   nombresApellidosSolicitante: string

   constructor() {
      this.itinerario = new A003_A172_Seccion_Itinerario();
      this.renat = new A003_A172_Seccion_Renat();
      this.relacionConductores = [];
      this.clase = "";
   }
}

export class A003_A172_Seccion_Itinerario {
   fechaIni: string;
   fechaFin: string;

   origenRuta: string;
   destinoRuta: string;
   itinerario: string;
   fechaPartida: string;
   fechaLlegada: string;
   vias: string;
   escalasComerciales: string = "";
   estaciones: string;
   frecuencias: string = "";
   modalidadServicio: ModalidadServicio;
   distancia: string = "";
   diasSalida: string = "";
   horasSalida: string = "";
   claseServicio: string = "";
   tiempoAproxViaje: string = "";

   flotaOperativa: string;
   flotaReserva: string;
   servicioHabilitar: string = "";
   plazoOperacion: number = 0;
   pathName: string;
   archivoAdjunto: File;
   numeroRuta: string;
   nombreNumeroRuta: string;
}

export class ModalidadServicio {
   id: number = 0;
   descripcion: string = "";
}

export class A003_A172_Seccion_Renat {
   listaVehiculos: Vehiculo[];
   instalacion: number;
   datosLocal: DatosLocal;

   constructor() {
      this.listaVehiculos = [];
   }
}

export class Vehiculo {
   placaRodaje: string;
   soat: string;
   aseguradora: string;
   citv: string;
   caf: boolean;
   cao: boolean;
   cert: boolean;
   cel: boolean;
   fileCaf?: File;
   fileCao?: File;
   fileCert?: File;
   fileCel?: File;
   pathNameCaf?: string;
   pathNameCao?: string;
   pathNameCert?: string;
   pathNameCel?: string;
   categoria: string;
   condicion: Condicion;
   celular: string;
}

export class DatosLocal {
   domicilio: string;
   distrito: UbigeoResponse;
   provincia: UbigeoResponse;
   departamento: UbigeoResponse;
   pdfArrendamiento: File;
   pathName?: string;
}

export class Conductor {
   nombresApellidos: string;
   numeroDni: string;
   edad: string;
   numeroLicencia: string;
   categoria: string;
   subcategoria: string;
}


export class Condicion {
   tipoCondicion: string;
   nombreCondicion: string;
}

export class Opciones {
   value: string;
   text: string;
   id: number
}