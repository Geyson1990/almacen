import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { ProcedimientoModel } from 'src/app/core/models/Tramite/ProcedimientoModel';
import { RequisitoModel } from 'src/app/core/models/Tramite/RequisitoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-detalle-tupa',
  templateUrl: './detalle-tupa.component.html',
  styleUrls: ['./detalle-tupa.component.scss']
})
export class DetalleTupaComponent implements OnInit {
  @Input() datosTupa: ProcedimientoModel
  codTipoSolicitud: number

  requisitosTemp: RequisitoModel[]
  plazoAtencionTemp: number
  tipoEvaluacionTemp: string

  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private readonly visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    console.log("datosTupa => ", this.datosTupa)
    this.seleccionarTipoSolicitud()
  }

  seleccionarTipoSolicitud(codigo: number = null){
    console.log("datosTupa2 => ", this.datosTupa)
    console.log("codigo = ", codigo)
    if(codigo !== null){

    }else{ // OnInit
      const tiposSolicitud = this.datosTupa.tipoSolicitud as TipoSolicitudModel[]
      console.log("tiposSolicitud ==>", this.datosTupa.tipoSolicitud)

      if(tiposSolicitud) {
        console.log("this.datosTupa.tipoSolicitud?.length", tiposSolicitud.length)
        // const tiposSolicitud =  this.datosTupa.tipoSolicitud as TipoSolicitudModel[]
        this.codTipoSolicitud = tiposSolicitud[0].codigo
        console.log("this.codTipoSolicitud =>", this.codTipoSolicitud)
        this.requisitosTemp = this.filtrarRequisitos(this.codTipoSolicitud)
        this.plazoAtencionTemp = tiposSolicitud[0].plazoAtencion > 0 ? tiposSolicitud[0].plazoAtencion : this.datosTupa.plazoDias
        this.tipoEvaluacionTemp = tiposSolicitud[0].tipoEvaluacion != '' ? tiposSolicitud[0].tipoEvaluacion : this.datosTupa.tipoEvaluacion
      }
    }
  }

  filtrarRequisitos(codTipoSolicitud: number) : RequisitoModel[]{
    return this.datosTupa.requisitos.filter((r) => r.tipoSolicitud == codTipoSolicitud.toString() || r.tipoSolicitud=="");
  }

  getPersonaTexto(tiposPersona: any): string {
    const TIPO_PERSONA = [
      {cod:'00001', desc: 'PERSONA NATURAL'},
      {cod:'00002', desc: 'PERSONA JURÍDICA'},
      {cod:'00003', desc: 'PERSONA NATURAL JURÍDICA'},
      {cod:'00004', desc: 'PERSONA EXTRANJERA'},
      {cod:'00005', desc: 'PERSONA NATURAL CON RUC'},
      {cod:'00006', desc: 'PERSONA JURÍDICA O PERSONA NATURAL CON RUC'}
    ]
    let newArray = []
    const lista = tiposPersona.split(',')
    lista.forEach(element => {
      newArray.push(TIPO_PERSONA.find(x => x.cod == element)?.desc)
    });

    return newArray.join(', ')
  }

  verDocumento(uriArchivo: string, nombreArchivo: string = "") {

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = nombreArchivo !=''? nombreArchivo: "Vista Previa";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

    return
  }
}
