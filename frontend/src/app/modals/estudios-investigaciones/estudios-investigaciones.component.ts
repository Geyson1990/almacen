import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map, Observable, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { Estudio, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-estudios-investigaciones',
  templateUrl: './estudios-investigaciones.component.html',
  styleUrl: './estudios-investigaciones.component.scss'
})
export class EstudiosInvestigacionesComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Estudio;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;

  listaTipoEstudio: ComboGenerico[] = [];
  initMonth: NgbDateStruct;
  descripcionTipoEstudio: string = '';

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  closeDialog() {
    this.activeModal.dismiss();
  }

  async ngOnInit(): Promise<void> {
    await this.buildForm();
    await this.loadCombos();
    await this.subscribeToValueChanges();
    await this.getData();
    this.habilitarControles();
  }

  //#region Validaciones
  get nroExpediente() {
    return this.form.get('NroExpediente') as FormControl;
  }
  get nroExpedienteErrors() {
    return (this.nroExpediente.touched || this.nroExpediente.dirty) && this.nroExpediente.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get tipoEstudio() {
    return this.form.get('TipoEstudio') as FormControl;
  }
  get tipoEstudioErrors() {
    return (this.tipoEstudio.touched || this.tipoEstudio.dirty) && this.tipoEstudio.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get proyecto() {
    return this.form.get('Proyecto') as FormControl;
  }
  get proyectoErrors() {
    return (this.proyecto.touched || this.proyecto.dirty) && this.proyecto.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get estado() {
    return this.form.get('Estado') as FormControl;
  }
  get estadoErrors() {
    return (this.estado.touched || this.estado.dirty) && this.estado.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get fechaEnvio() {
    return this.form.get('FechaEnvio') as FormControl;
  }
  get fechaEnvioErrors() {
    return (this.fechaEnvio.touched || this.fechaEnvio.dirty) && this.fechaEnvio.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get autoridadCompetente() {
    return this.form.get('AutoridadCompetente') as FormControl;
  }
  get autoridadCompetenteErrors() {
    return (this.autoridadCompetente.touched || this.autoridadCompetente.dirty) && this.autoridadCompetente.hasError('required') 
    ? 'Obligatorio' 
    : '';
  }

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.disable();
      });
    }
  }
  //#endregion Validaciones

  private async buildForm(): Promise<void> {
    this.form = this.builder.group({
      Id: [null, Validators.required],
      NroExpediente: [null, Validators.required],
      TipoEstudio: [{ value: "1", disabled: true }, Validators.required],
      Proyecto: [null, Validators.required],
      Estado: [null, Validators.required],
      FechaEnvio: [null, Validators.required],
      AutoridadCompetente: [null, Validators.required]
    });

  }

  private async subscribeToValueChanges(): Promise<void> {
    this.form.get('TipoEstudio')?.valueChanges.subscribe(value => this.updateDescripcion("1"));
  }

  private updateDescripcion(value: string) {
    const selectedTipo = this.listaTipoEstudio.find(item => item.codigo === parseInt(value));
    this.descripcionTipoEstudio = selectedTipo ? selectedTipo.descripcion : '';
  }

  private async getData(): Promise<void> {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.descripcionTipoEstudio = this.edicion.DescripcionTipoEstudio;
      this.id = this.edicion.Id;
    }
    this.form.patchValue({ Id: this.id });
    this.form.patchValue({ TipoEstudio: "1" });
    this.updateDescripcion("1");
    //this.form.controls['TipoEstudio'].enabled;
  }

  save(form: FormGroup) {    
    if (!form.valid) {
      this.funcionesMtcService.mensajeWarn('Complete los campos requeridos');
      return;
    }
    const datos: Estudio = {
      ...form.value,
      DescripcionTipoEstudio: this.listaTipoEstudio.find(item => item.codigo === 1).descripcion
    }

    this.activeModal.close(datos);
  }

  private async loadCombos(): Promise<void> {
    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoEstudio).subscribe(async response => this.listaTipoEstudio = response.filter(x => x.codigo === 1));
  }


  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenericoEiaw(tipo).pipe(
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

}
