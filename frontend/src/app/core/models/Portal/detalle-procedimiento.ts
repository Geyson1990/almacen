export interface DetalleProcedimiento {
  idproc: number;
  procedimiento: string;
  idunidad: number | null;
  auxOrden: number | null;
  fechaCrea: string;
  fechaModif: string;
  iduserCrea: number;
  iduserModif: number;
  estado: number | null;
  idpadre: number | null;
  tipo: string;
  porcentajeUit: number | null;
  tipoEvaluacion: number;
  totalPositivo: number | null;
  totalNegativo: number | null;
  totalReconsid: number | null;
  totalApelacion: number | null;
  totalRevision: number | null;
  idunidadinicial: number | null;
  flagreiniciardesuspen: number | null;
  flagDigital: number | null;
  idunidadDigital: number | null;
  flagDigitalCopia: number | null;
  idUserCord: number | null;
  autoDestConfig: number | null;
  requiereAdjuntoFinal: number | null;
  flagTituloTt: number | null;
  flagEsVuce: number | null;
  flagEvalucionPrevia: number | null;
  flagPagoOblig: number | null;
  codigoProc: string;
  tipoSolicitudTupa: string;
  codigoTributo: string;
  tipoSubsanacion: number | null;
  flagLiberarVoucherTupa: number | null;
  grupoPago: string;
  formatoVuce: string;
  tipoTramite: number | null;
  idmateria: number | null;

  materiaTxt: string;
  tipoEvaluacionTxt: string;
  plazoAtencionTxt: string;
  dirGeneral: string;
  dirLinea: string;
  fichaTupa: string;
  manualTupa: string;
  tipoPersonaList: TipoPersona[];
  canalAtencionList: CanalAtencion[];
  pagoAdicionalList: PagoAdicional[];
  tipoSolicitudList: TipoSolicitud[];
  requisitoList: Requisito[];
  notaList: Nota[];

  // Campos adicionales
  tipoPersonaTxt: string;
}

export interface TipoPersona {
  idproc: number;
  tipoPersona: string;
  activo: string;
  fechaCrea: string;
  tipoPersonaDesc: string;
}

export interface CanalAtencion {
  idproc: number;
  idCanalAtencion: number;
  regActivo: number;
  canalAtencionDesc: string;
  canalAtencionUrl: string;
}

export interface PagoAdicional {
  idproctasa: number;
  idproc: number;
  concepto: string;
  tipoSolicitud: number | null;
  monto: number;
}

export interface TipoSolicitud {
  idproc: number;
  idtiposolicitud: number;
  descripcion: string;
  tipoEvaluacion: number | null;
  totalPositivo: number | null;
  totalNegativo: number | null;
  totalReconsid: number | null;
  totalApelacion: number | null;
  totalRevision: number | null;
  detalle: string;
  tipoEvaluacionTxt: string;
  plazoAtencionTxt: string;
}

export interface Requisito {
  idprocreq: number;
  idprocreqgrp: number | null;
  requisito: string;
  fechaCrea: string;
  fechaModif: string;
  iduserCrea: number;
  iduserModif: number;
  estado: number | null;
  auxOrden: number | null;
  flagPago: number | null;
  flagAdjunto: number | null;
  uriAdjunto: string;
  flagFormanexo: number | null;
  codigoFormanexo: string;
  tipoSolicitud: number | null;
  montoPago: number | null;
  flagObligatorio: number | null;
  idprocreqref: number | null;
  codigoTributo: string;
  flagReqTupa: number | null;
  tributoClasificador: string;
  flagDigital: number | null;
  filenameoriginal: string;
  filenameoriginalV2: string;
  flagFirma: number | null;
  codFormanexoTupa: string;

  // campos adicionales
  ordenTxt: string;
}

export interface Nota {
  idprocnota: number;
  idproc: number;
  secuencia: number | null;
  descripcion: string;
  tipoSolicitud: number | null;
}
