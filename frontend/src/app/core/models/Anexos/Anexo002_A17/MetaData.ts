import { A002_A17_Seccion_Itinerario, A002_A17_Seccion_Renat, Conductor } from './Secciones';

export class MetaData {
    itinerario: A002_A17_Seccion_Itinerario;
    renat: A002_A17_Seccion_Renat;
    relacionConductores: Conductor[];

    constructor() {
        this.itinerario = new A002_A17_Seccion_Itinerario();
        this.renat = new A002_A17_Seccion_Renat();
        this.relacionConductores = [];
    }
}