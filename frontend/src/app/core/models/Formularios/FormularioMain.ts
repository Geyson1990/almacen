import { OficinaRegistralModel } from "../OficinaRegistralModel";
import { TipoDocumentoModel } from "../TipoDocumentoModel";

export class Formulario {
    id: number;
    codigo: string;
    formularioId: number;
    tramiteReqId: number;
    codUsuario: string;
    estado: number;
    idTramiteReq: number;
    uriArchivo: string;
}

export class SeccionDatosGenerales {
    tipoSolicitante: string;
    nombresApellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    ruc: string;
    razonSocial: string;
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
    telefono: string;
    celular: string;
    email: string;
    representanteLegal: SeccionRepresentanteLegal;

    constructor() {
        this.representanteLegal = new SeccionRepresentanteLegal();
    }
}

export class SeccionRepresentanteLegal {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    domicilioLegal: string;
    oficinaRegistral: OficinaRegistralModel;
    partida: string;
    asiento: string;
    distrito: string;
    provincia: string;
    departamento: string;
    cargo: string;

    constructor() {
        this.tipoDocumento = new TipoDocumentoModel();
        this.oficinaRegistral = new OficinaRegistralModel();
    }
}

export class FormularioDIA{
    CodMaeSolicitud: number;
    DataJson:string;
    dataJson:string;
}

export class FormularioDIAResponse{
    codMaeSolicitud: number;
    codMaeRequisito: number;
    dataJson:string;
}