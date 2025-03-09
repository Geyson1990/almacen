import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ProductosRequest, UnidadMedidaResponse } from 'src/app/core/models/Inventario/Producto';
import { InventarioService } from 'src/app/core/services/inventario/inventario.service';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrl: './nuevo-ingreso.component.scss'
})
export class NuevoIngresoComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;

  listaUnidadMedida: UnidadMedidaResponse[] = [];
  data: ProductosRequest;
  allProducts: any[] = [];
  filteredOptions: any[] = [];
  constructor(private builder: FormBuilder,
    private inventarioService: InventarioService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadAllProducts();
    this.loadListas();
    this.getData();
    
    //this.habilitarControles();
  }

  private loadAllProducts(): void {
    this.inventarioService.getAll().subscribe(response => {
      debugger;
      this.allProducts = response.data as any[];
    });
  }

  private buildForm(): void {
    this.form = this.builder.group({
      nombre: ["", Validators.required],
      //fecha: ["", Validators.required],
      cantidad: ["", Validators.required]
    });
  }

  //#region Validaciones

  // get fecha() {
  //   return this.form.get('fecha') as FormControl;
  // }

  // get fechaErrors() {
  //   return (this.fecha.touched || this.fecha.dirty) && this.fecha.hasError('required')
  //     ? 'Obligatorio'
  //     : '';
  // }

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

    this.inventarioService.obtenerProducto(this.id).subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
        this.data = resp.data;
        this.form.patchValue(this.data);

        setTimeout(() => {
          this.form.patchValue({ idUnidadMedida: this.data.idUnidadMedida });
        }, 1000);
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
debugger;
    const datos: ProductosRequest = {
      idProducto: this.id,
      nombre: this.form.get('nombre').value,
      material: this.form.get('material').value,
      color: this.form.get('color').value,
      talla: this.form.get('talla').value,
      tipo: this.form.get('tipo').value,
      medida: this.form.get('medida').value,
      marca: this.form.get('marca').value,
      idUnidadMedida: this.form.get('idUnidadMedida').value,
      fechaVencimiento: this.form.get('fechaVencimiento').value,
      stockInicial: this.form.get('stockInicial').value,
      stockMinimo: this.form.get('stockMinimo').value,
    }

    this.inventarioService.postGrabarProducto(datos).subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el producto').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el producto');
      },
      error => {
        this.funcionesMtcService.mensajeError('No se pudo cargar el inventario');
        this.funcionesMtcService.ocultarCargando();
      }
    );

  }




  closeDialog() {
    //this.activeModal.dismiss();
    window.location.reload();
  }

  private loadListas() {
    this.inventarioService.getUnidadesMedida().subscribe(response => {
      this.listaUnidadMedida = response.data;
      debugger;
    });
  }


  onChange(value: string): void {
    if (value) {
      // this.comboRecursoExplorar(value).subscribe(response => this.listaRecursoExplorar = response);
    }
  }

  onNombreInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredOptions = this.allProducts.filter(option => option.nombre.toLowerCase().includes(value));
  }

  onOptionSelected(option: any): void {
    this.form.get('nombre').setValue(option.nombre);
    this.filteredOptions = [];
  }

}
