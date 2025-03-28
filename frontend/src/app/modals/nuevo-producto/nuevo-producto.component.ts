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
  esEditable: boolean = false;

  constructor(private builder: FormBuilder,
    private inventarioService: InventarioService,
    private funcionesMtcService: FuncionesMtcService,
  ) { 
    debugger;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    //this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      nombre: ["", Validators.required],
      material: [""],
      color: [""],
      talla: [""],
      tipo: [""],
      medida: [""],
      marca: [""],
      idUnidadMedida: ["", Validators.required],
      fechaVencimiento: [""],
      stockInicial: [{ value: 0, disabled: this.id > 0 }, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, Validators.required],
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

  //#endregion

  private getData(): void {

    this.inventarioService.obtenerProducto(this.id).subscribe(
      (resp: any) => {
        this.funcionesMtcService.ocultarCargando();
        if(this.id > 0)this.esEditable = true;
        this.data = resp.data;
        this.form.patchValue({
          nombre: this.data.nombre,
          material: this.data.material,
          color: this.data.color,
          talla: this.data.talla,
          tipo: this.data.tipo,
          medida: this.data.medida,
          marca: this.data.marca,
          idUnidadMedida: this.data.idUnidadMedida,
          stockInicial: this.data.stockInicial,
          stockMinimo: this.data.stockMinimo,
          fechaVencimiento: this.data.fechaVencimiento ? new Date(this.data.fechaVencimiento).toISOString().substring(0, 10) : ''
        });
        if (this.data.fechaVencimiento) {
          const fecha = new Date(this.data.fechaVencimiento);
          this.data.fechaVencimiento = new Date(fecha.toISOString().substring(0, 10));
        }
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
      fechaVencimiento: this.form.get('fechaVencimiento').value === "" ? null : this.form.get('fechaVencimiento').value,
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
    this.activeModal.close();
    //window.location.reload();
  }

  private loadListas() {
    this.inventarioService.getUnidadesMedida().subscribe(response => {
      this.listaUnidadMedida = response.data;
    });
  }


  onChange(value: string): void {
    if (value) {
      // this.comboRecursoExplorar(value).subscribe(response => this.listaRecursoExplorar = response);
    }
  }

}
