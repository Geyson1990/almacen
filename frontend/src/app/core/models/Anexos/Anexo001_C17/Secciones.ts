import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';
import { TripulacionModel } from '../../TripulacionModel';
import { RutasAnexo001_C17 } from './RutasAnexo001_C17';

export class A001_C17_Seccion1 {
    ambitoOperacion: string;
    paisesOperar: PaisResponse[];
    rutas: RutasAnexo001_C17[];
    constructor() {
        this.paisesOperar = [];
        this.rutas = [];
    }
}

export class A001_C17_Seccion2 {
    listaTripulacion: TripulacionModel[];
    fechaInicioViaje: string;
    fechaConclusionViaje: string;
    rutaAutorizada: string;
}

export class A001_C17_Seccion3 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    vinculado: boolean;
    anioFabricacion: string;
    chasis: string;
    marca: string;
    modelo: string;
    file?: File;
    pathName?: string;
}