import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Encuesta, EncuestaDetalle, EncuestaPlantilla, TipoPreguntaEnum } from "../../domain";
import { EncuestaRepository } from "../repositories";

@Injectable()
export class FinalizarEncuestaUseCase {
  constructor(
    readonly repository: EncuestaRepository
  ) { }

  execute(data: EncuestaPlantilla): Observable<void> {
    const encuesta = {
      idEncuesta: data?.idEncuesta,
      codigoIdentificador: data?.codigoIdentificador,
      idEncuestaConfig: data?.idEncuestaConfig,
      comentarios: data?.encuestaConfig.comentarios,
      detalle: []
    } as Encuesta

    data?.encuestaConfig.secciones.forEach(seccion => {
      seccion.preguntas.forEach(pregunta => {

        switch(pregunta.idTipoPregunta) {

          case TipoPreguntaEnum.TEXTO_CORTO:
            encuesta.detalle.push({
              idSeccionConfig: pregunta.idSeccionConfig,
              idPreguntaConfig: pregunta.idPreguntaConfig,
              idTipoRespuesta: pregunta.idTipoRespuesta,
              opcionRespuestaId : null,
              opcionRespuestaDescripcion : null,
              valor : pregunta.respuesta.trim(),
            } as EncuestaDetalle)
            break;

          case TipoPreguntaEnum.TEXTO_LARGO:
            encuesta.detalle.push({
              idSeccionConfig: pregunta.idSeccionConfig,
              idPreguntaConfig: pregunta.idPreguntaConfig,
              idTipoRespuesta: pregunta.idTipoRespuesta,
              opcionRespuestaId: null,
              opcionRespuestaDescripcion: null,
              valor: pregunta.respuesta.trim(),
            } as EncuestaDetalle)
            break;

          case TipoPreguntaEnum.SELECCION_UNICA:
            encuesta.detalle.push({
              idSeccionConfig: pregunta.idSeccionConfig,
              idPreguntaConfig: pregunta.idPreguntaConfig,
              idTipoRespuesta: pregunta.idTipoRespuesta,
              opcionRespuestaId: Number(pregunta.respuesta),
              opcionRespuestaDescripcion: pregunta.opciones?.find(x => x.idOpcionRespuesta.toString() == pregunta.respuesta).descripcion,
              valor: pregunta.opciones?.find(x => x.idOpcionRespuesta.toString() == pregunta.respuesta).valorOpcion,
            } as EncuestaDetalle)
            break;

          case TipoPreguntaEnum.SELECCION_MULTIPLE:
            pregunta.opciones?.forEach(opt => {
              if(!!opt.seleccionado){
                encuesta.detalle.push({
                  idSeccionConfig: pregunta.idSeccionConfig,
                  idPreguntaConfig: pregunta.idPreguntaConfig,
                  idTipoRespuesta: pregunta.idTipoRespuesta,
                  opcionRespuestaId: opt.idOpcionRespuesta,
                  opcionRespuestaDescripcion: opt.descripcion,
                  valor: opt.flagOtro ? opt.respuestaOtro.trim() : opt.valorOpcion,
                } as EncuestaDetalle)
              }

            });
            break;

          default: break;
        }

        // const detalle = {
        //   idSeccionConfig: pregunta.idSeccionConfig,
        //   idPreguntaConfig: pregunta.idPreguntaConfig,
        //   opcionRespuestaId: pregunta.respuesta,
        //   opcionRespuestaDescripcion: pregunta.opciones?.find(x => x.idOpcionRespuesta.toString() == pregunta.respuesta).descripcion,
        //   valor: pregunta.opciones?.find(x => x.idOpcionRespuesta.toString() == pregunta.respuesta).valorOpcion,
        //   idTipoRespuesta: pregunta.idTipoRespuesta,
        // } as EncuestaDetalle

        // encuesta.detalle.push(detalle)
      });
    });

    console.log("DATOS A ENVIAR => ", encuesta)
    return this.repository.finalizar(encuesta);
  }
}
