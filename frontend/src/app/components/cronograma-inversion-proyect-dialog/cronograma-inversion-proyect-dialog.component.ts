import { Component, Input, OnInit, inject, Injectable} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { CronogramaInversion, FechaInversion, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10),
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        return date ? this.padNumber(date.day) + this.DELIMITER + this.padNumber(date.month) + this.DELIMITER + date.year : '';
    }

    private padNumber(value: number | null): string {
        if (!value) {
            return '';
        }
        return `0${value}`.slice(-2);
    }
}

@Component({
  selector: 'cronograma-inversion-proyect-dialog',
  templateUrl: './cronograma-inversion-proyect-dialog.component.html',
  providers: [
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },   ]
})
 

export class CronogramaInversionProyectDialogComponent implements OnInit{
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  data: FormularioSolicitudDIA;  
  
  initMonthConstruction: NgbDateStruct;
  endMonthConstruction: NgbDateStruct;
  initMonthExploration: NgbDateStruct;
  endMonthExploration: NgbDateStruct;
  initMonthClose: NgbDateStruct;
  endMonthClose: NgbDateStruct;
  initMonthPostClose: NgbDateStruct;
  endMonthPostClose: NgbDateStruct;
  estadoSolicitud: string;
  
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService 
  ) { }

  ngOnInit(): void {
    this.buildForm();
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
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }
  //#endregion ViewOnly

  private buildForm(): void{
    this.form = this.builder.group({
      FechaInicioConstruccion: [null, Validators.required],
      FechaFinConstruccion: [null, Validators.required],
      TotalMesConstruccion: [null, Validators.required],
      InversionConstruccion: [null, Validators.required],

      FechaInicioExploracion: [null, Validators.required],
      FechaFinExploracion: [null, Validators.required],
      TotalMesExploracion: [null, Validators.required],
      InversionExploracion: [null, Validators.required],

      FechaInicioCierre: [null, Validators.required],
      FechaFinCierre: [null, Validators.required],
      TotalMesCierre: [null, Validators.required],
      InversionCierre: [null, Validators.required],

      FechaInicioPostCierre: [null, Validators.required],
      FechaFinPostCierre: [null, Validators.required],
      TotalMesPostCierre: [null, Validators.required],
      InversionPostCierre: [null, Validators.required],
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    // this.form.patchValue(data.DescripcionProyecto.CronogramaInversion.Construccion);
    // this.form.patchValue(data.DescripcionProyecto.CronogramaInversion.Exploracion);
    // this.form.patchValue(data.DescripcionProyecto.CronogramaInversion.Cierre);
    // this.form.patchValue(data.DescripcionProyecto.CronogramaInversion.PostCierre);
    // this.form.patchValue(this.data.DescripcionProyecto.CronogramaInversion);
     this.form.controls['FechaInicioConstruccion'].setValue(data.DescripcionProyecto.CronogramaInversion.Construccion.FechaInicio);
     this.form.controls['FechaFinConstruccion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Construccion.FechaFin);
     this.form.controls['TotalMesConstruccion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Construccion.TotalMeses);
     this.form.controls['InversionConstruccion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Construccion.Inversion);
     this.form.controls['FechaInicioExploracion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Exploracion.FechaInicio);
     this.form.controls['FechaFinExploracion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Exploracion.FechaFin);
     this.form.controls['TotalMesExploracion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Exploracion.TotalMeses);
     this.form.controls['InversionExploracion'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Exploracion.Inversion);
     this.form.controls['FechaInicioCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Cierre.FechaInicio);
     this.form.controls['FechaFinCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Cierre.FechaFin);
     this.form.controls['TotalMesCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Cierre.TotalMeses);
     this.form.controls['InversionCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.Cierre.Inversion);
     this.form.controls['FechaInicioPostCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.PostCierre.FechaInicio);
     this.form.controls['FechaFinPostCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.PostCierre.FechaFin);
     this.form.controls['TotalMesPostCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.PostCierre.TotalMeses);
     this.form.controls['InversionPostCierre'].setValue(this.data.DescripcionProyecto.CronogramaInversion.PostCierre.Inversion);
  }  

  save(form:FormGroup){
     
    const datos = form.value;   
   // if (this.validateDates(datos)) {
      const construccion: FechaInversion={
        FechaInicio: datos.FechaInicioConstruccion,
        FechaFin: datos.FechaFinConstruccion,
        TotalMeses: datos.TotalMesConstruccion,
        Inversion: datos.InversionConstruccion
      };
      const exploracion: FechaInversion={
        FechaInicio: datos.FechaInicioExploracion,
        FechaFin: datos.FechaFinExploracion,
        TotalMeses: datos.TotalMesExploracion,
        Inversion: datos.InversionExploracion
      };
      const cierre: FechaInversion={
        FechaInicio: datos.FechaInicioCierre,
        FechaFin: datos.FechaFinCierre,
        TotalMeses: datos.TotalMesCierre,
        Inversion: datos.InversionCierre
      };
      const postCierre: FechaInversion={
        FechaInicio: datos.FechaInicioPostCierre,
        FechaFin: datos.FechaFinPostCierre,
        TotalMeses: datos.TotalMesPostCierre,
        Inversion: datos.InversionPostCierre
      };
      this.data.DescripcionProyecto.CronogramaInversion = {
        Construccion: construccion,
        Exploracion: exploracion,
        Cierre: cierre,
        PostCierre: postCierre,
        Save: true,
        State: 0,
        FechaRegistro: this.funcionesMtcService.dateNow()
      }
      this.data.DescripcionProyecto.CronogramaInversion.State = this.validarFormularioSolicitudDIA(this.data);
      this.GuardarJson(this.data);
   // }
    
  }

  validateDates(datos): boolean {
    const formValues = datos;
    
    const isValid = (startDate: NgbDateStruct, endDate: NgbDateStruct): boolean => {
      const start = new Date(startDate.year, startDate.month - 1, startDate.day);
      const end = new Date(endDate.year, endDate.month - 1, endDate.day);
      return end > start;
    };
  
    const isDateValid = (date: NgbDateStruct): boolean => {
      const { day, month, year } = date;
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;
    };
  
    const validateDateRange = (startDate: NgbDateStruct, endDate: NgbDateStruct, errorMessage: string): boolean => {
      if (startDate && endDate) {
        if (!isDateValid(startDate) || !isDateValid(endDate)) {
          this.funcionesMtcService.mensajeInfo('Debe ingresar fechas válidas en el formato dd/MM/yyyy.');
          return false;
        }
        if (!isValid(startDate, endDate)) {
          this.funcionesMtcService.mensajeInfo(errorMessage);
          return false;
        }
      } else if (startDate || endDate) {
        this.funcionesMtcService.mensajeInfo('Debe ingresar tanto la fecha de inicio como la fecha de fin.');
        return false;
      }
      return true;
    };
  
    if (!validateDateRange(formValues.FechaInicioConstruccion, formValues.FechaFinConstruccion, 'La fecha de fin de construcción debe ser mayor que la fecha de inicio de construcción.')) {
      return false;
    }
  
    if (!validateDateRange(formValues.FechaInicioExploracion, formValues.FechaFinExploracion, 'La fecha de fin de exploración debe ser mayor que la fecha de inicio de exploración.')) {
      return false;
    }
  
    if (!validateDateRange(formValues.FechaInicioCierre, formValues.FechaFinCierre, 'La fecha de fin de cierre debe ser mayor que la fecha de inicio de cierre.')) {
      return false;
    }
  
    if (!validateDateRange(formValues.FechaInicioPostCierre, formValues.FechaFinPostCierre, 'La fecha de fin de postcierre debe ser mayor que la fecha de inicio de postcierre.')) {
      return false;
    }
  
    return true;
  }

  validarCronogramaInversion(cronograma: CronogramaInversion): boolean {

  
    // Validar objetos anidados de tipo FechaInversion
    if (!cronograma.Construccion) {
      console.error("El campo Construccion no está inicializado.");
      return false;
    }
    if (!cronograma.Exploracion) {
      console.error("El campo Exploracion no está inicializado.");
      return false;
    }
    if (!cronograma.Cierre) {
      console.error("El campo Cierre no está inicializado.");
      return false;
    }
    if (!cronograma.PostCierre) {
      console.error("El campo PostCierre no está inicializado.");
      return false;
    }

    return true;
  }
  
  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.DescripcionProyecto.CronogramaInversion.Save) return 0;
    if (!this.validarCronogramaInversion(formulario.DescripcionProyecto.CronogramaInversion)) return 1;
    return 2;
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
  
  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  
  soloFecha(event) {
    event.target.value = event.target.value.replace(/[^0-9/]/g, '');
  }

  soloDecimales(event: any): void {
    const inputValue: string = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9.]/g, '')               // Eliminar caracteres no numéricos ni puntos
      .replace(/(\..*?)\..*/g, '$1')         // Permitir solo un punto decimal
      .replace(/(\.\d{2})\d+/g, '$1');       // Limitar a dos dígitos después del punto decimal
      
    event.target.value = formattedValue;
  }
  
  soloNumerosDecimales(event) {
  let input = event.target.value;

  // Permitir solo números y un punto decimal
  input = input.replace(/[^0-9.]/g, '');

  // Limitar a un solo punto decimal
  const parts = input.split('.');
  if (parts.length > 2) {
    input = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limitar la longitud de la parte entera a 10 dígitos si no hay punto decimal
  if (parts.length === 1 && parts[0].length > 10) {
    parts[0] = parts[0].substring(0, 10);
  }

  // Limitar la longitud de la parte entera a 7 dígitos si hay punto decimal
  if (parts.length === 2 && parts[0].length > 7) {
    parts[0] = parts[0].substring(0, 7);
  }

  // Limitar la parte decimal a 2 dígitos
  if (parts.length === 2) {
    parts[1] = parts[1].substring(0, 2);
  }

  // Si la longitud de la parte entera es 9, no permitir agregar el punto decimal
  if (parts.length === 1 && parts[0].length === 9) {
    input = parts[0];
  }

  // Reconstruir la entrada
  input = parts.join('.');

  event.target.value = input;
}
   
}
