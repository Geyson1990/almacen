
import { Tramite } from '../../Tramite';
import { DatosSolicitante, ServicioSolicitado, DeclaracionJurada } from './Secciones';
export class MetaData {
  datosSolicitante:   DatosSolicitante;
  archivoAdjunto:     string;
  servicioSolicitado: ServicioSolicitado;
  derechoTramite:     Tramite;
  declaracionJurada:  DeclaracionJurada;

  constructor(){
    this.datosSolicitante = new DatosSolicitante();
    this.servicioSolicitado = new ServicioSolicitado();
    this.derechoTramite = new Tramite();
    this.declaracionJurada = new DeclaracionJurada();
  }
}

