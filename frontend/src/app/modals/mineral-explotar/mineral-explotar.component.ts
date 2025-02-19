import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioSolicitudDIA, Mineral } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Observable, catchError, map, of } from 'rxjs';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TipoMineral, RecursoExplorar } from 'src/app/core/models/Externos/Mineral';
import { percentageValidator } from 'src/app/helpers/validator';
@Component({
  selector: 'app-mineral-explotar',
  templateUrl: './mineral-explotar.component.html',
  styleUrl: './mineral-explotar.component.scss'
})
export class MineralExplotarComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Mineral;
  @Input() sumaPorcentaje: number;
  @Input() modoVisualizacion: boolean;
  @Input() lista: Mineral[];
  listaTipoMineral: TipoMineral[] = [];
  listaRecursoExplorar: RecursoExplorar[] = [];
  tipoDescripcion: string = '';
  recursoDescripcion: string = '';
  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Tipo: ["", Validators.required],
      Recurso: ["", Validators.required],
      Porcentaje: [null, Validators.required]
    });
    this.subscribeToValueChanges();
  }

   //#region ViewOnly
   get viewOnly() { return this.modoVisualizacion; }

   get viewControl() { return !this.modoVisualizacion; }
 
   habilitarControles() {
     if (this.viewOnly) {
       if(this.form !== undefined)
         Object.keys(this.form.controls).forEach(controlName => {
           const control = this.form.get(controlName);
           control?.disable();
         });
     }
   }
   //#endregion ViewOnly

  get tipo() {
    return this.form.get('Tipo') as FormControl;
  }

  get tipoErrors() {
    return (this.tipo.touched || this.tipo.dirty) && this.tipo.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get recurso() {
    return this.form.get('Recurso') as FormControl;
  }

  get recursoErrors() {
    return (this.recurso.touched || this.recurso.dirty) && this.recurso.hasError('required')
      ? 'Obligatorio'
      : '';
  }

  get porcentaje() {
    return this.form.get('Porcentaje') as FormControl;
  }

  get porcentajeErrors() {
    if (this.porcentaje.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  private subscribeToValueChanges(): void {
    this.form.get('Tipo')?.valueChanges.subscribe(value => {
      this.updateTipoDescripcion(value)
      this.onTipoMineralChange(value);
    });
    this.form.get('Recurso')?.valueChanges.subscribe(value => this.updateRecursoDescripcion(value));
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.tipoDescripcion = this.edicion.DescripcionTipo;
      this.recursoDescripcion = this.edicion.DescripcionRecurso;
      this.id = this.edicion.Id;

      setTimeout(() => {
        this.form.patchValue({Recurso: this.edicion.Recurso});
      }, 1000);
    }
  }

  save(form: FormGroup) {
    if (!form.valid) {
      this.funcionesMtcService.mensajeWarn('Complete los campos requeridos');
      return;
    }

    const datos: Mineral = {
      ...form.value,
      Id: this.id,
      DescripcionTipo: this.tipoDescripcion,
      DescripcionRecurso: this.recursoDescripcion
    };

    if(this.edicion === undefined){
      let tipo = this.lista.find(x => x.Tipo === datos.Tipo);
      let recurso = this.lista.find(x => x.Recurso === datos.Recurso);

      if(recurso !== undefined && tipo !== undefined){
        this.funcionesMtcService.ocultarCargando().mensajeError('El tipo de mineral ya se encuentra registrado');
        return;
      }
    }

    let porcentajeValido = this.fnValidarPorcentajeTotal(datos.Porcentaje);
    if (!porcentajeValido) {
      this.funcionesMtcService.ocultarCargando().mensajeError('La suma total del porcentaje no debe ser más de 100');
    } else {
      this.activeModal.close(datos);
    }   
  }

  fnValidarPorcentajeTotal(porcentaje: string): boolean {
    let value = parseFloat(porcentaje);
    let valorAcumulado = this.sumaPorcentaje;
    let suma = value + valorAcumulado;
    
    if (suma < 0) {
      return false;
    } else if (suma > 100) {
      return false;
    } else {
      return true;
    }

  }

  updateTipoDescripcion(value: string) {
    const selectedTipo = this.listaTipoMineral.find(item => item.claseSustancia === value);
    this.tipoDescripcion = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateRecursoDescripcion(value: string) {
    const selectedRecurso = this.listaRecursoExplorar.find(item => item.idProducto === parseInt(value));
    this.recursoDescripcion = selectedRecurso ? selectedRecurso.descripcion : '';
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private loadListas() {
    this.comboTipoMineral(9261).subscribe(response => this.listaTipoMineral = response);
  }

  private comboTipoMineral(tipo: number): Observable<TipoMineral[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboTipoMineral(tipo).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  private comboRecursoExplorar(tipoMineral: string): Observable<RecursoExplorar[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboRecursoExplorar(tipoMineral).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  onTipoMineralChange(value: string): void {
    if (value) {
      this.comboRecursoExplorar(value).subscribe(response => this.listaRecursoExplorar = response);
    }
  }

  onPercentageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }

    this.form.get('Porcentaje')?.setValue(value);
  }

  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
}
