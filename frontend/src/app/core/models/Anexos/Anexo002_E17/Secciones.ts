import { SelectionModel } from '../../SelectionModel';

export class A002_E17_Seccion1 {
    vehiculos: Vehiculos[];
    instalacion: string;
    razonSocial: string;
    distrito: string;
    provincia: string;
    departamento: string;
    pdfArrendamiento: File;
    pathName?: string;

    constructor(){
      this.vehiculos = [];
    }
}

export class A002_E17_Seccion2 {
  declaracionJurada1: boolean;
  declaracionJurada2: boolean;
  declaracionJurada3: boolean;
  declaracionJurada4: boolean;
}

export class Vehiculos {
  placaRodaje: string;
  soat: string;
  citv: string;
  caf: boolean;
  cao: boolean;
  fileCaf?: File;
  fileCao?: File;
  pathNameCaf?: string;
  pathNameCao?: string;
}
