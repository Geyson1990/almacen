import { SelectionModel } from '../../SelectionModel';

export class A003_D17_Seccion1 {
  nombresApellidos: String;
  dni: string;
  representante: string;
  razonSocial: string;
  partidaRegistral: string;
  domicilio: string;
  cumplerequisitos: string;
  cargo: string;
  dia: string;
  mes:string;
  anio:string; 
  vinculos: Vinculos[];
  encargados: Encargados[];
  constructor(){
    this.vinculos = [];
  }

}

export class A003_D17_Seccion2 {
  documentos: Documentos[];
  constructor(){
    this.documentos = [];
  }
}

export class Documentos {
  nroOrden: number;
  descripcion: string;
  activo: boolean;
  pathName?: string;
  file?: File;  
}

export class Vinculos {
  nroCelular: string;
  placaRodaje: string;
}

export class Encargados{
  tipoDocumento: string;
  numeroDocumento: string;
  nombresApellidos: string;
}