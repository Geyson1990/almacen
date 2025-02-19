import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { FormularioSolicitudDIA, TipoManoObra } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-tipo-mano-obra',
  templateUrl: './tipo-mano-obra.component.html',
  styleUrl: './tipo-mano-obra.component.scss'
})
export class TipoManoObraComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: TipoManoObra;
  @Input() modoVisualizacion: boolean;

  listaOrigen: ComboGenerico[] = [];
  descripcionOrigen: string = '';

  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadListas();
    this.getData();
    this.habilitarControles();
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

  private buildForm(): void{
    this.form = this.builder.group({
      NroPersonal: [null, Validators.required],
      Origen: ['', Validators.required],
      Especializacion: [null, Validators.required]
    });
    this.subscribeToValueChanges();
  }

  get nroPersonal() {
    return this.form.get('NroPersonal') as FormControl;
  }

  get nroPersonalErrors() {
    if (this.nroPersonal.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get origen() {
    return this.form.get('Origen') as FormControl;
  }

  get origenErrors() {
    if (this.origen.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }

  get especializacion() {
    return this.form.get('Especializacion') as FormControl;
  }

  get especializacionErrors() {
    if (this.especializacion.hasError('required')) {
      return 'Obligatorio';
    }   
    return '';
  }


  private subscribeToValueChanges(): void {
    this.form.get('Origen')?.valueChanges.subscribe(value => this.updateDescripcion(value));
  }

  updateDescripcion(value: string) {
    const selectedTipo = this.listaOrigen.find(item => item.codigo === parseInt(value));
    this.descripcionOrigen = selectedTipo ? selectedTipo.descripcion : '';
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionOrigen = this.edicion.DescripcionOrigen;
    }
  }

  save(form:FormGroup){
    if (form.valid) {
      const datos: TipoManoObra = {
        ...form.value,
        Id: this.id,
        DescripcionOrigen: this.descripcionOrigen
      };
      
      this.activeModal.close(datos);
    }
   
  }
  
  closeDialog() {
    this.activeModal.dismiss();
  }

  
  private loadListas() {
    this.comboOrigen().subscribe(response => this.listaOrigen = response);
  }

  private comboOrigen(): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboOrigenTipoManoObra().pipe(
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

 
  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
}
