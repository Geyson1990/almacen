export interface IngresoRequest{
    idProducto:number;
    idEntrada: number;
    cantidad: string;
    fecha: Date;
    idTipoEntrada: number;
    ordenCompra: string;
}

export interface EliminarIngresoRequest{
    id:number;
}