import { DatosSolicitante, DeclaracionJurada, ServicioSolicitado } from './Secciones';

export class MetaData {

  datosSolicitante:   DatosSolicitante;
  archivoAdjunto:     File;
  pathName      : string;
  servicioSolicitado: ServicioSolicitado;
  declaracionJurada:  DeclaracionJurada;

  constructor() {
    this.datosSolicitante =  new DatosSolicitante();
    this.servicioSolicitado = new ServicioSolicitado();
    this.declaracionJurada = new DeclaracionJurada();
  }
}

// export class DatosSolicitante {
//   ruc:          string;
//   razonSocial:        string;
//   domicilio:          string;
//   distrito:           string;
//   provincia:          string;
//   departamento:       string;
//   //tipoDocumento: string;
//   //dni:                string;
//   telefonoFax:        string;
//   celular:            string;
//   correoElectronico:  string;
//   marcadoObligatorio: number;
//   poderRegistrado: string;
//   oficinaRegistral: number;
// }
