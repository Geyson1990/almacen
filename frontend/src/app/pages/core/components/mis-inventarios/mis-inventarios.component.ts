import { Component, OnInit } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { GlobalService } from 'src/app/core/services/mapas/global.service';

@Component({
  selector: 'app-mis-inventarios',
  templateUrl: './mis-inventarios.component.html',
  styleUrls: ['./mis-inventarios.component.css']
})
export class MisInventariosComponent implements OnInit {

  tipoPersona: string;
  tipoDocumento: string;
  NDocumento: string;
  Nombres: string;
  Ruc: string;
  tipoNombres: string;
  datosUsuarioLogin: DatosUsuarioLogin;
  listadoBandejaBase = [];
  listadoBandeja = [];
  BandejaSize=1;
  page = 1;
  pageSize = 50;
  filtrarTexto: string="";
  filtrarEstado: string="ALL";

  constructor(
    private seguridadService: SeguridadService,
    private TramiteService: TramiteService,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private route: Router,
    private globalService: GlobalService
  ) {
    this.datosUsuarioLogin = new DatosUsuarioLogin();
    this.datosUsuarioLogin.nombreCompleto = this.seguridadService.getUserName();
    this.datosUsuarioLogin.nroDocumento = this.seguridadService.getNumDoc();
    this.datosUsuarioLogin.razonSocial = this.seguridadService.getUserName();
  }

  ngOnInit(): void {
    this.cargarBandeja();
  }


  

  cargarBandeja() {

    this.funcionesMtcService.mostrarCargando();
    this.TramiteService.getTramiteBandejaAdministrado().subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
        this.listadoBandejaBase = resp.data;
        this.listadoBandeja = resp.data;
        this.BandejaSize = resp.data.length;
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar el inventario');
        this.funcionesMtcService.ocultarCargando();
      }
    );
  }

  
  irTramiteIniciado(item) {
    console.log(item);
    localStorage.setItem("tramite-id",item.codMaeSolicitud);
    localStorage.setItem("tupa-id",item.codIdMaeTupa);
    localStorage.setItem("tramite-solicitud", item.numSTD);

    // this.TramiteService.getTupa(item.tupaId).subscribe(
    //   (resp: any) => {
    //     console.log(resp);
    //     localStorage.setItem("tramite-selected",JSON.stringify(resp));
    //   }
    // );

    if(item.estado === "OBSERVADO" && item.tipoSubsanacion === "TD" && item.fechaAcuseObs === ""){
      this.acuseObservado(item);
    }else if(item.estado === "ATENDIDO" && item.tipoSubsanacion === "TD" && item.fechaAcuseAte === ""){
      this.acuseAtendido(item);
    }else{
      const params = {
        codigoTupa: item.codMaeTupa,
        denominacionEstado: item.denominacionEstado
      };
      localStorage.setItem("tramite-selected",JSON.stringify({codigo:item.codMaeTupa}));
      this.globalService.setLastPage('mis-tramites'); 
      this.route.navigate(['tramite-iniciado'], { queryParams: params });
    }
  }

  refreshCountries(pagination: PaginationModel) {
  }

  verExpedientePDF(item){
    //this.funcionesMtcService.mostrarCargando();
    console.log(item.docExpediente);
    this.visorPdfArchivosService.get(item.docExpediente)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa Expediente [ " + item.numSTD + " ]";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  verSubsanacionPDF(item){
    //this.funcionesMtcService.mostrarCargando();
    console.log(item.docExpedienteSub);
    this.visorPdfArchivosService.get(item.docExpedienteSub)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa Expediente [ " + item.numSTD + " ]";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  anulaTramite(item){
    debugger;
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de Anular su expediente? \n`)
        .then(() => {
          console.log("Anular expediente: "+item.id);

          this.funcionesMtcService.mostrarCargando();
          this.TramiteService.putAnular({codMaeSolicitud: item.codMaeSolicitud})
          .subscribe(
            resp => {
              debugger;
              if(resp.data > 0){
                this.funcionesMtcService.mensajeOk("Se anuló el expediente "+item.numSTD);
              }else{
                this.funcionesMtcService.mensajeError("No se anuló el expediente");
              }
              this.modalService.dismissAll();
              this.cargarBandeja();
            },
            error => {
              this.funcionesMtcService.mensajeError("Ocurrio un problema al grabar URL");
            },
            () => this.funcionesMtcService.ocultarCargando()
          );

         });
  }

  acuseObservado(item){
    this.funcionesMtcService.mensajeOkTit("ACUSE DE RECEPCIÓN", "Usted está ingresando al detalle de observaciones realizadas al trámite " + item.numSTD + "\n. Sírvase subsanar las observaciones en el plazo indicado.").then(() => {
      this.TramiteService.putAcuseObservado(item.id)
      .subscribe(
        resp => {
          if(resp === 1){
            this.globalService.setLastPage('mis-tramites'); 
              this.route.navigate(['tramite-iniciado']);
          }else{
            this.funcionesMtcService.mensajeError("No se pudo obtener el acuse de recepción");
          }
          this.modalService.dismissAll();
        },
        error => {
          this.funcionesMtcService.mensajeError("Ocurrio un problema al grabar el acuse de recepción");
        },
        () => this.funcionesMtcService.ocultarCargando()
      );
    });
  }

  acuseAtendido(item){
    this.funcionesMtcService.mensajeOkTit("ACUSE DE RECEPCIÓN", "Usted está ingresando a la respuesta de solicitud del trámite  " + item.numExpdiente).then(() => {
      this.TramiteService.putAcuseAtendido(item.id)
      .subscribe(
        resp => {
          if(resp === 1){
            this.globalService.setLastPage('mis-tramites'); 
              this.route.navigate(['tramite-iniciado']);
          }else{
            this.funcionesMtcService.mensajeError("No se pudo obtener el acuse de recepción");
          }
          this.modalService.dismissAll();
        },
        error => {
          this.funcionesMtcService.mensajeError("Ocurrio un problema al grabar el acuse de recepción");
        },
        () => this.funcionesMtcService.ocultarCargando()
      );
    });
  }

  irEncuesta(idEncuesta: number, codigoIdentificador: string){
    this.route.navigate(['encuesta/form', idEncuesta, codigoIdentificador]);
  }
}

