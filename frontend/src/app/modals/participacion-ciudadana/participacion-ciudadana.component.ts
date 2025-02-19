import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ComboGenericoString } from 'src/app/core/models/Maestros/ComboGenerico';
import { ArchivoAdjunto, Fechas, FormularioSolicitudDIA, Lugar, Mecanismos, ParticipacionCiudadana, Participantes } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'app-participacion-ciudadana',
  templateUrl: './participacion-ciudadana.component.html',
  styleUrl: './participacion-ciudadana.component.scss'
})
export class ParticipacionCiudadanaComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  formFecha: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() edicion: Mecanismos;
  @Input() id: number;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  optsRegion: IOption[] = [];
  optsProvincia: IOption[] = [{ label: "--Seleccione--", value: "0" }];
  optsDistrito: IOption[] = [{ label: "--Seleccione--", value: "0" }];
  optsLocalidad: IOption[] = [];
  optsHora: IOption[] = [];
  optsMinuto: IOption[] = [];
  hours: string[] = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  minutes: string[] = [ '00', '15', '30', '45'];
  listaLugar: Lugar[] = [];
  listaParticipantes: Participantes[] = [];
  listaFechas: Fechas[] = [];

  comboMecanismo: ComboGenericoString[];
  comboFase: ComboGenericoString[];
  comboRegion: ComboGenericoString[];
  comboProvincia: ComboGenericoString[];
  comboDistrito: ComboGenericoString[];
  comboLocalidad: ComboGenericoString[];

  documentos: ArchivoAdjunto[] = [];
  addFecha: boolean = false;

  //idEstudio: number;
  //#region PropiedadesTabla
  headerPlaces: TableColumn[] = [];
  headerParticipants: TableColumn[] = [];
  dateHeader: TableColumn[] = [];

  dataPlaces: TableRow[] = [];
  dataParticipants: TableRow[] = [];
  dateData: Fechas[] = [];
  errorMessages: { [key: string]: string } = {};
  //#endregion PropiedadesTabla
  constructor(private builder: FormBuilder,
    private externoService: ExternoService,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService
  ) { }

  ngOnInit(): void {
    //this.idEstudio = this.idEstudio;// Number(localStorage.getItem('estudio-id'));
    this.buildForm();
    this.loadTableHeaders();
    this.getData();
    this.loadCombos();
    this.habilitarControles();
  }

  private loadTableHeaders() {
    this.headerPlaces = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'REGION', field: 'Region', },
      { header: 'PROVINCIA', field: 'Provincia', },
      { header: 'DISTRITO', field: 'Distrito', },
      { header: 'LOCALIDAD', field: 'Localidad', },
      { header: 'LUGAR', field: 'Lugar', },
      { header: 'DIRECCIÓN', field: 'Direccion', },
      { header: 'GUARDAR', field: 'Guardar', hidden: this.modoVisualizacion },
      { header: 'CANCELAR', field: 'Cancelar', hidden: this.modoVisualizacion},
    ];
  
    this.headerParticipants = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'REGION', field: 'Region', },
      { header: 'PROVINCIA', field: 'Provincia', },
      { header: 'DISTRITO', field: 'Distrito', },
      { header: 'LOCALIDAD', field: 'Localidad', },
      { header: 'DESCRIPCIÓN', field: 'Descripcion', },
      { header: 'GUARDAR', field: 'Guardar', hidden: this.modoVisualizacion},
      { header: 'CANCELAR', field: 'Cancelar', hidden: this.modoVisualizacion },
    ];
  
    this.dateHeader = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'FECHA INICIO / HORA', field: 'FechaInicio', },
      { header: 'FECHA FIN / HORA', field: 'FechaFin', },
      { header: 'GUARDAR', field: 'Guardar', hidden: this.modoVisualizacion},
      { header: 'CANCELAR', field: 'Cancelar', hidden: this.modoVisualizacion },
    ];
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

  private loadCombos(): void {
    this.externoService.getComboMecanismoParticipacionCiudadana().subscribe(resp => {
      if (!resp.success)
        return;

      this.comboMecanismo = resp.data;

    });


    this.externoService.getComboRegionParticipacionCiudadana(this.idEstudio).subscribe(resp => {
      if (!resp.success)
        return;
      this.fnSelectRegion(resp.data);
    });

    this.externoService.getComboLocalidadParticipacionCiudadana().subscribe(resp => {
      if (!resp.success)
        return;
      this.fnSelectLocalidad(resp.data);
    });

    this.externoService.getComboHorasParticipacionCiudadana().subscribe(resp => {
      if (!resp.success)
        return;
      this.fnSelectHora(resp.data);
    });

    this.externoService.getComboMinutosParticipacionCiudadana().subscribe(resp => {
      if (!resp.success)
        return;
      this.fnSelectMinuto(resp.data);
    });
  }

  private buildForm(): void {
    this.form = this.builder.group({
      Mecanismos: ['',[Validators.required, this.selectValidator]],
      Secuencia: ['',[Validators.required, this.selectValidator]],
      Descripcion: ['', Validators.required],
      NroPersonas: ['', Validators.required]
    });
  
    this.formFecha = this.builder.group({
      FechaInicio: ['', Validators.required],
      HoraInicio: ['0',[Validators.required, this.selectValidator]],
      MinutoInicio:  ['0',[Validators.required, this.selectValidator]],
      FechaFin: ['', Validators.required],
      HoraFin:  ['0',[Validators.required, this.selectValidator]],
      MinutoFin:  ['0',[Validators.required, this.selectValidator]]
    });
  }
  
  get mecanismos() {
    return this.form.get('Mecanismos') as FormControl;
  } 
  
  get secuencia() {
    return this.form.get('Secuencia') as FormControl;
  }
 
  get descripcion() {
    return this.form.get('Descripcion') as FormControl;
  }

  get nroPersonas() {
    return this.form.get('NroPersonas') as FormControl;
  }
 
  get fechaInicio() {
    return this.formFecha.get('FechaInicio') as FormControl;
  }
  get horaInicio() {
    return this.formFecha.get('HoraInicio') as FormControl;
  }
 
  get minutoInicio() {
    return this.formFecha.get('MinutoInicio') as FormControl;
  }

  get fechaFin() {
    return this.formFecha.get('FechaFin') as FormControl;
  }
  get horaFin() {
    return this.formFecha.get('HoraFin') as FormControl;
  }

  get minutoFin() {
    return this.formFecha.get('MinutoFin') as FormControl;
  }

  private getData(): void {   
    if (this.edicion !== undefined) {
      this.form.patchValue(this.edicion);
      this.listaLugar = this.edicion?.Lugar || [];
      this.listaParticipantes = this.edicion?.Participantes || [];
      this.listaFechas = this.edicion?.Fechas || [];
      this.documentos = this.edicion?.Documentacion || [];
    }
    this.fnGridTablePlaces(this.listaLugar);
    this.fnGridTableParticipants(this.listaParticipantes);
  }

  save(form: FormGroup) {
    if (form.valid) {
      const datos: Mecanismos = form.value;
      datos.DescripcionMecanismo = this.comboMecanismo.find(x=>x.codigo === datos.Mecanismos).descripcion;
      datos.DescripcionSecuencia = this.comboFase.find(x=>x.codigo === datos.Secuencia).descripcion;
      datos.Documentacion = this.documentos;
      datos.Lugar = this.listaLugar;
      datos.Participantes = this.listaParticipantes;
      datos.Fechas = this.dateData;//this.listaFechas;
      datos.Id = this.id;
      this.activeModal.close(datos);
    }else {
      this.markAllFieldsAsTouchedFecha();
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
   private markAllFieldsAsTouchedFecha(): void {
    Object.keys(this.formFecha.controls).forEach(controlName => {
      const control = this.formFecha.get(controlName);
      if (control && !control.touched) {
        control.markAsTouched();
      }
    });
   }
  closeDialog() {
    this.activeModal.dismiss();
  }

  onChangeSecuenciaFase(idMecanismo: number) {
    this.externoService.getComboFaseParticipacionCiudadana(idMecanismo).subscribe(resp => {
      if (!resp.success)
        return;

      this.comboFase = resp.data;
    });
  }

  //dataPlaces: TableRow[] = [];

  fnActionInRow(data?: any): void {
    this.dataPlaces.push(this.createEditableRow(data));
  }

  fnActionInRowParticipants(data?: any): void {
    this.dataParticipants.push(this.createEditableRowParticipants(data));
  }

  private fnGridTablePlaces(data: Lugar[], idEditable?: number): void {
    const tableParameters: TableRow[] = data.map(parametro =>
      parametro.Id === idEditable ? this.createEditableRow(parametro) : this.createNonEditableRow(parametro)
    );
    this.dataPlaces = tableParameters;
  }

  private fnGridTableParticipants(data: Participantes[], idEditable?: number): void {
    const tableParameters: TableRow[] = data.map(parametro =>
      parametro.Id === idEditable ? this.createEditableRowParticipants(parametro) : this.createNonEditableRowParticipants(parametro)
    );
    this.dataParticipants = tableParameters;
  }

  private createEditableRow(data?: Lugar): TableRow {
    return {
      Id: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Id?.toString() || '0' },
      Region: { hasSelect: true, select: { options: this.optsRegion }, selectedValue: this.getSelectedValue(this.optsRegion, data?.DescripcionRegion), onChange: (newValue: string) => { this.fnChange(newValue, 'Region'); } },
      Provincia: { hasSelect: true, select: { options: this.optsProvincia }, selectedValue: this.getSelectedValue(this.optsProvincia, data?.DescricionProvincia), onChange: (newValue: string) => { this.fnChange(newValue, 'Provincia'); } },
      Distrito: { hasSelect: true, select: { options: this.optsDistrito }, selectedValue: this.getSelectedValue(this.optsDistrito, data?.DescripcionDistrito) },
      Localidad: { hasSelect: true, select: { options: this.optsLocalidad }, selectedValue: this.getSelectedValue(this.optsLocalidad, data?.DescripcionLocalidad) },
      Lugar: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Lugar || '' , inputType: 'text', inputMaxlength: 45},
      Direccion: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Direccion || '' , inputType: 'text', inputMaxlength: 45},
      Guardar: { buttonIcon: 'save', hasCursorPointer: true, onClick: (row: TableRow) => this.fnGuardarTable(row) },
      Cancelar: { buttonIcon: 'cancel', hasCursorPointer: true, onClick: () => this.fnCancelarTable() }
    };
  }

  fnChange(newValue: string, property: string) {
    switch (property) {
      case "Region":
        this.fnChangeProvincia(parseInt(newValue))
        break;
      case "Provincia":
        this.fnChangeDistrito(parseInt(newValue));
        break;
      default:
        break;
    }
  }

  private createEditableRowParticipants(data?: Participantes): TableRow {
    return {
      Id: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Id?.toString() || '0' },
      Region: { hasSelect: true, select: { options: this.optsRegion }, selectedValue: this.getSelectedValue(this.optsRegion, data?.DescripcionRegion), onChange: (newValue: string) => { this.fnChange(newValue, 'Region'); }  },
      Provincia: { hasSelect: true, select: { options: this.optsProvincia }, selectedValue: this.getSelectedValue(this.optsProvincia, data?.DescricionProvincia), onChange: (newValue: string) => { this.fnChange(newValue, 'Provincia'); }  },
      Distrito: { hasSelect: true, select: { options: this.optsDistrito }, selectedValue: this.getSelectedValue(this.optsDistrito, data?.DescripcionDistrito) },
      Localidad: { hasSelect: true, select: { options: this.optsLocalidad }, selectedValue: this.getSelectedValue(this.optsLocalidad, data?.DescripcionLocalidad) },
      Descripcion: { hasInput: true, inputPlaceholder: 'Ingrese...', value: data?.Descripcion || '' },
      Guardar: { buttonIcon: 'save', hasCursorPointer: true, onClick: (row: TableRow) => this.fnGuardarTableParticipants(row) },
      Cancelar: { buttonIcon: 'cancel', hasCursorPointer: true, onClick: () => this.fnCancelarTableParticipants() }
    };
  }

  private createNonEditableRow(data: Lugar): TableRow {
    return {
      Id: { text: data.Id.toString() },
      Region: { text: data.DescripcionRegion },
      Provincia: { text: data.DescricionProvincia },
      Distrito: { text: data.DescripcionDistrito },
      Localidad: { text: data.DescripcionLocalidad },
      Lugar: { text: data.Lugar },
      Direccion: { text: data.Direccion },
      Guardar: { buttonIcon: 'edit', hasCursorPointer: true, onClick: () => this.fnEditarTable(data.Id) },
      Cancelar: { buttonIcon: 'delete', hasCursorPointer: true, onClick: () => this.fnEliminarTable(data.Id) }
    };
  }

  private createNonEditableRowParticipants(data: Participantes): TableRow {
    return {
      Id: { text: data.Id.toString() },
      Region: { text: data.DescripcionRegion },
      Provincia: { text: data.DescricionProvincia },
      Distrito: { text: data.DescripcionDistrito },
      Localidad: { text: data.DescripcionLocalidad },
      Descripcion: { text: data.Descripcion },
      Guardar: { buttonIcon: 'edit', hasCursorPointer: true, onClick: () => this.fnEditarTableParticipants(data.Id) },
      Cancelar: { buttonIcon: 'delete', hasCursorPointer: true, onClick: () => this.fnEliminarTableParticipants(data.Id) }
    };
  }

  private getSelectedValue(options: IOption[], label: string): string {
    return options.find(x => x.label === label)?.value || '0';
  }

  private fnGuardarTable(row: TableRow): void {

    const requiredFields = ['Region', 'Provincia', 'Distrito', 'Localidad', 'Lugar', 'Direccion'];
  let isValid = true;

  for (const field of requiredFields) {
    if ((row[field].hasSelect && row[field].selectedValue === '0') || (row[field].hasInput && !row[field].value)) {
      row[field].htmlText = `${field} es obligatorio`;  
      isValid = false;
    } else {
      row[field].htmlText = '';
    }
  }

  if (!isValid) {
    return;
  }
    
    const id = parseInt(row.Id.value);
    const isNuevo = id === 0;
    const newId = isNuevo ? this.getNextId() : id;

    const fila: Lugar = {
      Id: newId,
      Lugar: row.Lugar.value,
      Direccion: row.Direccion.value,
      Region: row.Region.selectedValue,
      DescripcionRegion: this.getLabel(this.optsRegion, row.Region.selectedValue),
      Provincia: row.Provincia.selectedValue,
      DescricionProvincia: this.getLabel(this.optsProvincia, row.Provincia.selectedValue),
      Distrito: row.Distrito.selectedValue,
      DescripcionDistrito: this.getLabel(this.optsDistrito, row.Distrito.selectedValue),
      Localidad: row.Localidad.selectedValue,
      DescripcionLocalidad: this.getLabel(this.optsLocalidad, row.Localidad.selectedValue)
    };

    if (!isNuevo) {
      this.listaLugar = this.listaLugar.filter(x => x.Id !== id);
    }

    this.listaLugar.push(fila);
    this.listaLugar.sort((a, b) => a.Id - b.Id);
    this.fnGridTablePlaces(this.listaLugar);
  }

  private fnGuardarTableParticipants(row: TableRow): void {

    const requiredFieldsParticipantes = ['Region', 'Provincia', 'Distrito', 'Localidad', 'Descripcion'];
    let isValid = true;
  
    for (const field of requiredFieldsParticipantes) {
      if ((row[field].hasSelect && row[field].selectedValue === '0') || (row[field].hasInput && !row[field].value)) {
        row[field].htmlText = `${field} es obligatorio`;  
        isValid = false;
      } else {
        row[field].htmlText = '';
      }
    }
  
    if (!isValid) {
      return;
    }

    const id = parseInt(row.Id.value);
    const isNuevo = id === 0;
    const newId = isNuevo ? this.getNextIdParticipants() : id;

    const fila: Participantes = {
      Id: newId,
      Descripcion: row.Descripcion.value,
      Region: row.Region.selectedValue,
      DescripcionRegion: this.getLabel(this.optsRegion, row.Region.selectedValue),
      Provincia: row.Provincia.selectedValue,
      DescricionProvincia: this.getLabel(this.optsProvincia, row.Provincia.selectedValue),
      Distrito: row.Distrito.selectedValue,
      DescripcionDistrito: this.getLabel(this.optsDistrito, row.Distrito.selectedValue),
      Localidad: row.Localidad.selectedValue,
      DescripcionLocalidad: this.getLabel(this.optsLocalidad, row.Localidad.selectedValue)
    };

    if (!isNuevo) {
      this.listaParticipantes = this.listaParticipantes.filter(x => x.Id !== id);
    }

    this.listaParticipantes.push(fila);
    this.listaParticipantes.sort((a, b) => a.Id - b.Id);
    this.fnGridTableParticipants(this.listaParticipantes);
  }

  private getNextId(): number {
    return this.listaLugar.length === 0 ? 1 : Math.max(...this.listaLugar.map(l => l.Id)) + 1;
  }

  private getNextIdParticipants(): number {
    return this.listaParticipantes.length === 0 ? 1 : Math.max(...this.listaParticipantes.map(l => l.Id)) + 1;
  }

  private getLabel(options: IOption[], value: string): string {
    return options.find(x => x.value === value)?.label || '';
  }

  private fnCancelarTable(): void {
    this.fnGridTablePlaces(this.listaLugar);
  }

  private fnCancelarTableParticipants(): void {
    this.fnGridTableParticipants(this.listaParticipantes);
  }

  private fnEliminarTable(id: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?').then(() => {
      this.listaLugar = this.listaLugar.filter(x => x.Id !== id);
      this.fnGridTablePlaces(this.listaLugar);
    });
  }

  private fnEliminarTableParticipants(id: number): void {
    this.funcionesMtcService.mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?').then(() => {
      this.listaParticipantes = this.listaParticipantes.filter(x => x.Id !== id);
      this.fnGridTableParticipants(this.listaParticipantes);
    });
  }

  private fnEditarTable(id: number): void {
    this.fnGridTablePlaces(this.listaLugar, id);
  }

  private fnEditarTableParticipants(id: number): void {
    this.fnGridTableParticipants(this.listaParticipantes, id);
  }

  private fnSelectRegion(data: ComboGenericoString[]) {
    //data = [{ codigo: "1", descripcion: "desc 1" }, { codigo: "2", descripcion: "desc 2" }];
    const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]

    data.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsRegion = select;
  }

  private fnChangeProvincia(value: number) {
    // debugger;
    this.externoService.getComboProvinciaParticipacionCiudadana(this.idEstudio, value).subscribe(resp => {
      // if (!resp.success)
      //   return;

      this.fnSelectProvincia(resp.data);
    });
  }

  private fnChangeDistrito(value: number) {
    // debugger;
    this.externoService.getComboDistritoParticipacionCiudadana(this.idEstudio, value).subscribe(resp => {
      // if (!resp.success)
      //   return;

      this.fnSelectDistrito(resp.data);
    });
  }

  private fnSelectProvincia(data: ComboGenericoString[]) {
    //data = [{ codigo: "1.1", descripcion: "desc 1.1" }, { codigo: "2.1", descripcion: "desc 2.1" }];
    const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]

    data?.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsProvincia = select;
  }

  private fnSelectDistrito(data: ComboGenericoString[]) {
    //data= [{ codigo: "1", descripcion: "desc 1" }, { codigo: "2", descripcion: "desc 2" }];
    const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]

    data?.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsDistrito = select;
  }

  private fnSelectLocalidad(data: ComboGenericoString[]) {
    //data= [{ codigo: "1", descripcion: "desc 1" }, { codigo: "2", descripcion: "desc 2" }];
    const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]

    data.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsLocalidad = select;
  }

  private fnSelectHora(data: ComboGenericoString[]) {
    //data= [{ codigo: "1", descripcion: "desc 1" }, { codigo: "2", descripcion: "desc 2" }];
    //const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]
    const select: IOption[]=[];
    data.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsHora = select;
  }

  private fnSelectMinuto(data: ComboGenericoString[]) {
    //data= [{ codigo: "1", descripcion: "desc 1" }, { codigo: "2", descripcion: "desc 2" }];
    //const select: IOption[] = [{ label: "--Seleccione--", value: "0" }]
    const select: IOption[]=[];
    data.map(datos => {
      select.push({
        label: datos.descripcion,
        value: datos.codigo
      })
    });
    this.optsMinuto = select;
  }

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
      this.documentos = documentos;
    }

  fnActionInRowDates() {
    this.addFecha = true;
   this.buildFormFecha();
   this.resetFormularioFechas();
  }

  private buildFormFecha(): void { 
    this.formFecha.get('FechaInicio')?.setValidators([Validators.required]);    
    this.formFecha.get('HoraInicio')?.setValidators([Validators.required, this.selectValidator]);
    this.formFecha.get('MinutoInicio')?.setValidators([Validators.required, this.selectValidator]);
    this.formFecha.get('FechaFin')?.setValidators([Validators.required]);
    this.formFecha.get('HoraFin')?.setValidators([Validators.required, this.selectValidator]);
    this.formFecha.get('MinutoFin')?.setValidators([Validators.required, this.selectValidator]);
     
      this.formFecha.valueChanges.subscribe(() => {
       this.clearErrorMessages();
      });
   
  }
  clearErrorMessages() {
    this.errorMessages = {};
  }
  saveRowDate(data: Fechas) {
  
     if (this.formFecha.valid) {      
    
      const fechas: Fechas = { ...this.formFecha.value };   
 
      const fechaInicio = new Date(`${fechas.FechaInicio}T${fechas.HoraInicio}:${fechas.MinutoInicio}:00`);
      const fechaFin = new Date(`${fechas.FechaFin}T${fechas.HoraFin}:${fechas.MinutoFin}:00`);
   
      if (fechaInicio >= fechaFin) {
        this.funcionesMtcService.mensajeInfo('La fecha fin no puede ser menor a la fecha de inicio');
        return;
      }

      this.dateData.push({
        FechaInicio: fechas.FechaInicio,
        FechaFin: fechas.FechaFin,
        HoraFin: fechas.HoraFin,
        HoraInicio: fechas.HoraInicio,
        MinutoFin: fechas.MinutoFin,
        MinutoInicio: fechas.MinutoInicio,
        Id: 0
      });
      this.addFecha = false;
     
      //this.resetFormularioFechas();
      } else {
        this.markAllFieldsAsTouchedFecha();
      }  


   


  }   
   
  cancelRowDate(data: Fechas) {
    //debugger;
    this.addFecha = false;
  }
  

  soloNumeros(vent: KeyboardEvent, campo: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.form.get(campo)?.setValue(value);
  }
  
  resetFormularioFechas(){ 
    this.formFecha.reset({
      FechaInicio: '',
      HoraInicio: '0',
      MinutoInicio: '0',
      FechaFin: '',
      HoraFin: '0',
      MinutoFin: '0'
    });
  
    // Limpiar los mensajes de error
    this.clearErrorMessages(); 
  } 

  selectValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '' || control.value === '0' ? { invalidSelection: true } : null;
  }
}