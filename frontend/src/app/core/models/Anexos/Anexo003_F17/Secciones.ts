import { SelectionModel } from '../../SelectionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

export class A003_F17_Seccion1 {  
  suscritos: Suscritos[];
  constructor(){
    this.suscritos = [];
  }

}

export class A003_F17_Seccion2 {
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

export class Suscritos{
  tipoDocumento: TipoDocumentoModel;
  numeroDocumento: string;
  nombresApellidos: string; 
  cargo: Cargo; 
  constructor(){
    this.cargo = new Cargo();
  }
}

export class Cargo{
  id: number;
  descripcion: string;
}

