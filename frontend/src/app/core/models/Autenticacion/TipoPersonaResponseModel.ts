export class TipoPersonaResponseModel {
    codTabTipoPersona: string;
    denominacion: string;
}

export class ApiResponseModel<T> {
    success: boolean;
    message: string;
    data: T;
}