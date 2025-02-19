import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';

export class Seccion1 {
    socios: Miembro[];
    constructor(){
        this.socios = [];
    }
}
export class Seccion2 {
    resolucion : string;
    frecuencia : string;
    localidad: string;
    departamento: string;
}

export class Seccion3{
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
    representanteLegal: RepresentanteLegal;
    constructor(){
        this.representanteLegal = new RepresentanteLegal();
        this.pn_departamento = new UbigeoResponse();
        this.pn_provincia = new UbigeoResponse();
        this.pn_distrito = new UbigeoResponse();
    }
}
export class Seccion4{
    declaracion:boolean;
    lugar:string;
    fecha: string;
    tipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombreSolicitante: string
}

export class Miembro{
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    nombresApellidos: string;
    nacionalidad: string;
    condicionCargo: string;
    porcentajeCapital: string;
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
    objetoSocial: string;
    distrito:  UbigeoResponse;
    provincia: UbigeoResponse;
    departamento:UbigeoResponse;
    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
        this.departamento = new UbigeoResponse();
        this.provincia = new UbigeoResponse();
        this.distrito = new UbigeoResponse();
    }
}
