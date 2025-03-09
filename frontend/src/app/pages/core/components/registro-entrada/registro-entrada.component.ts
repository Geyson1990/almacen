import { Component, OnInit } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { GlobalService } from 'src/app/core/services/mapas/global.service';
import { InventarioService } from '../../../../core/services/inventario/inventario.service';
import { IngresoService } from 'src/app/core/services/inventario/ingreso.service';
import { NuevoIngresoComponent } from 'src/app/modals/nuevo-ingreso/nuevo-ingreso.component';

@Component({
  selector: 'app-registro-entrada',
  templateUrl: './registro-entrada.component.html',
  styleUrls: ['./registro-entrada.component.css']
})
export class RegistroEntradaComponent implements OnInit {

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
    private inventarioService: InventarioService,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private route: Router,
    private globalService: GlobalService,
    private ingresoService: IngresoService
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
    this.ingresoService.getAll().subscribe(
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

   
      const params = {
        codigoTupa: item.codMaeTupa,
        denominacionEstado: item.denominacionEstado
      };
      localStorage.setItem("tramite-selected",JSON.stringify({codigo:item.codMaeTupa}));
      this.globalService.setLastPage('mis-tramites'); 
      this.route.navigate(['tramite-iniciado'], { queryParams: params });
    
  }

  refreshCountries(pagination: PaginationModel) {
  }

  onChangeFilterByState(){}
  onChangeFilter(event: any){}
  onNuevo(item?:any){
    const modalOptions: NgbModalOptions = {
          size: 'lg',
          centered: true,
          ariaLabelledBy: 'modal-basic-title'
        };   
    
        const modalRef = this.modalService.open(NuevoIngresoComponent, modalOptions);
        modalRef.componentInstance.title = "Nuevo producto";
        modalRef.componentInstance.id = item?.idEntrada || 0;
    
        modalRef.result.then(
          (result) => {
            window.location.reload();
          },
          (reason) => {// Maneja la cancelación aquí
            console.log('Modal fue cerrado sin resultado:', reason);
          });
  }
}

