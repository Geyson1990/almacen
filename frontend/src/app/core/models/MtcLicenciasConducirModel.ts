export class MtcLicenciasConducirModel {
    GetDatosLicenciaMTCResult: GetDatosLicenciaMTCResult;    
    constructor (){
        this.GetDatosLicenciaMTCResult= new GetDatosLicenciaMTCResult();    
    }
}

export class GetDatosLicenciaMTCResult{
    CodigoRespuesta: string;
    Licencia: Licencia;    
}

export class Licencia {
    TipoDoc:string;
    Correlato: string;
    NroLicencia: string;
    Categoria: string;
    ApellidoPaterno: string;
    ApellidoMaterno:string;
    Nombre: string;
    Departamento: string; 
    Provincia: string;
    Distrito: string;
    Direccion: string;
    Fechaemision: string;
    Fechaexpedicion: string;
    Fecharevalidacion: string;
    Estadolicencia: string;   
    
}
