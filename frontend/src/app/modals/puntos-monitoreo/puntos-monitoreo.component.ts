import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponseModel } from 'src/app/core/models/Autenticacion/TipoPersonaResponseModel';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, FormularioSolicitudDIA, ParametrosPlanVigilancia, PlanVigilanciaAmbiental, PuntosMonitoreo } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { ParametrosComponent } from '../parametros/parametros.component';
import { ParametroMonitoreo } from 'src/app/core/models/Externos/ParametroMonitoreo';
import { param } from 'jquery';

@Component({
  selector: 'app-puntos-monitoreo',
  templateUrl: './puntos-monitoreo.component.html',
  styleUrl: './puntos-monitoreo.component.scss'
})
export class PuntosMonitoreoComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  @Input() data: FormularioSolicitudDIA;
  @Input() edicion: PuntosMonitoreo;
  @Input() modoVisualizacion: boolean;
  listaTipoMuestra: ComboGenerico[] = [];
  listaClaseMonitoreo: ComboGenerico[] = [];
  listaZonaMuestreo: ComboGenerico[] = [];
  listaTipoProcedencia: ComboGenerico[] = [];

  documentos: ArchivoAdjunto[] = [];
  tipoMuestra: number;
  parametrosMonitoreo: ParametroMonitoreo[] = [];
  @Input() listaFrecuenciaMuestreo: ComboGenerico[] = [];
  @Input() listaFrecuenciaReporte: ComboGenerico[] = [];
  optsFrecuenciaMuestreo: IOption[] = [];
  optsFrecuenciaReporte: IOption[] = [];
  optsZona: IOption[] = [];
  optsDatum: IOption[] = [];

  //#region Grillas
  dataTablaParameters: TableRow[] = [];
  tableData272a: TableRow[] = [];

  headersParameters: TableColumn[] = [
    { header: 'CÓDIGO', field: 'Codigo', hidden: true },
    { header: 'PARÁMETROS', field: 'Parametro', },
    { header: 'FRECUENCIA DE MUESTREO', field: 'FrecuenciaMuestreo', },
    { header: 'FRECUENCIA DE REPORTE', field: 'FrecuenciaReporte', },
  ];

  tableColumns272a: TableColumn[] = [
    { header: 'ESTE', field: 'este', },
    { header: 'NORTE', field: 'norte', },
    { header: 'ZONA', field: 'zona', },
    { header: 'DATUM', field: 'datum' },
    { header: 'ALTITUD (M.S.N.M)', field: 'altitud', },
  ];
  //#endregion Grillas

  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCombos();
    this.selectValues();
    this.gridTableCoordenadas();
    this.getData();
    this.habilitarControles();
  }

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

  private buildForm(): void {
    this.form = this.builder.group({
      Codigo: [null, Validators.required],
      TipoMuestra: ["",[Validators.required, this.tipoMuestraValidator]],
      ClaseMonitoreo: ["",[Validators.required, this.claseMonitoreoValidator]],
      ZonaMuestreo: ["",[Validators.required, this.zonaMuestreoValidator]],
      TipoProcedencia: ["",[Validators.required, this.tipoProcedenciaValidator]],
      Descripcion: [null, Validators.required],
      Este: [null/*, Validators.required*/],
      Norte: [null/*, Validators.required*/],
      Zona: [null/*, Validators.required*/],
      Datum: [null/*, Validators.required*/],
      Altitud: [null/*, Validators.required*/],
    });
  }

  get codigo() {
    return this.form.get('Codigo') as FormControl;
  }

  get muestra() {
    return this.form.get('TipoMuestra') as FormControl;
  }

  tipoMuestraValidator(control: AbstractControl): ValidationErrors | null {
      return control.value === '' ? { invalidSelection: true } : null;
    }

  get claseMonitoreo() {
    return this.form.get('ClaseMonitoreo') as FormControl;
  }

  claseMonitoreoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get zonaMuestreo() {
    return this.form.get('ZonaMuestreo') as FormControl;
  }

  zonaMuestreoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get tipoProcedencia() {
    return this.form.get('TipoProcedencia') as FormControl;
  }

  tipoProcedenciaValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? { invalidSelection: true } : null;
  }

  get descripcion() {
    return this.form.get('Descripcion') as FormControl;
  }

  private getData(): void {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.documentos = this.edicion.documentos;
      this.gridTableParametros(this.edicion.ParametrosPlanVigilancia);
      this.gridTableCoordenadas(this.edicion);
    }
  }

  private gridTableParametros(data: any) {
    const tableParameters: TableRow[] = data.map(parametro => ({
      Codigo: { text: parametro.CodigoParametro.toString() },
      Parametro: { text: parametro.Parametro },
      FrecuenciaMuestreo: { hasSelect: true, select: { options: this.optsFrecuenciaMuestreo }, selectedValue: parametro.FrecuenciaMuestreo },
      FrecuenciaReporte: { hasSelect: true, select: { options: this.optsFrecuenciaReporte }, selectedValue: parametro.FrecuenciaReporte }
    }));

    this.dataTablaParameters = tableParameters;
  }

  private gridTableCoordenadas(data?: any) {
    this.tableData272a = [
      {
        este: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Este || '' , inputType: 'text', inputMaxlength: 10, onInput: (event: Event, row: any, column: any) => {this.soloNumeros(event, row, 'este'); },},
        norte: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Norte || '' , inputType: 'text', inputMaxlength: 10, onInput: (event: Event, row: any, column: any) => {this.soloNumeros(event, row, 'norte'); },},
        zona: { hasSelect: true, select: { options: this.optsZona }, selectedValue: data?.Zona || '0' },
        datum: { hasSelect: true, select: { options: this.optsDatum }, selectedValue: '2'},
        altitud: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Altitud || '' , inputType: 'text', inputMaxlength: 4, onInput: (event: Event, row: any, column: any) => {this.soloNumeros(event, row, 'altitud'); },}
      },
    ];
  }

  private loadCombos(): void {
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.TipoMuestra).subscribe(response => this.listaTipoMuestra = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.ClaseMonitoreo).subscribe(response => this.listaClaseMonitoreo = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.ZonaMuestreo).subscribe(response => this.listaZonaMuestreo = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.TipoProcedencia).subscribe(response => this.listaTipoProcedencia = response);
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaMonitoreo).subscribe(response => {
      this.optsFrecuenciaMuestreo = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
    });
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.FrecuenciaReporte).subscribe(response => {
      this.optsFrecuenciaReporte = response.map(param => ({ value: param.codigo.toString(), label: param.descripcion }));
    });
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.Zona).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsZona.push(...options);
    });
    this.comboGenerico(CONSTANTES.ComboGenericoFTAW.Datum).subscribe(response => {
      response.forEach(parametros => {
        const option: IOption = {
          value: parametros.codigo.toString(),
          label: parametros.descripcion
        };
        this.optsDatum.push(option);
      });
    });
    const optsMuestreo = this.listaFrecuenciaMuestreo.map(({ codigo, descripcion }) => ({
      value: codigo.toString(),
      label: descripcion
    }));
    this.optsFrecuenciaMuestreo.push(...optsMuestreo);

    const optsReporte = this.listaFrecuenciaReporte.map(({ codigo, descripcion }) => ({
      value: codigo.toString(),
      label: descripcion
    }));
    this.optsFrecuenciaReporte.push(...optsReporte);
  }

  private selectValues(): void {
    this.form.get('TipoMuestra').valueChanges.subscribe(value => this.tipoMuestra = value);
  }

  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenerico(tipo).pipe(
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

  private coordenadasFaltantes(): boolean {
    const coords = this.tableData272a[0];
    return !coords['este']?.value || !coords['norte']?.value || !coords['zona']?.selectedValue ||
      !coords['datum']?.selectedValue || !coords['altitud']?.value;
  }

  save(form: FormGroup) {

    if (form.valid) {
    if (this.coordenadasFaltantes()) {
      this.funcionesMtcService.mensajeInfo("Debe registrar las coordenadas UTM");
      return false;
    }

      const datos: PuntosMonitoreo = {
        ...form.value,
        Este: this.tableData272a[0]['este']?.value || '',
        Norte: this.tableData272a[0]['norte']?.value || '',
        Zona: this.tableData272a[0]['zona']?.selectedValue || '0',
        Datum: this.tableData272a[0]['datum']?.selectedValue || '0',
        Altitud: this.tableData272a[0]['altitud']?.value || '',
        ParametrosPlanVigilancia: this.dataTablaParameters.map(parametros => ({
          CodigoParametro: parametros.Codigo.text,
          FrecuenciaMuestreo: parametros.FrecuenciaMuestreo.selectedValue,
          FrecuenciaReporte: parametros.FrecuenciaReporte.selectedValue,
          Parametro: parametros.Parametro.text
        })),
        documentos: this.documentos
      };



      this.activeModal.close(datos);
    }else {
      this.markAllFieldsAsTouched();
    }

  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control && !control.touched) {
        control.markAsTouched();
      }
    });
   }

  closeDialog() {
    this.activeModal.dismiss();
  }

  openModalParametros(text) {
    if (!this.tipoMuestra) {
      this.funcionesMtcService.mensajeInfo("Debe seleccionar el tipo de muestra");
      return;
    }

    const modalOptions: NgbModalOptions = {
      size: 'xl',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ParametrosComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.tipoMuestra = this.tipoMuestra;
    modalRef.componentInstance.edicion = this.edicion?.ParametrosPlanVigilancia || [];
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {
        this.dataTablaParameters = result.row;
        this.parametrosMonitoreo = result.data;
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });

  };

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }

  soloNumeros(event: Event, row: any, columnField: string): void {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;
    newValue = newValue.replace(/[^0-9]/g, '');
    let numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) {
      numValue = 0;
    }
    row[columnField].value = numValue.toString();
    inputElement.value = numValue.toString();
  }
}
