import { PaisResponse } from '../../Maestros/PaisResponse';

export class A002_A17_2_Seccion1 {
    paisesOperar: PaisResponse[];
    origen: string;
    destino: PaisResponse;
    ciudadesOperar: string;
    numeroFrecuencias: string;
    horariosSalida: string;
    tiempoPromedioViaje: number;
    paisesTransito: string;

    constructor() {
        this.paisesOperar = [];
    }
}

export class A002_A17_2_Seccion2 {
    flotaAlta: boolean;
    flotaBaja: boolean;
}

export class A002_A17_2_Seccion3 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    file?: File;
    pathName?: string;

}

export class A002_A17_2_Seccion4 {
    tipoDocumentoSolicitante: string;
    nombreDocumentoSolicitante:string;
    nombreSolicitante:string;
}
