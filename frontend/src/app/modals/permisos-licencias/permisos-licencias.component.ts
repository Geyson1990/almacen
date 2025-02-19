import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Estudio, Permiso } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-permisos-licencias',
  templateUrl: './permisos-licencias.component.html',
  styleUrl: './permisos-licencias.component.scss'
})
export class PermisosLicenciasComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: Permiso;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  initMonth: NgbDateStruct;
  flagClose: boolean = false;
  @ViewChild('cancelButton') cancelButton: ElementRef;
  
  constructor(private builder: FormBuilder,
    private funcionesMtcService: FuncionesMtcService) { }

  closeDialog(event: Event) { 
    
    debugger;    
    this.activeModal.dismiss();
  }
  handleCancelClick(event: Event) {
    this.removeAllTouched();
    this.closeDialog(event);
  }
  removeAllTouched() {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control) {
        control.markAsUntouched();
      }
    });
  }
  ngOnInit(): void {
    this.buildForm();
    //this.getData();
   // this.habilitarControles();
   
  }

  ngAfterViewInit(): void {
    
   // this.cancelButton.nativeElement.focus();
  }

  private resetFormState(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
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

  private buildForm(): void {
    this.form = this.builder.group({
      Id: [null],
      TipoEstudio: [null],
      Institucion: [null],
      Certificacion: [null],
      NroRD: [null],
      Fecha: [null],
      Plazo: [null],
    });
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.id = this.edicion.Id;
    }
    this.form.patchValue({ Id: this.id });
  }

  save() {
    this.addTipoEstudioValidation();
    /*
   if (!form.valid) {
     this.funcionesMtcService.mensajeWarn('Complete los campos requeridos');
     return;
   }
  */
    if (this.form.valid) {
      let datos: Permiso = this.form.value;
      this.activeModal.close(datos);
    } else {
      this.markAllFieldsAsTouched();
    }
    return false; 
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control && !control.touched) {
        control.markAsTouched();
      }
    });
  }

  //#region Validaciones
  
  addTipoEstudioValidation() {
    this.form.get('TipoEstudio').setValidators([Validators.required]);
    this.form.get('TipoEstudio').updateValueAndValidity();
  }
  
  get tipoEstudio() {
    return this.form.get('TipoEstudio') as FormControl;
  }
  get tipoEstudioErrors() {        
    return  (this.tipoEstudio.touched || this.tipoEstudio.dirty) && this.tipoEstudio.hasError('required')
      ? 'Tipo de Estudio es obligatorio'
      : '';
  }
/*
  get institucion() {
    return this.form.get('Institucion') as FormControl;
  }
  get institucionErrors() {
    return (this.institucion.touched || this.institucion.dirty) && this.institucion.hasError('required')
      ? 'Institucion es obligatorio'
      : '';
  }

  get certificacion() {
    return this.form.get('Certificacion') as FormControl;
  }
  get certificacionErrors() {
    return (this.certificacion.touched || this.certificacion.dirty) && this.certificacion.hasError('required')
      ? 'Certificacion es obligatorio'
      : '';
  }

  get nroRD() {
    return this.form.get('NroRD') as FormControl;
  }
  get nroRDErrors() {
    return (this.nroRD.touched || this.nroRD.dirty) && this.nroRD.hasError('required')
      ? 'Número RD es obligatorio'
      : '';
  }

  get fecha() {
    return this.form.get('Fecha') as FormControl;
  }
  get fechaErrors() {
    return (this.fecha.touched || this.fecha.dirty) && this.fecha.hasError('required')
      ? 'Fecha es obligatorio'
      : '';
  }

  get plazo() {
    return this.form.get('Plazo') as FormControl;
  }
  get plazoErrors() {
    return (this.plazo.touched || this.plazo.dirty) && this.plazo.hasError('required')
      ? 'Plazo es obligatorio'
      : '';
  }
  */
}
