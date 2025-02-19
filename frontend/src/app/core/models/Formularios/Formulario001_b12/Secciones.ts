import { OficinaRegistralModel } from '../../OficinaRegistralModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';

export class DatosSolicitante {
    ruc: string;
    razonSocial: string;
    domilicio: string;
    distrito: string;
    provincia: string;
    departamento: string;
    telefonoFax: string;
    celular: string;
    correoElectronico: string;
    representanteLegal: RepresentanteLegal;

    constructor(){
        this.representanteLegal = new RepresentanteLegal();
    }
}

export class ServicioSolicitado {
    codigoProcedimientoTupa: string;
    descProcedimientoTupa: string;
    personalAeronautico: PersonalAeronautico;

    constructor(){
        this.personalAeronautico = new PersonalAeronautico();
    }
}

export class DeclaracionJurada {
    nombreSolicitante: string;
    documentoSolicitante: string;
}

export class RepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    domicilioRepresentanteLegal: string;
    nroPartida: string;
    oficinaRegistral: OficinaRegistralModel;

    constructor(){
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel ();
    }
}

export class PersonalAeronautico {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    pasaporte: string;
    nacionalidad: string;
    fechaNacimiento: string;
    licenciaDe: string;
    habilitacion: string;
    nroLicencia: string;
    nroMeses: number;
    tipoAeronave: string;
    funciones: string;
}

export class OficinaRegistral {
    id: string;
    descripcion: string;
}

