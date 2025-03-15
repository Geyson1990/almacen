export interface SalidaRequest{
    idProducto:number;
    idSalida: number;
    cantidad: string;
    fecha: Date;
    idAreaSolicitante: number;
    personaSolicitante: string;
}


export interface AreaSolicitanteResponse{
    id:number;
    nombre: string;
}

export interface EliminarSalidaRequest{
    id:number;
}