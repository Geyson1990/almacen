import { DatosSolicitante, ServicioSolicitado, DeclaracionJurada } from './Secciones';

export class MetaData {
    datosSolicitante:   DatosSolicitante;
    servicioSolicitado: ServicioSolicitado;
    declaracionJurada:  DeclaracionJurada;

    constructor(){
        this.datosSolicitante = new DatosSolicitante();
        this.servicioSolicitado = new ServicioSolicitado();
        this.declaracionJurada = new DeclaracionJurada();
    }
}