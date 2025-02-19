import { SelectionModel } from '../../SelectionModel';

export class A003_A17_Seccion1 {
    ambitoOperacion: string;
    dia: string;
    mes:string;
    anio:string;  
    nombres: string;
    ap_paterno:string;
    ap_materno: string;
    nombresApellidos: string;  
}

export class A003_A17_Seccion2 {
  vehiculos: Vehiculos[];
  pathNameCroquis?: string;
  pdfCroquis: File;

  constructor(){
    this.vehiculos = [];
  }
}

export class A003_A17_Seccion3 {
  conductores: Conductores[];
  constructor(){
    this.conductores = [];
  }
}

export class Vehiculos {
  placaRodaje: string;
  soat: string;
  citv: string;
  caf: boolean;
  cao: boolean;
  pathNameCaf?: string;
  fileCaf?: File;
  pathNameCao?: string;
  fileCao?: File;
}

export class Conductores {
  nroDni: string;
  nombresApellidos: string;
  ape_Paterno: string;
  ape_Materno: string;
  nombres: string;
  edad: number;
  nroLicencia: string;
  categoria: string;
}

