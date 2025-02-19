import { Formulario } from '../../../../core/models/Formularios/FormularioMain';
import { UbigeoResponse } from '../../../../core/models/Maestros/UbigeoResponse';
import { OficinaRegistralModel } from '../../../../core/models/OficinaRegistralModel';
import { TipoDocumentoModel } from '../../../../core/models/TipoDocumentoModel';


export class Formulario001_17_2Request extends Formulario {
    metaData: MetaData;

    constructor() {
        super()
        this.metaData = new MetaData();
    }

}

export class MetaData {

    seccion1: Seccion1;
    seccion3: Seccion3;
    seccion5: Seccion5;
    seccion6: Seccion6;


    constructor() {
        this.seccion1 = new Seccion1();
        this.seccion3 = new Seccion3();
        this.seccion5 = new Seccion5();
        this.seccion6 = new Seccion6();
    }
}

export class Seccion1{
    dstt_001: string;
    dstt_002: string;
    dstt_003: string;
    dstt_004: string;
    dstt_005: string;
    pasajeros: string;
    mercancia: string;
    rutaFerroviaria: string;
    pathNameCroquis: string;
    fileCroquis: File;
}

export class Seccion3 {
    tipoSolicitante:    string;
    nombresApellidos:   string;
    tipoDocumento:      string;
    numeroDocumento:    string;
    ruc:                string;
    razonSocial:        string;
    domicilioLegal:     string;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    telefono:           string;
    celular:            string;
    email:              string;
    representanteLegal: RepresentanteLegal;
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento:string;
    domicilioLegal: string;
    oficinaRegistral:   OficinaRegistralModel;
    partida:   string;
    asiento:   string;
    distrito:  string;
    provincia: string;
    departamento:string;
    cargo: string;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class Seccion5 {
    declaracion_1:boolean;
    declaracion_2:boolean;
    declaracion_3:boolean;
    declaracion_4:boolean;
    declaracion_5:boolean;
    declaracion_6:boolean;
    declaracion_7:boolean;
    declaracion_8:boolean;
    declaracion_9:boolean;
    declaracion_pasajeros:boolean;
    declaracion_mercancia: boolean;
    declaracion_ambos: boolean;
    partida_registral: string;
    asiento: string
}

export class Seccion6 {
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string
}




