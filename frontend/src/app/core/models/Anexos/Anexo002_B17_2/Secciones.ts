import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';
import { TripulacionModel } from '../../TripulacionModel';

export class A002_B17_2_Seccion1 {
    ambitoOperacion: string;
    paisesOperar: PaisResponse[];
    rutas: RutasAnexo002_B17_2[];
    constructor() {
        this.paisesOperar = [];
        this.rutas = [];
    }
}

export class RutasAnexo002_B17_2 {
    ruta: string;
    itinerario: string;
    frecuencia: string;
}

export class A002_B17_2_Seccion2 {
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

export class A002_B17_2_Seccion3 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    vinculado: boolean;
    /*anioFabricacion: string;
    chasis: string;
    marca: string;
    modelo: string;*/
    file?: File;
    pathName?: string;
    vin:boolean;
    nroVinculado:string;
    fileVin?:File;
    pathNameVin?:string;
}

export class A002_B17_2_Seccion4 extends TripulacionModel {
    licencia: string;
}
export class A002_B17_2_Seccion5 extends TripulacionModel {

}
