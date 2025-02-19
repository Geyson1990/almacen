import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
export class Seccion1 {
    modalidad: string;
}

export class Seccion2 {
    est_distrito: UbigeoResponse;
    est_provincia: UbigeoResponse;
    est_departamento: UbigeoResponse;
    est_direccion: string;
    est_LO_grados: string;
    est_LO_minutos: string;
    est_LO_segundos: string;
    est_LS_grados: string;
    est_LS_minutos: string;
    est_LS_segundos: string;

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

    enlace_est_planta:string;
    constructor(){
        this.est_distrito = new UbigeoResponse();
        this.est_provincia= new UbigeoResponse();
        this.est_departamento=new UbigeoResponse();
        this.planta_distrito = new UbigeoResponse();
        this.planta_provincia= new UbigeoResponse();
        this.planta_departamento=new UbigeoResponse();
    }
}

export class Seccion3{
    potencia: string;
    perdida: string;    
    sIrrad_Tipo: string;
    sIrrad_GananciaMaxRad: string;
    sIrrad_AcimutMaxRad: string;
    sIrrad_AlturaCentroRad: string;
    sIrrad_AlturaTorre: string;
    diagrama:boolean;
    archivoDiagramaRadiacion: File;
    pathNameDiagramaRadiacion?: string;
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
