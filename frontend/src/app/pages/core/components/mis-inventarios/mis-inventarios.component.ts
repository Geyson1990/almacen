import { Component, inject, OnInit } from '@angular/core';
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
import { NuevoProductoComponent } from 'src/app/modals/nuevo-producto/nuevo-producto.component';
import { EliminarProductoRequest, ProductosRequest } from 'src/app/core/models/Inventario/Producto';

@Component({
  selector: 'app-mis-inventarios',
  templateUrl: './mis-inventarios.component.html',
  styleUrls: ['./mis-inventarios.component.css']
})
export class MisInventariosComponent implements OnInit {
private modalService = inject(NgbModal);

  tipoPersona: string;
  tipoDocumento: string;
  NDocumento: string;
  Nombres: string;
  Ruc: string;
  tipoNombres: string;
  datosUsuarioLogin: DatosUsuarioLogin;
  listadoBandejaBase = [];
  listadoBandeja = [];
  BandejaSize = 1;
  page = 1;
  pageSize = 50;
  filtrarTexto: string = "";
  filtrarEstado: string = "ALL";
  request: ProductosRequest={
    idProducto: 0,
    nombre: '',
    material: '',
    color: '',
    talla: '',
    tipo: '',
    medida: '',
    marca: '',
    idUnidadMedida: 0,
    fechaVencimiento: undefined,
    stockInicial: 0,
    stockMinimo: 0
  };

  constructor(
    private seguridadService: SeguridadService,
    private inventarioService: InventarioService,
    //private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
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
    this.inventarioService.getAll().subscribe(
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
    localStorage.setItem("tramite-id", item.codMaeSolicitud);
    localStorage.setItem("tupa-id", item.codIdMaeTupa);
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
    localStorage.setItem("tramite-selected", JSON.stringify({ codigo: item.codMaeTupa }));
    this.globalService.setLastPage('mis-tramites');
    this.route.navigate(['tramite-iniciado'], { queryParams: params });

  }

  refreshCountries(pagination: PaginationModel) {
  }

  onChangeFilterByState() { }
  onChangeFilter(event: any) { }

  onAddEditProduct(item: any) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    };   

    const modalRef = this.modalService.open(NuevoProductoComponent, modalOptions);
    modalRef.componentInstance.title = "Nuevo producto";
    modalRef.componentInstance.id = item?.idProducto || 0;

    modalRef.result.then(
      (result) => {
        window.location.reload();
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  onDeleteProduct(item: any) {
    debugger;
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el producto? \n`)
      .then(() => {
        let request: EliminarProductoRequest = {
          id: item.idProducto
        }
        this.inventarioService.eliminarProducto(request).subscribe(
          (resp: any) => {
            this.funcionesMtcService.mensajeOk("Se eliminó el producto");
            this.cargarBandeja();
          },
          error => {
            this.funcionesMtcService.mensajeError('No se pudo eliminar el producto');
          }
        );
      });
  }
}

  // verExpedientePDF(item){
  //   //this.funcionesMtcService.mostrarCargando();
  //   console.log(item.docExpediente);
  //   this.visorPdfArchivosService.get(item.docExpediente)
  //     .subscribe(
  //       (file: Blob) => {
  //         this.funcionesMtcService.ocultarCargando();
  //         const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
  //         const urlPdf = URL.createObjectURL(file);
  //         modalRef.componentInstance.pdfUrl = urlPdf;
  //         modalRef.componentInstance.titleModal = "Vista Previa Expediente [ " + item.numSTD + " ]";
  //       },
  //       error => {
  //         this.funcionesMtcService
  //           .ocultarCargando()
  //           .mensajeError('Problemas para descargar Pdf');
  //       }
  //     );
  // }



  // anulaTramite(item){
  //   debugger;
  //   this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de Anular su expediente? \n`)
  //       .then(() => {
  //         console.log("Anular expediente: "+item.id);

  //         this.funcionesMtcService.mostrarCargando();
  //         this.TramiteService.putAnular({codMaeSolicitud: item.codMaeSolicitud})
  //         .subscribe(
  //           resp => {
  //             debugger;
  //             if(resp.data > 0){
  //               this.funcionesMtcService.mensajeOk("Se anuló el expediente "+item.numSTD);
  //             }else{
  //               this.funcionesMtcService.mensajeError("No se anuló el expediente");
  //             }
  //             this.modalService.dismissAll();
  //             this.cargarBandeja();
  //           },
  //           error => {
  //             this.funcionesMtcService.mensajeError("Ocurrio un problema al grabar URL");
  //           },
  //           () => this.funcionesMtcService.ocultarCargando()
  //         );

  //        });
  // }


  // irEncuesta(idEncuesta: number, codigoIdentificador: string){
  //   this.route.navigate(['encuesta/form', idEncuesta, codigoIdentificador]);
  // }


