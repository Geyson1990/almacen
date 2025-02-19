import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';

export class A001_D17_Seccion1 {
    ambitoOperacion: string;
    paisesOperar: PaisResponse[];
    constructor() {
        this.paisesOperar = [];
    }
}

export class A001_D17_Seccion2 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    vinculado: boolean;
    file?: File;
    pathName?: string;
}

export class A001_D17_Seccion3 {
    nombreUsuario: string;
    numeroDocumento: string;
    razonSocial: string;
    partidaRegistral: string;
    domicilio: string;
    dia:string;
    mes:string;
    anio:string;
}