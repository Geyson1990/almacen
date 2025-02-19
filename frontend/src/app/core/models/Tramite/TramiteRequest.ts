
export class TramiteRequestModel {
    tupaId: number;
    tipoPersona: string;
    tipoDocumento: string;
    numeroDocumento: string;
}


export class GenerarTramiteRequestModel {
    TupaId: number;
    CodigoEstado: number;
    CodigoPersona: number;
}

export class UpdateIdEstudioModel{
    CodMaeSolicitud: number;
    IdEstudio: number;
}