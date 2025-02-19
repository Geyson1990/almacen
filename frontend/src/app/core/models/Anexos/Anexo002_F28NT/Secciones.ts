import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
export class Seccion1 {
    tipoDocumento: string;
    nroDocumento: string;
    denominacion: string;
    representanteLegal: string;
}
export class Seccion2 {
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

export class Seccion3{
    declaracion:boolean;
    lugar:string;
    feha: string;
    tipoDocumentoSolcitante: string;
    numeroDocumentoSolicitante: string;
    nombreSolicitante: string
}

export class Miembro{
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    nombresApellidos: string;
    nacionalidad: string;
    condicionCargo: string;
    porcentajeCapital: number;
}
