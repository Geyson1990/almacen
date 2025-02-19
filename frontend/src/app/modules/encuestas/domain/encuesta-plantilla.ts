export interface EncuestaPlantilla {
  idEncuesta: number;
  codigoIdentificador: string;
  idEncuestaConfig: number;
  fechaCaduca: string;
  estado: string;
  encuestaConfig: EncuestaConfig;
}

export interface EncuestaConfig {
  idEncuestaConfig: number;
  titulo: string;
  descripcion: string;
  flagComentarios: boolean;
  idEncuestaDestino: number;
  secciones: SeccionConfig[];
  comentarios?: string
}

export interface SeccionConfig {
  idSeccionConfig: number;
  nombre: string;
  flagCompartido: boolean;
  orden: number;
  preguntas: PreguntaConfig[];
}

export interface PreguntaConfig {
  idSeccionConfig: number;
  idPreguntaConfig: number;
  descripcion: string;
  idTipoPregunta: number;
  flagObligatorio: boolean;
  orden: number;
  idTipoRespuesta: number | null;
  respuesta?: string
  opciones?: OpcionConfig[];
}

export interface OpcionConfig {
  idOpcionRespuesta: number;
  idTipoRespuesta: number;
  descripcion: string;
  valorOpcion: string;
  flagOtro: boolean;
  respuestaOtro?: string
  orden: number;
  seleccionado?: boolean
}
