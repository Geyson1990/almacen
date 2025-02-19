import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Comment } from 'src/app/core/models/Comment';
import { ObservacionService } from 'src/app/core/services/observacion.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
export interface data {
  codMaeSolicitud: number;
  regUsuaRegistra: number;
  codMovPersona: number;
  capitulo: string;
  encabezadoObservacion: string;
  codMovSolicitud: number;
  nombreCapitulo: string;
}

@Component({
  selector: 'app-comment-modal-table',
  templateUrl: './comment-modal-table.component.html',
  styleUrls: ['./comment-modal-table.component.css'],
})
export class CommentModalTableComponent implements OnInit {
  commentT: Comment = new Comment();
  comments: Comment[] = [];
  respuestas: Comment[] = [];
  isDisabled: boolean = true;
  @Input() data!: data;
  encabezadoObservacion: string = "";
  activeModal = inject(NgbActiveModal);
  accion: string = "crear";
  isResponding: boolean = false;
  constructor(private observacionService: ObservacionService,
    private seguridadService: SeguridadService,
    private dialog: MatDialog,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  ngOnInit(): void {
    this.listComments();
  }

  listComments() {
    this.initializeComment();
    this.comments = [];
    this.respuestas = [];
    this.getObservacion(this.commentT.codMaeSolicitud, this.commentT.capitulo, this.commentT.codMovComentPadre); 
  }

  initializeComment() {
    this.commentT.codMovComentario = 0;
    this.commentT.codMovComentPadre = 0;
    this.commentT.comentario = '';
    this.commentT.regUsuaRegistra = this.data.regUsuaRegistra;
    this.commentT.codMovPersona = this.data.codMovPersona;
    this.commentT.codMaeSolicitud = this.data.codMaeSolicitud;
    this.commentT.capitulo = this.data.capitulo;
    this.commentT.estadoobservacion = 5;
  }

  insertObservacion() {
    if (!this.commentT.comentario) { return; }
 
    if (this.accion == "crear") {      
    this.observacionService.insertarObservacion(this.commentT).subscribe(resp => {
      if (resp.success) {   
        this.getObservacion(this.commentT.codMaeSolicitud, this.commentT.capitulo, this.commentT.codMovComentPadre);
        this.commentT.comentario = '';
        this.isResponding = false;
        return;
      } else {
        return;
      }

    }, err => {
      console.log('Error', err);
    });
    } else {
      this.observacionService.updateCommentRequest(this.commentT).subscribe(resp => {
        if (resp.success) {
          
          this.commentT.comentario = "";       
          this.getObservacion(this.commentT.codMaeSolicitud, this.commentT.capitulo, this.commentT.codMovComentPadre);
          this.accion = "crear";
          this.isResponding = false;
        } else {
         
        }
  
      }, err => {
        console.log('Error', err);
      });
  }
  
}
 
  closeDialog() {
    this.comments = [];
    this.respuestas = [];
    this.activeModal.dismiss();
  }

  toggleResponse(index: number, estadoObservacion: number) {
    this.commentT.iddetobshistjsonpadre = index; 
    this.commentT.estadoobservacion = estadoObservacion; 
    var flag= false;
    const commentsArray = [this.commentT];
    commentsArray.forEach(comment => {
      const respuestasParaPadre = this.respuestas.filter(respuesta => respuesta.iddetobshistjsonpadre === comment.iddetobshistjsonpadre);
      comment.numRespuestas = respuestasParaPadre.length;  
      if (comment.numRespuestas > 0) { 
        flag = true;
      }else{
        flag = false;
      }
    }); 
 
    if (flag) {   
      this.funcionesMtcService
      .mensajeWarn('No se puede ingresar mas de una respuesta.')
      .then(() => {       
        
      }); 
      return false;
    }else{        
      this.isResponding = !this.isResponding;
      if (this.isResponding) {
      } else {
        this.isResponding = true;
        this.commentT.comentario = '';
      }  
      return false;
    }

    console.log('this.commentT::', this.commentT);   
    
  }

  getObservacion(codMaeSolicitud, capitulo, codMovComentPadre){
    this.observacionService.getObservacion(codMaeSolicitud, capitulo, codMovComentPadre).subscribe(resp => {
      if (!resp.success) {
        return;
      }
      this.comments = resp.data;
 
      this.comments.forEach(comment => {
        if (comment.iddetobshistjson) {
          this.verRespuestas(comment.iddetobshistjson);
        }
      });
    }, err => {
      console.log('Error', err);
    });
  }

  verRespuestas(codMovComentPadre: number) {
    this.respuestas = [];
    this.observacionService.getObservacion(this.commentT.codMaeSolicitud, this.commentT.capitulo, codMovComentPadre).subscribe(
      resp => {
        this.respuestas.push(...resp.data);
      },
      err => {
        console.log('Error', err);
      }
    );
    
  }

  initializeEdit(respuesta ) {
    this.accion = "modificar";
    this.commentT.idobshistjson = respuesta.idobshistjson;
    this.commentT.iddetobshistjson = respuesta.iddetobshistjson;    
    this.commentT.codMovComentario = respuesta.codMovComentario;
    this.commentT.comentario = respuesta.comentario;
    this.commentT.orden = respuesta.orden;   
    this.commentT.iddetobshistjsonpadre = respuesta.iddetobshistjsonpadre;
    this.isResponding = true; 
    return false;
  } 

  eliminarRespuesta(comment: Comment) {
    this.accion = "eliminmar";
      this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el comentario?','question')
      .then(() => {
       
          this.observacionService.deleteCommentRequest(comment.iddetobshistjson).subscribe(resp => {        
            console.log('delete',resp );  
            if (resp) {
          } else {
            this.commentT.codMovComentPadre = 0;
          }
            this.listComments();
          }, err => {
            console.log('Error', err);
          });
       
      }); 
      return false;
  }
}
