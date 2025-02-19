
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    dstt_025: string;
    dstt_026: string;
    dstt_027: string;
    dstt_028: string;
    dstt_029: string;
    dstt_030: string;
    dstt_031: string;
    dstt_032: string;
    dstt_033: string;
    dstt_034: string;
    dstt_035: string;
    dstt_036: string;
    dstt_037: string;
    dstt_038: string;
    dstt_039: string;
    dstt_040: string;
    dstt_041: string;
    dstt_042: string;
    dstt_043: string
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

export class Seccion4 {
    opcion1: boolean;
    opcion2: boolean;
    opcion3: boolean;
    opcion4: boolean;
    oficina_registral:   OficinaRegistralModel;
    partida_registral:string;
    asiento:string;
    pathNameEstatutoSocial: string;
    fileEstatutoSocial: File;
    constructor(){
        this.oficina_registral = new OficinaRegistralModel();
    }
}

export class Seccion5 {
    relacionConductores: Conductor[];
    constructor(){
        this.relacionConductores = [];
      }
}

export class Seccion6 {
    declaracion_61:boolean;
    declaracion_62:boolean;
    declaracion_63:boolean;
    declaracion_64:boolean;
    declaracion_65:boolean;
    declaracion_66:boolean;
    declaracion_67:boolean;
    declaracion_68:boolean;
    declaracion_69:boolean;
}

export class Seccion7 {
    tipoDocumentoSolicitante:string;
    nombreTipoDocumentoSolicitante:string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string
}

export class Conductor{
    tipoDocumentoConductor: string;
    numeroDocumentoConductor: string;
    nombresApellidos: string;
    edad: string;
    numeroLicencia: string;
    categoria: string;
    subcategoria: string;
  }