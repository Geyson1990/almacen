import { UbigeoResponse } from '../../Maestros/UbigeoResponse';


export class A002_A17_Seccion_Itinerario {
  fechaIni :string;
  fechaFin:string;

  origenRuta: string;
  destinoRuta: string;
  itinerario: string;
  escalasComerciales: string="";
  frecuencias: string ="";
  diasSalida: string ="";
  horasSalida: string="";
  modalidadServicio: ModalidadServicio;
  flotaOperativa: string;
  flotaReserva: string;
  distancia: string="";
  tiempoAproxViaje: string="";
  servicioHabilitar: string="";
  plazoOperacion: number=0;
  pathName: string;
  archivoAdjunto: File;
}

export class ModalidadServicio {
  id: number=0;
  descripcion: string="";
}

export class A002_A17_Seccion_Renat {
  listaVehiculos: Vehiculo[];
  instalacion: number;
  datosLocal: DatosLocal;

  constructor(){
      this.listaVehiculos = [];
  }
}

export class Vehiculo{
  placaRodaje: string;
  soat: string;
  citv: string;
  caf: boolean;
  cao: boolean;
  fileCaf?: File;
  fileCao?: File;
  pathNameCaf?: string;
  pathNameCao?: string;
  celular: string;
  adCelular: boolean;
  fileCelular?:File;
  pathNameCelular?: string;

}

export class DatosLocal{
  domicilio: string;
  distrito: UbigeoResponse;
  provincia: UbigeoResponse;
  departamento: UbigeoResponse;
  pdfArrendamiento: File;
  pathName?: string;
}

export class Conductor{
  nombresApellidos: string;
  numeroDni: string;
  edad: string;
  numeroLicencia: string;
  categoria: string;
  subcategoria: string;
}

