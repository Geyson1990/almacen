import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response'; 
import { Observacion } from '../models/Observacion';
import { map, tap } from 'rxjs/operators';
import { Comment as CommentModel } from '../models/Comment';
 
@Injectable({
  providedIn: 'root'
})
export class ObservacionService {
 
  urlObservacion = '';  
  urlObtenerObservacion = ''; 
  urlObtenerComentario = ''; 
  urlUpdateObservacion = ''; 
  urlDeleteObservacion = ''; 
  urlObtenerSolicitudObservacion = ''; 
  constructor(private httpClient: HttpClient) {
    this.urlObservacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.observacion.insertar}`;
    this.urlObtenerObservacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.observacion.obtener}`;
    this.urlUpdateObservacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.observacion.actualizar}`;
    this.urlDeleteObservacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.observacion.eliminar}`;
    this.urlObtenerSolicitudObservacion = `${environment.baseUrlTramiteAPI}${environment.endPoint.observacion.solictudObservacion}`;
   } 

  insertarObservacion(model: any): Observable<ApiResponse<number>> {
    const observacion: Observacion = {
      idobshistjson: model.idobshistjson,
      codmaesolicitud: model.codMaeSolicitud,
      capitulo: model.capitulo,
      estado: model.estado,
      usuarioCreacion: model.regUsuaRegistra.toString(),
      fechaCreacion: "",
      usuarioUltimaMod: model.regUsuaRegistra.toString(),
      fechaUltimaMod: "",
      iddetobshistjson: model.iddetobshistjsonpadre,
      observacion: model.comentario,
      nomnbre: model.nombresPersona,
      codmovpersona: model.codMovPersona,  
      orden: 0,
      iddetobshistjsonpadre: model.iddetobshistjsonpadre,
      estadoobservacion : model.estadoobservacion,
      descripcionCapitulo: ''
      };   
    return this.httpClient.post<ApiResponse<number>>(this.urlObservacion, observacion);
  }
 
  getObservacion(codmaesolicitud: any, capitulo: any,iddetobshistjsonpadre: any): Observable<ApiResponse<CommentModel[]>> {
    
    return this.httpClient.get<ApiResponse<Observacion[]>>(`${this.urlObtenerObservacion}?codmaesolicitud=${codmaesolicitud}&capitulo=${capitulo}&iddetobshistjsonpadre=${iddetobshistjsonpadre}`)
      .pipe(
        map(response => {           
            const comments = response.data.map(observacion => {
                const comment = new CommentModel(); // Si tienes una clase, usa el constructor
                comment.codMovComentario = 0;
                comment.codMaeSolicitud = 0;
                comment.codMovPersona = 0;
                comment.nombresPersona = observacion.nomnbre;
                comment.comentario = observacion.observacion;
                comment.codMovComentPadre = 0;
                comment.respuestas = null;
                comment.listaRespuestas = null;
                comment.regUsuaRegistra = 0;
                comment.estado = observacion.estado;
                comment.fechRegistra = observacion.fechaCreacion;
                comment.idobshistjson = observacion.idobshistjson;
                comment.iddetobshistjson =  observacion.iddetobshistjson;
                comment.orden = observacion.orden;
                comment.capitulo = observacion.capitulo;
                comment.iddetobshistjsonpadre =observacion.iddetobshistjsonpadre;
                comment.estadoobservacion = observacion.estadoobservacion;
            // Agrega todas las asignaciones de propiedades requeridas
            return comment;
          });
          return { ...response, data: comments } as ApiResponse<CommentModel[]>;
        })
    )
  } 

  updateCommentRequest(model:any): Observable<ApiResponse<number>> {
    // Convertir el modelo Comment a Observacion antes de enviarlo al backend
    const observacion: Observacion = {
      idobshistjson: model.idobshistjson,
      codmaesolicitud: model.codMaeSolicitud,
      capitulo: model.capitulo,
      estado: model.estado,
      usuarioCreacion: model.regUsuaRegistra.toString() ,
      fechaCreacion: "",
      usuarioUltimaMod: model.regUsuaRegistra.toString(),
      fechaUltimaMod: "",
      iddetobshistjson: model.iddetobshistjson,
      observacion: model.comentario,
      nomnbre: model.nombresPersona,
      codmovpersona: model.codMovPersona,
      iddetobshistjsonpadre: model.iddetobshistjsonpadre,
      orden: model.orden,
      estadoobservacion: model.estadoobservacion,
      descripcionCapitulo: ''
    };
    return this.httpClient.put<ApiResponse<number>>(this.urlUpdateObservacion, observacion);
  }

  deleteCommentRequest(iddetobshistjson: number) {

    return this.httpClient.delete<ApiResponse<number>>(`${this.urlDeleteObservacion}?iddetobshistjson=${iddetobshistjson}`)
        .pipe(tap(resp => {
        console.log('Respuesta del DeleteCommentRequest', resp);
      })
      );
  }

  getSolicitudObservacion(codmaesolicitud: any): Observable<ApiResponse<CommentModel[]>> {
    
    return this.httpClient.get<ApiResponse<Observacion[]>>(`${this.urlObtenerSolicitudObservacion}?codmaesolicitud=${codmaesolicitud}`)
      .pipe(
        map(response => {   
            const comments = response.data.map(observacion => {
             
                const comment = new CommentModel(); // Si tienes una clase, usa el constructor
                comment.codMovComentario = 0;
                comment.codMaeSolicitud = 0;
                comment.codMovPersona = 0;
                comment.nombresPersona = observacion.nomnbre;
                comment.comentario = observacion.observacion;
                comment.codMovComentPadre = 0;
                comment.respuestas = null;
                comment.listaRespuestas = null;
                comment.regUsuaRegistra = 0;
                comment.estado = observacion.estado;
                comment.fechRegistra = observacion.fechaCreacion;
                comment.idobshistjson = observacion.idobshistjson;
                comment.iddetobshistjson =  observacion.iddetobshistjson;
                comment.orden = observacion.orden;
                comment.capitulo = observacion.capitulo;
                comment.iddetobshistjsonpadre =observacion.iddetobshistjsonpadre;
                comment.descripcionCapitulo = observacion.descripcionCapitulo;
                comment.estadoobservacion = observacion.estadoobservacion;
            // Agrega todas las asignaciones de propiedades requeridas
            return comment;
          });
          return { ...response, data: comments } as ApiResponse<CommentModel[]>;
        })
    )
  } 
}
