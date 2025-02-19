import { PaisResponse } from '../../Maestros/PaisResponse';
import { SelectionModel } from '../../SelectionModel';
import { TipoDocumentoModel } from '../../TipoDocumentoModel';
import { TripulacionModel } from '../../TripulacionModel';


export class A001_A27_Seccion1 {

tipoDocumento : TipoDocumentoModel;
numeroDocumento: string;
nombresApellidosRazonSocial:string;
ruc: string;
telefono: string;
celular: string;
correoElectronico: string;
constructor(){
    this.tipoDocumento = new TipoDocumentoModel();
    // this.oficinaRegistral = new OficinaRegistral();
}
}

export class A001_A27_Seccion2 {

    portadorLocalConmutado : boolean;
    portadorLocalNoConmutado:boolean;
portadorLargaDistanciaInternacionalConmutado    						:boolean;
portadorLargaDistanciaInternacionalNoConmutado                        :  boolean ;
portadorLargaDistanciaNacionalConmutado                               :  boolean ;
portadorLargaDistanciaNacionalNoConmutado                             :  boolean ;
telefoníaFijaAbonados                                                 :  boolean ;
telefoníaFijaTelefonosPublicos                                        :  boolean ;
telefoniaMovilAbonados                                                :  boolean ;
telefoniaMovilTelefonosPublicos                                       :  boolean ;
                                                                    
distribucionRadiodifusiionCableAlambricoOptico                        :  boolean ;
distribucionRadiodifusionCableDifusionDirectaSatelite                 :  boolean ;
distribucionRadiodifusionCableMMDS                                    :  boolean ;
servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizado           :  boolean ;
servicioComunicacionesPersonalesPCS                                   :  boolean ;
                                                                     
movilporSatelite                                                      :  boolean ;
movildDatosMarítimoSatelite													  :  boolean ;
                                                                
otrosEstablecidosArticulo53											: boolean     ;
otrosDescripcion                        : string;
}

export class A001_A27_Seccion3 {
    
    proyeccion: Proyeccion[];
    moneda: string;
    constructor(){
        this.proyeccion = [];
    }

}


export class Proyeccion {
    Dolares: boolean;
    Soles: boolean;
    Moneda : string;
    Anio: string;
    Cantidad: number;
}