import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ProductosRequest, UnidadMedidaResponse } from 'src/app/core/models/Inventario/Producto';
import { InventarioService } from 'src/app/core/services/inventario/inventario.service';
import { IngresoService } from 'src/app/core/services/inventario/ingreso.service';
import { IngresoRequest } from 'src/app/core/models/Inventario/Ingreso';
import { AreaSolicitanteResponse, SalidaRequest } from 'src/app/core/models/Inventario/Salida';
import { SalidaService } from 'src/app/core/services/inventario/salida.service';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.component.html',
  styleUrl: './nueva-salida.component.scss'
})
export class NuevaSalidaComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;

  listaAreasSolicitantes: AreaSolicitanteResponse[] = [];
  data: ProductosRequest;
  allProducts: any[] = [];
  filteredOptions: any[] = [];
  
  constructor(private builder: FormBuilder,
    private inventarioService: InventarioService,
    private funcionesMtcService: FuncionesMtcService,
    private salidaService: SalidaService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadAllProducts();
    this.loadListas();
    if(this.id > 0) this.getData();
    
  }

  private loadAllProducts(): void {
    this.inventarioService.getAll().subscribe(response => {
      this.allProducts = response.data as any[];
    });
  }

  private buildForm(): void {
    this.form = this.builder.group({
      nombre: ["", Validators.required],
      idProducto: [""],
      cantidad: ["", Validators.required],
      idAreaSolicitante: [""],
      personaSolicitante: [""],
    });
  }

  //#region Validaciones

  get nombre() {
    return this.form.get('nombre') as FormControl;
  }

  get nombreErrors() {
    return (this.nombre.touched || this.nombre.dirty) && this.nombre.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get cantidad() {
    return this.form.get('cantidad') as FormControl;
  }

  get cantidadErrors() {
    return (this.cantidad.touched || this.cantidad.dirty) && this.cantidad.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  //#endregion

  private getData(): void {

    this.salidaService.obtenerSalida(this.id).subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
        this.data = resp.data;
        this.form.patchValue(this.data);

        let option = {
          idProducto: this.data.idProducto,
          nombre: this.allProducts.find(x=>x.idProducto === this.data.idProducto)?.nombre
        }
        this.onOptionSelected(option);

      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar el inventario');
        this.funcionesMtcService.ocultarCargando();
      }
    );
  }

  save(form: FormGroup) {
    if (!form.valid) {
      this.funcionesMtcService.mensajeWarn('Complete los campos requeridos');
      return;
    }
    
    const datos: SalidaRequest = {
      idSalida: this.id,
      idProducto: this.form.get('idProducto').value,
      cantidad: this.form.get('cantidad').value,
      fecha: null,
      idAreaSolicitante: this.form.get('idAreaSolicitante').value,
      personaSolicitante: this.form.get('personaSolicitante').value,
    }

    this.salidaService.postGrabarSalida(datos).subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el registro').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el registro');
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar el registro');
        this.funcionesMtcService.ocultarCargando();
      }
    );

  }

  closeDialog() {
    this.activeModal.dismiss();
    //window.location.reload();
  }

  private loadListas() {
    this.salidaService.areasSolicitantes().subscribe(response => {
      this.listaAreasSolicitantes = response.data as AreaSolicitanteResponse[];
    });
  }

  onNombreInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredOptions = this.allProducts.filter(option => option.nombre.toLowerCase().includes(value));
  }

  onOptionSelected(option: any): void {
    this.form.get('nombre').setValue(option.nombre);
    this.form.get('idProducto').setValue(option.idProducto);
    this.filteredOptions = [];
  }

}
