export interface Procedimiento {
  idproc: number;
  procedimiento: string;
  estado: number | null;
  tipo: string;
  codigoProc: string;
  
  estadoTxt: string;
  materiaTxt: string;
}
