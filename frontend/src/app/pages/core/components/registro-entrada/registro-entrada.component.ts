import { Component, OnInit } from '@angular/core';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IngresoService } from 'src/app/core/services/inventario/ingreso.service';
import { NuevoIngresoComponent } from 'src/app/modals/nuevo-ingreso/nuevo-ingreso.component';
import { EliminarIngresoRequest } from 'src/app/core/models/Inventario/Ingreso';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { VerProductoComponent } from 'src/app/modals/ver-producto/ver-producto.component';
@Component({
  selector: 'app-registro-entrada',
  templateUrl: './registro-entrada.component.html',
  styleUrls: ['./registro-entrada.component.css']
})
export class RegistroEntradaComponent implements OnInit {
  form: FormGroup;

  listadoBandejaBase = [];
  listadoBandeja = [];
  BandejaSize = 1;
  page = 1;
  pageSize = 10;

  constructor(
    private builder: FormBuilder,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private ingresoService: IngresoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.cargarBandeja();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      producto: [""],
      material: [""],
      color: [""],
      tipo: [""],
      marca: [""],
      talla: [""],
      fechaInicio: [""],
      fechaFin: [""],
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaInicio = control.get('fechaInicio')?.value;
    const fechaFin = control.get('fechaFin')?.value;

    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return { 'dateRangeInvalid': true };
    }
    return null;
  }

  cargarBandeja() {

    this.funcionesMtcService.mostrarCargando();
    this.ingresoService.getAll().subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
        this.listadoBandejaBase = resp.data;
        this.listadoBandeja = resp.data;
        this.BandejaSize = resp.data?.length;
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar el inventario');
        this.funcionesMtcService.ocultarCargando();
      }
    );
  }

  onAddRegister(item?: any) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    };

    const modalRef = this.modalService.open(NuevoIngresoComponent, modalOptions);
    modalRef.componentInstance.title = item ? "Editar Ingreso" : "Nuevo Ingreso";
    modalRef.componentInstance.id = item?.idEntrada || 0;

    modalRef.result.then(
      (result) => {
        this.cargarBandeja();
      },
      (reason) => {// Maneja la cancelación aquí
        this.cargarBandeja();
      });
  }

  onDelete(item?: any) {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el registro seleccionado? \n`)
      .then(() => {
        let request: EliminarIngresoRequest = {
          id: item.idEntrada
        }
        this.ingresoService.eliminarIngreso(request).subscribe(
          (resp: any) => {
            this.funcionesMtcService.mensajeOk("Se eliminó el registro seleccionado").then(() => this.cargarBandeja());

          },
          error => {
            this.funcionesMtcService.mensajeError('No se pudo eliminar el registro seleccionado');
          }
        );
      });
  }

  onSearch(form: FormGroup) {
    const { producto, material, color, talla, tipo, marca, fechaInicio, fechaFin } = form.value;

    this.listadoBandeja = this.listadoBandejaBase.filter(item => {
      const itemFecha = new Date(item.fecha).getUTCDate();
      const inicio = fechaInicio ? new Date(fechaInicio).getUTCDate() : null;
      const fin = fechaFin ? new Date(fechaFin).getUTCDate() : null;

      return (
        (!producto || item.nombre.toLowerCase().includes(producto.toLowerCase())) &&
        (!material || item.material.toLowerCase().includes(material.toLowerCase())) &&
        (!color || item.color.toLowerCase().includes(color.toLowerCase())) &&
        (!talla || item.talla.toLowerCase().includes(talla.toLowerCase())) &&
        (!tipo || item.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
        (!marca || item.marca.toLowerCase().includes(marca.toLowerCase())) &&
        (!inicio || itemFecha >= inicio) &&
        (!fin || itemFecha <= fin)
      );
    });

    // Resetear el campo registro y asignar nuevos valores
    this.listadoBandeja.forEach((item, index) => {
      item.registro = index + 1;
    });

    this.BandejaSize = this.listadoBandeja?.length;
  }

  onReset() {
    this.form.reset();
    this.listadoBandeja = this.listadoBandejaBase;
    this.listadoBandeja?.forEach((item, index) => {
      item.registro = index + 1;
    });
    this.BandejaSize = this.listadoBandeja?.length;
  }

  downloadExcel() {
    // Crear una nueva hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ["Municipalidad Distrital de Sayan"],
      ["Fecha del reporte: " + new Date().toLocaleDateString()],
      []
    ]);

    // Añadir los datos de la tabla
    const headers = ["Nro.", "Fecha de registro", "Producto",
      "Material", "Color", "Talla", "Tipo", "Medidas", "Marca", "Unidad de Medida", "Cantidad", "F. Vencimiento"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });

    this.listadoBandeja.forEach((item, index) => {
      const row = [
        item.registro,
        item.fecha,
        item.nombre,
        item.material,
        item.color,
        item.talla,
        item.tipo,
        item.medidas,
        item.marca,
        item.nombreUnidadMedida,
        item.cantidad,
        item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : ''
      ];
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 5}` });
    });

    // Ajustar el ancho de las columnas
    const wscols = [
      { wch: 10 }, // Nro.
      { wch: 20 }, // Producto
      { wch: 20 }, // Producto
      { wch: 20 }, // Material
      { wch: 20 }, // Color
      { wch: 10 }, // Talla
      { wch: 20 }, // Tipo
      { wch: 20 }, // Medidas
      { wch: 20 }, // Marca
      { wch: 20 }, // Unidad de Medida
      { wch: 10 }, // Cantidad
      { wch: 20 }, // F. Vencimiento
    ];
    ws['!cols'] = wscols;

    // Crear un nuevo libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RegistroIngreso');

    // Escribir el archivo
    XLSX.writeFile(wb, 'RegistroIngresoInventario.xlsx');
  }

  onViewInformation(item: any){
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    };

    const modalRef = this.modalService.open(VerProductoComponent, modalOptions);
    modalRef.componentInstance.title = "Visualizar detalle del producto";
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.tipoMovimiento = "Ingreso";
  }
}

