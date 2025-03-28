export interface SalidaRequest{
    idProducto:number;
    idSalida: number;
    cantidad: string;
    fecha: Date;
    idAreaSolicitante: number;
    personaSolicitante: string;
    documentoSalida: string;
    idTipoSalida: number;
}


export interface AreaSolicitanteResponse{
    id:number;
    nombre: string;
}

export interface EliminarSalidaRequest{
    id:number;
}
export interface TipoSalidaResponse{
    idTipoSalida: number;
    descripcion: string;
}