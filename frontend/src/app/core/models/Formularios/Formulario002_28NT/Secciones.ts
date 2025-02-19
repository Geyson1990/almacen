
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';

export class Seccion1 {
    dgat_018: string;
    dgat_019: string;
    dgat_020: string;
    dgat_021: string;
    dgat_022: string;
    dgat_023: string;
    dgat_024: string;
    dgat_025: string;
    dgat_026: string;
    dgat_027: string;
    dgat_028: string;
    dgat_029: string;
    dgat_030: string
}

export class Seccion2 {
    modalidad: string;
}
export class Seccion3 {
    localidad: string;
}

export class Seccion4 {
    finalidad: string;
}

export class Seccion5 {
    notificacion: boolean;
}

export class Seccion6 {
    tipoSolicitante:    string;
    nombresApellidos:   string;
    tipoDocumento:      string;
    numeroDocumento:    string;
    ruc:                string;
    razonSocial:        string;
    domicilioLegal:     string;
    pn_departamento:    UbigeoResponse;
    pn_provincia:       UbigeoResponse;
    pn_distrito:        UbigeoResponse;
    distrito:           string;
    provincia:          string;
    departamento:       string;
    telefono:           string;
    celular:            string;
    email:              string;
    conadis:            string;
    d_visual:boolean;
    d_auditiva:boolean;
    d_mental:boolean;
    d_fisica:boolean;
    d_lenguaje:boolean;
    d_intelectual:boolean;
    d_multiples:boolean;
    representanteLegal: RepresentanteLegal;
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
        this.pn_departamento = new UbigeoResponse();
        this.pn_provincia = new UbigeoResponse();
        this.pn_distrito = new UbigeoResponse();
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

export class Seccion7 {
    declaracion_1:boolean;
    declaracion_2:boolean;
}

export class Seccion8 {
    tipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombreSolicitante:string
}