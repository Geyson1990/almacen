export class RequisitoModel {
    codigo: number;
    tupaId: number;
    codigoTupa: string;
    descripcion: string;
    estado: string;
    tieneAdjunto: boolean;
    tieneFormAnexo: boolean;
    tieneCosto: boolean;
    obligatorio: boolean;
    codigoFormAnexo: string;
    tipoPermiso: string;
    plantillaAdjunto: string;
    tramiteReqRefId: number;
    costo: number;
    auxOrden: number;
    tipoSolicitud: string;
    tipoSolicitudDesc: string;
    plazoAtencion: number;
    evaluacion: string;
    costoFormatted: string;
requisito:string;
    // Campos adicionales
    ordenTxt: string;
    nombrePlantilla: string //RC
    codigoFormTupa: string //RC
    codigoTributo: string //RC
}
