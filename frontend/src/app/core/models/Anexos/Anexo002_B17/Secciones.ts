export class A002_B17_Seccion_Declaracion_Jurada {
    nombreApellido: string;
    nroDocumento: string;
    tipoRepresentacion: string;
    razonSocial: string;
    nroPartida: string;
    domicilio: string;
    listaNumeroTelef: Telefono[];
    gerenteOperaciones: string;
    archivoAdjuntoCV: File;
    pathNameAdjuntoCV?: string;
    fechaTramite: string;
    dia:string;
    mes:string;
    anio:string;

    constructor(){
        this.listaNumeroTelef = [];
    }
}

export class Telefono{
    nroCelular: string;
    placaVehiculo: string;
    archivoAdjunto: File;
    pathNameCelular?: string;
}

export class A002_B17_Seccion_Documento_Adjuntar {
    documentos: Documento[];

    constructor(){
        this.documentos = [];
    }
}

// export class Documento {
//     id: string;
//     descripcion: string;
//     flagAdjunto: number;
//     archivoAdjunto: File;
// }

export class Documento {
  nroOrden: number;
  descripcion: string;
  activo: boolean;
  pathName?: string;
  file?: File;
}
