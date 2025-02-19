import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponenteExUnidadMinera, FormularioSolicitudDIA, Mineral } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Observable, catchError, map, of } from 'rxjs';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TipoMineral, RecursoExplorar } from 'src/app/core/models/Externos/Mineral';
import { percentageValidator } from 'src/app/helpers/validator';
import { SubTipoPasivoResponse, TipoPasivoResponse } from 'src/app/core/models/Externos/tipo-pasivo';
import { Zona } from 'src/app/core/models/Externos/Zona';
import { Datum } from 'src/app/core/models/Externos/Datum';
@Component({
  selector: 'app-pasivo-labores-infraestructura',
  templateUrl: './pasivo-labores-infraestructura.component.html',
  styleUrl: './pasivo-labores-infraestructura.component.scss'
})
export class PasivoLaboresInfraestructuraComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() id: number;
  @Input() edicion: ComponenteExUnidadMinera;

  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;

  listaTipoPasivo: TipoPasivoResponse[] = [];
  listaSubtipoPasivo: SubTipoPasivoResponse[] = [];
  listaZona: Zona[] = [];
  listaDatum: Datum[] = [];

  tipoDescripcion: string = '';
  subtipoDescripcion: string = '';
  zonaDescripcion: string = '';
  datumDescripcion: string = '';

  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadListas();
    this.buildForm();
    await this.getData();
    this.habilitarControles();
  }
  // async ngAfterViewInit(): Promise<void> {
  //   this.form.patchValue({ Datum: 2 });
  // }

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

  private buildForm(): void {
    this.form = this.builder.group({
      Id: [null, Validators.required],
      Nombre: [null, Validators.required],
      Tipo: ["", Validators.required],
      Subtipo: ["", Validators.required],
      Este: [null, Validators.required],
      Norte: [null, Validators.required],
      Zona: ["", Validators.required],
      Datum: [{ value: "2", disabled: true }, Validators.required]
    });
    this.subscribeToValueChanges();
  }

  private async subscribeToValueChanges(): Promise<void> {
    //this.form.get('Tipo')?.valueChanges.subscribe(async value => { this.updateTipoDescripcion(value); (await this.comboSubTipoPasivo(parseInt(value))).subscribe(response => this.listaSubtipoPasivo = response); });
    this.form.get('Tipo')?.valueChanges.subscribe(async value => {
      this.updateTipoDescripcion(value);
      (await this.comboSubTipoPasivo(parseInt(value))).subscribe(response => {
        this.listaSubtipoPasivo = response;
        this.form.controls['Subtipo'].setValue('');
        this.updateSubtipoValidators(response);
      });
    });
    this.form.get('Subtipo')?.valueChanges.subscribe(async value => { this.updateSubTipoDescripcion(value); });
    this.form.get('Zona')?.valueChanges.subscribe(async value => { this.updateZonaDescripcion(value); });
    this.form.get('Datum')?.valueChanges.subscribe(async value => { this.updateDatumDescripcion(); });
  }

  updateSubtipoValidators(subtipo: SubTipoPasivoResponse[]) {
    const subtipoControl = this.form.get('Subtipo');
  
    if (subtipo.length === 0)
      subtipoControl?.clearValidators();
    else 
      subtipoControl?.setValidators(Validators.required);    
  
    subtipoControl?.updateValueAndValidity();
  }

  private async getData(): Promise<void> {
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.tipoDescripcion = this.edicion.DescripcionTipo;
      this.subtipoDescripcion = this.edicion.DescripcionSubtipo;
      this.zonaDescripcion = this.edicion.DescripcionZona;
      this.datumDescripcion = this.edicion.DescripcionDatum;
      this.id = this.edicion.Id;
    }
    this.form.patchValue({ Id: this.id });
    //Seteo de Valores por default
    this.form.controls['Datum'].setValue(CONSTANTES.Datum);

  }

  private preSaveValidation(datos: ComponenteExUnidadMinera): string[] {
      const errores: string[] = [];
  
      if (datos.Nombre === null || datos.Nombre === undefined || datos.Nombre?.trim() === '') {
        errores.push('Se debe de ingresar el campo obligatorio: Nombre.');
      }
      if (datos.Tipo === null || datos.Tipo === undefined || datos.Tipo?.trim() === '') {
        errores.push('Se debe de ingresar el campo obligatorio: Tipo.');
      }
      if(this.listaSubtipoPasivo.length > 0 && (datos.Subtipo === null || datos.Subtipo === undefined || datos.Subtipo?.trim() === '')) {
      errores.push('Se debe de ingresar el campo obligatorio: Subtipo.');
      }
      if (parseInt(datos.Este) <= 0) {
        errores.push('Se debe de ingresar el campo obligatorio: Este.');
      }
      if (parseInt(datos.Norte) <= 0) {
        errores.push('Se debe de ingresar el campo obligatorio: Norte.');
      }
      if (datos.Zona === null || datos.Zona === undefined || datos.Zona?.trim() === '') {
        errores.push('Se debe de ingresar el campo obligatorio: Zona.');
      }
  
      return errores;
    }


  save(form: FormGroup) {
    const datos: ComponenteExUnidadMinera = {
      ...form.value,
      Id: this.id,
      DescripcionTipo: this.tipoDescripcion,
      DescripcionSubtipo: this.subtipoDescripcion,
      DescripcionZona: this.zonaDescripcion,
      DescripcionDatum: this.datumDescripcion === "" ?
        this.listaDatum.find(item => item.idDatum === parseInt(CONSTANTES.Datum)).descripcion :
        this.datumDescripcion
    };

    const errores = this.preSaveValidation(datos);

    if (errores.length > 0) {
      const mensajeHtml = `<ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>`;
      this.funcionesMtcService.mensajeHtml(mensajeHtml);
      return;
    }
    
    this.activeModal.close(datos);
  }

  updateTipoDescripcion(value: string) {
    const selectedTipo = this.listaTipoPasivo.find(item => item.idTipoPasivoAmbiental === parseInt(value));
    this.tipoDescripcion = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateSubTipoDescripcion(value: string) {
    const selectedTipo = this.listaSubtipoPasivo.find(item => item.idTipoIntegrante === parseInt(value));
    this.subtipoDescripcion = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateZonaDescripcion(value: string) {
    const selectedTipo = this.listaZona.find(item => item.idZona === parseInt(value));
    this.zonaDescripcion = selectedTipo ? selectedTipo.descripcion : '';
  }

  updateDatumDescripcion() {
    const selectedTipo = this.listaDatum.find(item => item.idDatum === parseInt(CONSTANTES.Datum));
    this.datumDescripcion = selectedTipo ? selectedTipo.descripcion : '';
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  private async loadListas() {
    (await this.comboTipoPasivo(2)).subscribe(async response => this.listaTipoPasivo = response);
    (await this.comboZona()).subscribe(async response => this.listaZona = response);
    (await this.comboDatum()).subscribe(async response => this.listaDatum = response);
  }

  private async comboTipoPasivo(tipoFormulario: number): Promise<Observable<TipoPasivoResponse[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getComboTipoPasivo(tipoFormulario).pipe(
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

  private async comboSubTipoPasivo(tipoPasivo: number): Promise<Observable<SubTipoPasivoResponse[]>> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboSubTipoPasivo(tipoPasivo).pipe(
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

  private async comboZona(): Promise<Observable<Zona[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getZona().pipe(
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

  private async comboDatum(): Promise<Observable<Datum[]>> {
    this.funcionesMtcService.mostrarCargando();
    return await this.externoService.getDatum().pipe(
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
