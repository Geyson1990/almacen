import { A003_A172_Seccion_Itinerario, A003_A172_Seccion_Renat, Conductor } from './Secciones';

export class MetaData {
    itinerario: A003_A172_Seccion_Itinerario;
    renat: A003_A172_Seccion_Renat;
    relacionConductores: Conductor[];
    clase: string;
    direccionInfra: string;
    depaInfra: string;
    provInfra: string;
    distInfra: string;
    posesionInfra: string;
    vigenciaInfra: string;
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string

    constructor() {
        this.itinerario = new A003_A172_Seccion_Itinerario();
        this.renat = new A003_A172_Seccion_Renat();
        this.relacionConductores = [];
        this.clase="";
    }
}