
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class Seccion1{
    dgac_018: string;
    s_dgac_008: string;
    licencia: string;
    municipalidad: string;
    habilitaciones: string;
    sedes: string;
    oficio_dgac: string;
}

export class Seccion2{
  modalidadNotificacion: string;
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
