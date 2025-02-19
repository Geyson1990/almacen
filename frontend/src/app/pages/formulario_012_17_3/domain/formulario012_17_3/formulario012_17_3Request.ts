import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';

export class Formulario012_17_3Request extends Formulario {
    metaData: MetaData;

    constructor() {
        super()
        this.metaData = new MetaData();
    }
}

export class MetaData {
    seccion1: Seccion1;
    seccion2: Seccion2;
    seccion3: Seccion3;
    seccion4: Seccion4;

    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion2 = new Seccion2();
        this.seccion3 = new Seccion3();
        this.seccion4 = new Seccion4()
    }
}

export class Seccion1 {
    nro_solicitud: string;
    fecha_registro: string;
    nro_licencia: string;
    centro_emision: string;
    nombres: string;
    domicilio: string;
    distrito: string;
    provincia: string;
    region: string;
    documentoidentidad: string;
    numero: string;
    correo: string;
    telefono: string;   
    licenciaTipoA:string; 
}

export class Seccion2 {
    canjeDiplomatico: string;
    canjeMilitar: string;
    canjeExtranjero: string;
    modificacion:string;
    codigoProcedimiento: string;
    categoria: string
}

export class Seccion3 {
    nombreES: string;
    certificadoES: string;
    fechaES: string;
    
    nombreEC: string;
    certificadoEC: string;
    fechaEC: string;
    
    nombreCE: string;
    certificadoCE: string;
    fechaCE: string;

    nombreHC: string;
    notaHC: string;
    fechaHC: string;
}

export class Seccion4 {
    acepto: boolean;
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string
}