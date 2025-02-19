import { DatosSolicitante, ServicioSolicitado, DeclaracionJurada } from './Secciones';
import { Tramite } from '../../Tramite';


export class MetaData {
  
  // datosSolicitante: DatosSolicitante;
  // derechoTramite: Tramite;
  // representanteLegal: Persona;
  datosSolicitante:   DatosSolicitante;
  archivoAdjunto:     string;
  servicioSolicitado: ServicioSolicitado;
  derechoTramite:     Tramite;
  declaracionJurada:  DeclaracionJurada;
  constructor() {
    this.datosSolicitante =  new DatosSolicitante();
    this.servicioSolicitado = new ServicioSolicitado();
    this.derechoTramite = new Tramite();
    this.declaracionJurada = new DeclaracionJurada();
  }
}

// export class DatosSolicitante {
//   razonSocial:        string;
//   domicilio:          string;
//   distrito:           string;
//   provincia:          string;
//   departamento:       string;
//   dni:                string;
//   numeroRuc:          string;
//   telefonoFax:        string;
//   celular:            string;
//   correoElectronico:  string;
//   marcadoObligatorio: number;
//   peso:               number;
//   estatura:           number;
//   colorOjos:          string;
//   colorCabello:       string;
//   nacionalidad:       string;
//   fechaNacimiento:    Date;
//   registroLicenciaDGAC: string;
//   n:                string;
// }
