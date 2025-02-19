export class PERMISO_VUELO_INT {
  codUsuario: string;
  codigo: string;
  estado: number;
  formularioId: number;
  idTramiteReq: number;
  tramiteReqId: number;
  uriArchivo: string;
  metaData: MetaData;
  ouT_FLG_RESULT: string;
  ouT_MESSAGE: string;
  numeroExpediente: string;
  fechaEnviado: string;
  nombrePDF: string;
  datosPDF: string;
}

export class MetaData {
  seccion1: Seccion1;
  seccion2: Seccion2;
  seccion3: Seccion3;
  seccion4: Seccion4;
  seccion5: Seccion5;
  seccion6: Seccion6;
}

export class Seccion1 {
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoFormulario: string;
  tipoSolicitud: TipoSolicitud;
  datosOperador: DatosOperador;
  datosSolicitante: DatosSolicitante;
  facturarA: FacturarA;
  datosSolicitud: DatosSolicitud;
}

export class TipoSolicitud {
  opcionSeleccionada: string;
  esActualizacion: boolean;
  permisoVuelo: string;
}

export class DatosOperador {
  nombre: string;
  pais: string;
  idPais: string;
  domicilioLegal: string;
  telefono: string;
  email: string;
}

export class DatosSolicitante {
  nombre: string;
  fbo: string;
  cargo: string;
  telefono: string;
  email: string;
  notificar: boolean;
}

export class FacturarA {
  nombreORazonSocial: string;
  domicilioLegal: string;
  telefono: string;
  email: string;
}

export class DatosSolicitud {
  idAmbito: string;
  idTipoPermiso: string;
  idPermisoAmbito: string;
  tipoVuelo: string;
  idTipoVuelo: string;
  fechaPermisoInicio: string;
  fechaPermisoFin: string;
  cantidadDiasOperacion: number;
  numeroPasajero: string;
  adelantoDemora: string;
}

export class Seccion2 {
  flotaAutorizada: boolean;
  listaAeronave: Aeronave[];

  constructor() {
    this.listaAeronave = [];
  }
}

export class Aeronave {
  tipoAeronave: string;
  matricula: string;
  callSign: string;
  numeroVuelo: string;
}

export class Seccion3 {
  tripulacionAutorizada: boolean;
}

export class Tripulacion {
  nombre: string;
  idCargo: string;
  cargo: string;
  idNacionalidad: string;
  nacionalidad: string;
}

export class Seccion4 {
  listaInfoVuelo: InformacionVuelo[];

  constructor() {
    this.listaInfoVuelo = [];
  }
}

export class InformacionVuelo {
  origen: string;
  destino: string;
  rutaPlanificada: string;
  fechaEntrada: string;
  fechaSalida: string;
}

export class Seccion5 {
  comentarios: string;
}

export class Seccion6 {
  declaracion1: boolean;
  declaracion2: boolean;
}
