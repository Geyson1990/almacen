import { Component, OnInit } from '@angular/core';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalidaService } from 'src/app/core/services/inventario/salida.service';
import { NuevaSalidaComponent } from 'src/app/modals/nueva-salida/nueva-salida.component';
import { AreaSolicitanteResponse, EliminarSalidaRequest } from 'src/app/core/models/Inventario/Salida';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-registro-salida',
  templateUrl: './registro-salida.component.html',
  styleUrls: ['./registro-salida.component.css']
})
export class RegistroSalidaComponent implements OnInit {
  form: FormGroup;

  listadoBandejaBase = [];
  listadoBandeja = [];
  listaAreasSolicitantes: AreaSolicitanteResponse[] = [];

  BandejaSize = 1;
  page = 1;
  pageSize = 50;

  constructor(
    private builder: FormBuilder,
    private modalService: NgbModal,
    private funcionesMtcService: FuncionesMtcService,
    private salidaService: SalidaService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.cargarBandeja();
    this.loadListas();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      producto: [""],
      idAreaSolicitante: [""],
      personaSolicitante: [""],
      marca: [""],
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

  private loadListas() {
    this.salidaService.areasSolicitantes().subscribe(response => {
      this.listaAreasSolicitantes = response.data as AreaSolicitanteResponse[];
    });
  }

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

  onDelete(item?: any) {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el registro seleccionado? \n`)
      .then(() => {
        let request: EliminarSalidaRequest = {
          id: item.idSalida
        }
        this.salidaService.eliminarSalida(request).subscribe(
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
    const { producto, idAreaSolicitante, personaSolicitante, marca, fechaInicio, fechaFin } = form.value;

    this.listadoBandeja = this.listadoBandejaBase.filter(item => {
      const itemFecha = new Date(item.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;

      return (
        (!producto || item.nombre.toLowerCase().includes(producto.toLowerCase())) &&
        (!idAreaSolicitante || item.idAreaSolicitante == idAreaSolicitante) &&
        (!personaSolicitante || item.personaSolicitante.toLowerCase().includes(personaSolicitante.toLowerCase())) &&
        (!marca || item.marca.toLowerCase().includes(marca.toLowerCase())) &&
        (!inicio || itemFecha >= inicio) &&
        (!fin || itemFecha <= fin)
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

  downloadExcel() {
    // Crear una nueva hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ["Municipalidad Distrital de Sayán"],
      ["Fecha del reporte: " + new Date().toLocaleDateString()],
      []
    ]);

    // Añadir los datos de la tabla
    const headers = ["Nro.", "Fecha de registro", "Producto", "Área solicitante", "Persona solicitante", "Material", "Color",
      "Talla", "Tipo", "Medidas", "Marca", "Unidad de Medida", "Cantidad"];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A4" });

    this.listadoBandeja.forEach((item, index) => {
      const row = [
        item.registro,
        item.fecha ? new Date(item.fecha).toLocaleDateString() : '',
        item.nombre,
        item.areaSolicitante,
        item.personaSolicitante,
        item.material,
        item.color,
        item.talla,
        item.tipo,
        item.medidas,
        item.marca,
        item.nombreUnidadMedida,
        item.cantidad
      ];
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${index + 5}` });
    });

    // Ajustar el ancho de las columnas
    const wscols = [
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];
    ws['!cols'] = wscols;

    // Crear un nuevo libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RegistroSalida');

    // Escribir el archivo
    XLSX.writeFile(wb, 'RegistroSalidaInventario.xlsx');
  }
}

