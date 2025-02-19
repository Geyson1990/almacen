import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';

export class A001_A17_Seccion1 {
    paisesOperar: PaisResponse[];
    origen: string;
    destino: PaisResponse;
    ciudadesOperar: string;
    numeroFrecuencias: string;
    horariosSalida: string;
    tiempoPromedioViaje: number;
    paisesTransito: string;
    pdfCroquis: File;
    pathName?: string;
    
    constructor(){
        this.paisesOperar = [];
    }
}

export class A001_A17_Seccion2 {
    origen: string;
    destino: PaisResponse;
    puntosIntermedios: string;
    pasoFronteraIda: SelectionModel;
    pasoFronteraRegreso: SelectionModel;
    fechaSalida: string;
    fechaLlegada: string;
    pdfPoliza?:File;
    pathName?: string;
}

export class A001_A17_Seccion3 {
    flotaAlta: boolean;
    flotaBaja: boolean;
}

export class A001_A17_Seccion4 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    file?: File;
    pathName?: string;
}