import { Component, OnInit } from '@angular/core';
import { PaginationModel } from 'src/app/core/models/Pagination';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { GlobalService } from 'src/app/core/services/mapas/global.service';
import { InventarioService } from '../../../../core/services/inventario/inventario.service';
import { SalidaService } from 'src/app/core/services/inventario/salida.service';
import { NuevaSalidaComponent } from 'src/app/modals/nueva-salida/nueva-salida.component';
import { EliminarSalidaRequest } from 'src/app/core/models/Inventario/Salida';

@Component({
  selector: 'app-reporte-inventario',
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.css']
})
export class ReporteInventarioComponent implements OnInit {

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

  constructor(
    private seguridadService: SeguridadService,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private route: Router,
    private globalService: GlobalService,
    private salidaService: SalidaService
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
    this.salidaService.getAll().subscribe(
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

  refreshCountries(pagination: PaginationModel) {
  }

  onChangeFilterByState() { }

  onChangeFilter(event: any) { }

  onAddRegister(item?: any) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    };

    const modalRef = this.modalService.open(NuevaSalidaComponent, modalOptions);
    modalRef.componentInstance.title = item ? "Editar Salida" : "Nueva Salida";
    modalRef.componentInstance.id = item?.idSalida || 0;

    modalRef.result.then(
      (result) => {
        this.cargarBandeja();
      },
      (reason) => {// Maneja la cancelación aquí
        this.cargarBandeja();
      });
  }

  onDelete(item?:any){
    debugger;
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el registro seleccionado? \n`)
          .then(() => {
            let request: EliminarSalidaRequest = {
              id: item.idSalida
            }
            this.salidaService.eliminarSalida(request).subscribe(
              (resp: any) => {
                this.funcionesMtcService.mensajeOk("Se eliminó el registro seleccionado").then(()=>this.cargarBandeja());
                
              },
              error => {
                this.funcionesMtcService.mensajeError('No se pudo eliminar el registro seleccionado');
              }
            );
          });
  }
}

