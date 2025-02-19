export interface TupaRequisito {
  codigo: number;
  tupaId: number;
  codigoTupa: string;
  descripcion: string;
  estado: string;
  tieneAdjunto: boolean;
  tieneFormAnexo: boolean;
  tieneCosto: boolean;
  codigoFormAnexo: string;
  tipoPermiso: string;
  plantillaAdjunto: string;
  tramiteReqRefId: number;
  costo: number;
  auxOrden: number;
  tipoSolicitud: string;
  costoFormatted: string;
  nombrePlantilla: string
  codigoFormTupa: string
}
