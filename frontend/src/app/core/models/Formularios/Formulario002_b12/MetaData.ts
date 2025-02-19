
import { Tramite } from 'src/app/core/models/Tramite';
import { DatosSolicitante, ServicioSolicitado } from './Secciones';


export class MetaData {
    datosSolicitante:   DatosSolicitante;
    archivoAdjunto:     string;
    servicioSolicitado: ServicioSolicitado;
    derechoTramite:     Tramite;

    constructor() {
        this.datosSolicitante = new DatosSolicitante();
        this.servicioSolicitado= new ServicioSolicitado();
        this.derechoTramite = new Tramite();
        
    }
 
}


