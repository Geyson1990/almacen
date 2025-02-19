
import { TipoDocumentoModel } from '../../TipoDocumentoModel';


export class A001_D27_Seccion1 {

    tipoDocumento: TipoDocumentoModel;
    numeroDocumento: string;
    nombresApellidosRazonSocial: string;
    ruc: string;
    telefono: string;
    celular: string;
    correoElectronico: string;
      
    constructor(){
        this.tipoDocumento= new TipoDocumentoModel();
        // this.oficinaRegistral = new OficinaRegistral();
    }

}

export class A001_D27_Seccion2 {
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
}

export class A001_D27_Seccion3 {
    declaracionPrimero: string;
    declaracionLugar: string;
    declaracionFecha: string;

}
