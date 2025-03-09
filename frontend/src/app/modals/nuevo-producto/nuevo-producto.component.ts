import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ProductosRequest, UnidadMedidaResponse } from 'src/app/core/models/Inventario/Producto';
import { InventarioService } from 'src/app/core/services/inventario/inventario.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.scss'
})
export class NuevoProductoComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;

  listaUnidadMedida: UnidadMedidaResponse[] = [];
  data: ProductosRequest;

  constructor(private builder: FormBuilder,
    private inventarioService: InventarioService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    //this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      nombre: ["", Validators.required],
      material: ["", Validators.required],
      color: ["", Validators.required],
      talla: ["", Validators.required],
      tipo: ["", Validators.required],
      medida: ["", Validators.required],
      marca: ["", Validators.required],
      idUnidadMedida: ["", Validators.required],
      fechaVencimiento: ["", Validators.required],
      stockInicial: [0, Validators.required],
      stockMinimo: [0, Validators.required],
    });
  }

  //#region Validaciones

  get tipo() {
    return this.form.get('tipo') as FormControl;
  }

  get tipoErrors() {
    return (this.tipo.touched || this.tipo.dirty) && this.tipo.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get nombre() {
    return this.form.get('nombre') as FormControl;
  }

  get nombreErrors() {
    return (this.nombre.touched || this.nombre.dirty) && this.nombre.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get material() {
    return this.form.get('material') as FormControl;
  }

  get materialErrors() {
    return (this.material.touched || this.material.dirty) && this.material.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get color() {
    return this.form.get('color') as FormControl;
  }

  get colorErrors() {
    return (this.color.touched || this.color.dirty) && this.color.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get talla() {
    return this.form.get('talla') as FormControl;
  }

  get tallaErrors() {
    return (this.talla.touched || this.talla.dirty) && this.talla.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get medida() {
    return this.form.get('medida') as FormControl;
  }

  get medidaErrors() {
    return (this.medida.touched || this.medida.dirty) && this.medida.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get marca() {
    return this.form.get('marca') as FormControl;
  }

  get marcaErrors() {
    return (this.marca.touched || this.marca.dirty) && this.marca.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get idUnidadMedida() {
    return this.form.get('idUnidadMedida') as FormControl;
  }

  get unidadMedidaErrors() {
    return (this.idUnidadMedida.touched || this.idUnidadMedida.dirty) && this.idUnidadMedida.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get stockInicial() {
    return this.form.get('stockInicial') as FormControl;
  }

  get stockInicialErrors() {
    return (this.stockInicial.touched || this.stockInicial.dirty) && this.stockInicial.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get stockMinimo() {
    return this.form.get('stockMinimo') as FormControl;
  }

  get stockMinimoErrors() {
    return (this.stockMinimo.touched || this.stockMinimo.dirty) && this.stockMinimo.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get fechaVencimiento() {
    return this.form.get('fechaVencimiento') as FormControl;
  }

  get fechaVencimientoErrors() {
    return (this.fechaVencimiento.touched || this.fechaVencimiento.dirty) && this.fechaVencimiento.hasError('required')
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

}
