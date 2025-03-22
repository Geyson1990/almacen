import { Component, inject, OnInit } from '@angular/core';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InventarioService } from '../../../../core/services/inventario/inventario.service';
import { NuevoProductoComponent } from 'src/app/modals/nuevo-producto/nuevo-producto.component';
import { EliminarProductoRequest, ProductosRequest } from 'src/app/core/models/Inventario/Producto';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-mis-inventarios',
  templateUrl: './mis-inventarios.component.html',
  styleUrls: ['./mis-inventarios.component.css']
})
export class MisInventariosComponent implements OnInit {
  private modalService = inject(NgbModal);
  form: FormGroup;

  page = 1;
  pageSize = 10;
  BandejaSize = 1;

  listadoBandejaBase = [];
  listadoBandeja = [];
  request: ProductosRequest = {
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
    private builder: FormBuilder,
    private inventarioService: InventarioService,
    private funcionesMtcService: FuncionesMtcService,
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
      talla: [""],
      tipo: [""],
      marca: [""],
      estadoStock: [""],
      estadoVencimiento: [""],
    });
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

  onAddEditProduct(item: any) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title'
    };

    const modalRef = this.modalService.open(NuevoProductoComponent, modalOptions);
    modalRef.componentInstance.title = item ? "Editar producto" : "Nuevo producto";
    modalRef.componentInstance.id = item?.idProducto || 0;

    modalRef.result.then(
      () => this.cargarBandeja(),
      () => this.cargarBandeja()
    );
  }

  onDeleteProduct(item: any) {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el producto? \n`)
      .then(() => {
        const request: EliminarProductoRequest = { id: item.idProducto };
        this.inventarioService.eliminarProducto(request).subscribe(
          () => {
            this.funcionesMtcService.mensajeOk("Se eliminó el producto");
            this.cargarBandeja();
          },
          () => this.funcionesMtcService.mensajeError('No se pudo eliminar el producto')
        );
      });
  }

  onSearch(form: FormGroup) {
    const { producto, material, color, talla, tipo, marca, estadoStock, estadoVencimiento } = form.value;

    this.listadoBandeja = this.listadoBandejaBase.filter(item => {
      return (
        (!producto || item.nombre.toLowerCase().includes(producto.toLowerCase())) &&
        (!material || item.material.toLowerCase().includes(material.toLowerCase())) &&
        (!color || item.color.toLowerCase().includes(color.toLowerCase())) &&
        (!talla || item.talla.toLowerCase().includes(talla.toLowerCase())) &&
        (!tipo || item.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
        (!marca || item.marca.toLowerCase().includes(marca.toLowerCase())) &&
        (!estadoStock || item.estadoStock == estadoStock) &&
        (!estadoVencimiento || item.estado == estadoVencimiento)
      );
    });

    // Resetear el campo registro y asignar nuevos valores
    this.listadoBandeja.forEach((item, index) => {
      item.registro = index + 1;
    });

    this.BandejaSize = this.listadoBandeja.length;
  }

  onReset() {
    this.form.reset();
    this.listadoBandeja = this.listadoBandejaBase;
    this.listadoBandeja.forEach((item, index) => {
      item.registro = index + 1;
    });
    this.BandejaSize = this.listadoBandeja.length;
    this.form.controls.estadoStock.setValue('');
    this.form.controls.estadoVencimiento.setValue('');
  }

  getEstadoDescripcion(estado: number): string {
    switch (estado) {
      case 0:
        return 'SIN REGISTRO';
      case 1:
        return 'ÓPTIMO';
      case 2:
        return 'POR VENCER';
      case 3:
        return 'VENCIDO';
      default:
        return '';
    }
  }

  downloadExcel() {
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listadoBandeja);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Inventarios');

    // XLSX.writeFile(wb, 'Inventarios.xlsx');
    // Crear una nueva hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ["Municipalidad Distrital de Sayan"],
      ["Fecha del reporte: " + new Date().toLocaleDateString()],
      []
    ]);

    // Añadir los datos de la tabla
    const headers = ["Nro.", "Producto", "Material", "Color", "Talla", "Tipo", "Medidas", "Marca", "Unidad de Medida", "Cantidad", "Estado de Stock", "F. Vencimiento", "Estado de Vencimiento"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });

    this.listadoBandeja.forEach((item, index) => {
      const row = [
        item.registro,
        item.nombre,
        item.material,
        item.color,
        item.talla,
        item.tipo,
        item.medidas,
        item.marca,
        item.nombreUnidadMedida,
        item.cantidad,
        item.estadoStock == 2 ? 'REABASTECER' : 'ABASTECIDO',
        item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : '',
        this.getEstadoDescripcion(item.estado)
      ];
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 5}` });
    });

    // Ajustar el ancho de las columnas
    const wscols = [
      { wch: 10 }, // Nro.
      { wch: 20 }, // Producto
      { wch: 20 }, // Material
      { wch: 20 }, // Color
      { wch: 10 }, // Talla
      { wch: 20 }, // Tipo
      { wch: 20 }, // Medidas
      { wch: 20 }, // Marca
      { wch: 20 }, // Unidad de Medida
      { wch: 10 }, // Cantidad
      { wch: 20 }, // Estado de Stock
      { wch: 20 }, // F. Vencimiento
      { wch: 20 }  // Estado de Vencimiento
    ];
    ws['!cols'] = wscols;

    // Crear un nuevo libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventarios');

    // Escribir el archivo
    XLSX.writeFile(wb, 'Inventarios.xlsx');
  }
}

