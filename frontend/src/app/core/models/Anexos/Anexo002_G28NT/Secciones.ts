import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
export class Seccion1 {
    modalidad: string;
    resolucion: string;
    frecuencia: string;
}

export class Seccion2 {
    cambioUbicacion:boolean;
    cambioPotencia:boolean;
    cambioFrecuencia:boolean;
}

export class Seccion3{
    planta_distrito: UbigeoResponse;
    planta_provincia: UbigeoResponse;
    planta_departamento: UbigeoResponse;
    planta_direccion: string;
    planta_LO_grados: string;
    planta_LO_minutos: string;
    planta_LO_segundos: string;
    planta_LS_grados: string;
    planta_LS_minutos: string;
    planta_LS_segundos: string;

    frecuenciaAsignada: string;
    frecuenciaSolicitada: string;
    potenciaAutorizada: string;
    potenciaSolicitada: string;
    perdida: string;    
    sIrrad_Tipo: string;
    sIrrad_GananciaMaxRad: string;
    sIrrad_AcimutMaxRad: string;
    sIrrad_AlturaCentroRad: string;
    sIrrad_AlturaTorre: string;
    diagrama:boolean;
    archivoDiagramaRadiacion: File;
    pathNameDiagramaRadiacion?: string;
    enlace_est_planta:string;
    constructor(){
        this.planta_distrito = new UbigeoResponse();
        this.planta_provincia= new UbigeoResponse();
        this.planta_departamento=new UbigeoResponse();
    }
}
export class Seccion4 {
    declaracion: boolean;
}
export class Seccion5 {
    nombresIngeniero: string;
    telefonoIngeniero: string;
    emailIngeniero: string;
    tipoDocumentoSolicitante: string;
    numeroDocumentoSolicitante: string;
    nombresSolicitante: string;
}
