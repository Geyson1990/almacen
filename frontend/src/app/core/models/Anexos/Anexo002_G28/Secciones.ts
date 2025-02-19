import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
export class A002_G28_Seccion1 {
    autorizacionModalidad: string;
    nResolucionAutorizada: string;
    enFrecuenciaCanal: string;
}
export class A002_G28_Seccion2 {
    servCambioUbicacion: boolean;
    servAumentoPotencia: boolean;
    servCambioFrecuencia: boolean;
}
export class A002_G28_Seccion3 {
    frCanal_Asignado: string;    
    frCanal_Solicitado: string;    
    potencia_Autorizada: string;
    potencia_Solicitada: string;    
    sIrrad_Tipo: string;
    sIrrad_GananciaMaxRad: string;
    sIrrad_AcimutMaxRad: string;
    sIrrad_InclinacionHaz: string;
    sIrrad_AlturaCentroRad: string;
    sIrrad_AlturaTorre: string;
    perdida_ConectorCableDist: string;
    ubicacionDireccion: string;
    distrito: UbigeoResponse;
    provincia: UbigeoResponse;
    departamento: UbigeoResponse;
    coordWGS84LO_grados: string;
    coordWGS84LO_minutos: string;
    coordWGS84LO_segundos: string;
    coordWGS84LS_grados: string;
    coordWGS84LS_minutos: string;
    coordWGS84LS_segundos: string;
    plantaTransmisora: string;
    archivoDiagramaRadiacion: File;
    pathNameDiagramaRadiacion?: string;
}
export class A002_G28_Seccion4 {
    telefonoIngeniero: string;
    emailIngeniero: string;
}
