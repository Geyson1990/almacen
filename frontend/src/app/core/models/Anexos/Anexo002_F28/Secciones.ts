import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
export class A002_F28_Seccion1 {
    tipoDocumento: string;
    nroDocumento: string;
    denominacion: string;
    representanteLegal: string;
}
export class A002_F28_Seccion2 {
    djNoModificada: boolean;
    djModificada: boolean;
    modifSocios: boolean;
    modifRepresentanteLegal: boolean;
    modifGerentes: boolean;
    modifAsociados: boolean;
    modifDirectores: boolean;
    modifTitular: boolean;
    modifAccionistas: boolean;
    modifMiembrosJunta: boolean;
    modifApoderados: boolean;
    miembros: Miembro[];
    lugar: string;
    fecha: string;
    constructor(){
      this.miembros = [];
    }
}
  

export class Miembro{
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    nombresApellidos: string;
    nacionalidad: string;
    condicionCargo: string;
    porcentajeCapital: number;
}
