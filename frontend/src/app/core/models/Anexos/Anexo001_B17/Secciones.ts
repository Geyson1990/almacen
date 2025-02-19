import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';

export class A001_B17_Seccion1 {
    paisesOperar: PaisResponse[];
    constructor() {
        this.paisesOperar = [];
    }
}

export class A001_B17_Seccion2 {
    tipoCargaTransportarIda: string;
    origenViaje: string;
    tipoCargaTransportarRegreso: string;
    destinoViaje: PaisResponse;
    periodoViajeOcasional: string;
    pasosFronteraIda: SelectionModel;
    pasosFronteraRegresa: SelectionModel;
    cantidadViajes: number;
    vehiculosOfertados: string;
    pdfPoliza: File;
    pathName: string;
    constructor() {
        this.pasosFronteraIda = new SelectionModel();
        this.pasosFronteraRegresa = new SelectionModel();
    }
}

export class A001_B17_Seccion3 {
    placaRodaje: string;
    soat: string;
    citv: string;
    caf: boolean;
    tipoModificacion: string;
    file?: File;
    pathName?: string;
}