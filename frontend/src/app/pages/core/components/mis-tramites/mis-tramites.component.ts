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
  selector: 'app-mis-tramites',
  templateUrl: './mis-tramites.component.html',
  styleUrls: ['./mis-tramites.component.css']
})
export class MisTramitesComponent implements OnInit {

  tipoPersona: string;
  tipoDocumento: string;
  NDocumento: string;
  Nombres: string;
  Ruc: string;
  tipoNombres: string;
  datosUsuarioLogin: DatosUsuarioLogin;
  listadoBandejaBase = [];
  listadoBandejaFiltro = [];
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
    //this.datosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin();
    //console.log(this.datosUsuarioLogin)
    this.datosUsuarioLogin = new DatosUsuarioLogin();
    this.datosUsuarioLogin.nombreCompleto = this.seguridadService.getUserName();
    this.datosUsuarioLogin.nroDocumento = this.seguridadService.getNumDoc();
    this.datosUsuarioLogin.razonSocial = this.seguridadService.getUserName();
    // this.datosUsuarioLogin.nombreCompleto = this.seguridadService.getUserName();
    // this.datosUsuarioLogin.nombreCompleto = this.seguridadService.getUserName();
    // this.datosUsuarioLogin.nombreCompleto = this.seguridadService.getUserName();
  }

  ngOnInit(): void {
    this.traerDatos();
    this.cargarBandeja(this.tipoPersona,this.seguridadService.getNameId(), this.NDocumento);
  }

  traerDatos() {
    this.NDocumento = this.seguridadService.getNumDoc();
    this.Nombres = this.seguridadService.getUserName();
    this.Ruc = this.seguridadService.getCompanyCode();
    if(this.seguridadService.getNameId() === '00001'){
      this.tipoPersona = 'PERSONA NATURAL';
      this.tipoDocumento = 'DNI';
      this.tipoNombres = "Solicitante";
    }else if(this.seguridadService.getNameId() === '00002'){
      this.tipoPersona = 'PERSONA JURÍDICA';
      this.tipoDocumento = 'RUC';
      this.tipoNombres = "Solicitante";
    }else if(this.seguridadService.getNameId() === '00004'){
      this.tipoPersona = 'PERSONA EXTRANJERA';
      this.tipoDocumento = 'CE';
      this.tipoNombres = "Solicitante";
    }else {
      this.tipoPersona = 'PERSONA NATURAL CON RUC';
      this.tipoDocumento = 'RUC';
      this.tipoNombres = "Solicitante";
    }
  }

  cargarBandeja(tipopersona: string, tipodoc: string, numdoc: string) {
    console.log(tipopersona, tipodoc, numdoc);
    this.funcionesMtcService.mostrarCargando();
    this.TramiteService.getTramiteBandejaAdministrado().subscribe(
      (resp: any) => {
        console.log(resp);
        this.funcionesMtcService.ocultarCargando();
        this.listadoBandejaBase = resp.data;
        this.listadoBandejaFiltro = resp.data;
        this.BandejaSize = resp.data.length;
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar los trámites');
        this.funcionesMtcService.ocultarCargando();
      }
    );
  }

  onChangeFilter(value: string){
    if(value === "ALL"){
      this.listadoBandejaFiltro = this.listadoBandejaBase;
      this.BandejaSize = this.listadoBandejaBase.length;
    }else{
      this.listadoBandejaFiltro = this.listadoBandejaBase.filter(x => x.estado === value);
      this.BandejaSize = this.listadoBandejaFiltro.length;
    }

  }

  onChangeFilterByState(){
    if(this.filtrarEstado === "ALL"){
      this.listadoBandejaFiltro = this.listadoBandejaBase;
      this.BandejaSize = this.listadoBandejaBase.length;
    }else{
      this.listadoBandejaFiltro = this.listadoBandejaBase.filter(x => x.denominacionEstado === this.filtrarEstado);
      this.BandejaSize = this.listadoBandejaFiltro.length;
    }

    if (this.filtrarTexto !== ""){
      this.listadoBandejaFiltro = this.listadoBandejaFiltro.filter(x => x.denominacion?.toLowerCase()?.includes(this.filtrarTexto.toLowerCase()) ||  x.numSTD?.toLowerCase()?.includes(this.filtrarTexto.toLowerCase()));
      this.BandejaSize =this.listadoBandejaFiltro.length;
    }

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
              this.cargarBandeja(this.tipoPersona,this.seguridadService.getNameId(), this.NDocumento);
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

