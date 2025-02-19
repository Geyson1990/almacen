export interface ServicioFirmaResponseModel {
    resultado: string;
    estado: string;
    sujeto: string;
    archivos?: Archivo[];
}

export interface Archivo {
    estado: number;
    nombre: string;
}
