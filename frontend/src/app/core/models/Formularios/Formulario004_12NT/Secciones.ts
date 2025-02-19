
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    dgac_034: string;
    dgac_036: string;
    s_dgac_003: string;
    s_dgac_004: string;
    s_dgac_005: string;
    s_dgac_006: string;
    s_dgac_007: string;
    memoria: boolean;
    estudio: boolean;
    pathNameMemoriaDescriptiva: string;
    pathNameImpactoAmbiental: string;
    fileMemoriaDescriptiva: File;
    fileImpactoAmbiental: File;
    oficio_dgac: string;
}

export class Seccion2 {
    modalidadNotificacion:string
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
}

export class Seccion6 {
    dni: string;
    nombre:string
}
