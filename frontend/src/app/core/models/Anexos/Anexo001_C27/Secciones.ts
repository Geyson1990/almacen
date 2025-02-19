import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { TripulacionModel } from '../../TripulacionModel';


export class A001_C27_Seccion1 {

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

export class A001_C27_Seccion2 {
    domicilioLegal: string;
    distrito: string;
    provincia: string;
    departamento: string;
}

export class A001_C27_Seccion3 {
    declaracionPrimero: string;
    declaracionLugar: string;
    declaracionFecha: string;
    declaracionSegundo:string;
    declaracionSegundoAsiento:string;
    declaracionSegundoPartida:string;
    declaracionSegundoRegistros:string;
    declaracionSegundoRepresentacion:string;
}




