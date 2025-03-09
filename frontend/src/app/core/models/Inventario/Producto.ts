export interface UnidadMedidaResponse {
    idUnidadMedida: number;
    nombre: string;
}


export interface ProductosRequest{
    idProducto:number;
    nombre: string;
    material: string;
    color: string;
    talla: string;
    tipo: string ;
    medida: string;
    marca: string ;
    idUnidadMedida: number;
    fechaVencimiento: Date;
    stockInicial: number;
    stockMinimo: number;
}

export interface EliminarProductoRequest{
    id:number;
}