/*export class EllipseModel {
    GetDatosTecnicosResult: GetDatosTecnicosResult;
    GetDatosAdministradoResult: GetDatosAdministradoResult;
    GetSociosResult: GetSociosResult;
    constructor (){
        this.GetDatosTecnicosResult = new GetDatosTecnicosResult();
        this.GetDatosAdministradoResult = new GetDatosAdministradoResult();
        this.GetSociosResult = new GetSociosResult();
    }
}*/
export class responseDatosTecnicos {
    datosTecnicosResponse: datosTecnicosResponse;
    constructor(){
        this.datosTecnicosResponse = new datosTecnicosResponse();
    }
}
export class datosTecnicosResponse{
    respDatosTecnicos: respDatosTecnicos[];
    constructor(){
        this.respDatosTecnicos = [];
    }
}


export class respDatosTecnicos{
    razonSocial: string;
    indicativo: string;
    banda: string;
    localidad: string;
    calificacionLocalidad: string;
    front: string;
    finalidad: string;
    inicioVigencia: string;
    finVigencia: string;
    licencia: string;
    frecuenciaCanal: string;
    pagoTramite: string
}

export class DatosAdministradoModel{
    RazonSocial: string;
    PaisNacionalidad: string;
    TipoDoc: string;
    NumDoc: string;
    TipoRazonSocial: string;
    Discapacidad: string;
    DomicilioLegal: string;
    Departamento: string;
    Provincia: string;
    Distrito: string;
    Telefono: string;
    Email: string;
    RepresentanteLegal: string;
}
export class DatosSociosModel{
    socios: Socio[];
    constructor(){
        this.socios = [];
    }
}

export class Socio{
    RazonSocial: string;
    SocioMiembro: string;
    PaisNacionalidad: string;
    Cargo: string;
    PorcentajeCapital: string;
}
