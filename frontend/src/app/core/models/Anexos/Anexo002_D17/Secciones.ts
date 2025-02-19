export class A002_D17_Seccion_Declaracion_Juarada {
    personasSuscritas: Persona[];
    dia:string;
    mes:string;
    anio:string;
    constructor(){
        this.personasSuscritas = [];
    }
}

export class Persona{
    nombresApellidos: string;
    cargo: Cargo;
    numeroDni: string;
    fechaTramite: Date;

    constructor(){
        this.cargo = new Cargo();
    }
}

export class Cargo{
    id: number;
    descripcion: string;
}

export class A002_D17_Seccion_Documento_Adjuntar{
    documentos: Documento[];

    constructor(){
        this.documentos = [];
    }
}

export class Documento {
    id: number;
    descripcion: string;
    flagAdjunto: boolean;
    archivoAdjunto: File;
    pathName?: string;
}
