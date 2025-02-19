import { Anexo } from '../../../../core/models/Anexos/AnexoMain';

export class Anexo003_A27Request extends Anexo {
    metaData: MetaData;

    constructor() {
        super();
        this.metaData = new MetaData();
    }
}

export class MetaData {

    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion5: Seccion5;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion5 = new Seccion5();
    }
}

export class Seccion1 {
    razonSocial:string ;
    direccion: string ; 
}

export class Seccion2 {
    descAmbitoGeografico:string;
    descTipoServicio:string;
    descInfraestructura:string;
    prestadoServicioPostal:string;
    fechaInicio:string;
    nroRd:string;
    fechaUltimaAutoriza:string;
    prestadoServicioTransporte:string;
    nroResoAutoriza:string;
    fechaResolucionUltimaAutoriza:string;
    entidadEmiteCartaFianza:string;
    montoCartaFianza:string;
    fechaVenceCartaFianza:string;
}

export class Seccion3 {
    apellidosNombres: string ;
    nroDocumento: string ;
    tipoDocumento: string ;
} 

export class Seccion5 {
    declaracion_1:boolean;
}

