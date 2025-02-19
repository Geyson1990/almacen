
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';

export class Seccion1 {
    dgistr_001: string;
    dgistr_002: string;
    dgistr_003: string;
    tipoAutorizacion: string;
}

export class Seccion2 {
    notificacion: string;
}

export class Seccion3 {
    tipoSolicitante:    string;
    nombresApellidos:   string;
    tipoDocumento:      string;
    numeroDocumento:    string;
    ruc:                string;
    razonSocial:        string;
    domicilioLegal:     string;
    departamento:       string;
    provincia:          string;
    distrito:           string;
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
    distrito:  UbigeoResponse;
    provincia: UbigeoResponse;
    departamento:UbigeoResponse;
    cargo: string;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
        this.departamento = new UbigeoResponse();
        this.provincia = new UbigeoResponse();
        this.distrito = new UbigeoResponse();
    }
}

export class Seccion5 {
    declaracion_1:boolean;
    declaracion_2:boolean;
    declaracion_3:boolean;
    declaracion_4:boolean;
}

export class Seccion6 {
    tipoDocumentoSolicitante: string;
    nombreTipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresApellidosSolicitante:string
}