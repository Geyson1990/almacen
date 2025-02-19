export interface Encuesta {
  idEncuesta: number;
  codigoIdentificador: string;
  idEncuestaConfig: number;
  resultado?: string;
  comentarios: string;
  detalle: EncuestaDetalle[]
}

export interface EncuestaDetalle {
  idEncuestaDetalle?: number;
  idEncuesta?: number;

  idSeccionConfig: number;
  idPreguntaConfig: number;
  idTipoRespuesta: number;

  opcionRespuestaId: number;
  opcionRespuestaDescripcion: string;
  valor: string;
}
