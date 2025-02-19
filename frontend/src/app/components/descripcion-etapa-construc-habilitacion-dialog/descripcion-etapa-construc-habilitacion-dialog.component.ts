import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, ComponentePrincipal, ComponentesProyecto, DescripcionEtapas, Equipos, FormularioSolicitudDIA, FuenteAbastecimientoEnergia, Insumos, ManoObra, Maquinarias, Mineral, PlataformasPerforaciones, RequerimientoAgua, Residuos, TipoManoObra, ViasAccesoExistente, ViasAccesoNueva } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { ComponentesProyectoComponent } from 'src/app/modals/componentes-proyecto/componentes-proyecto.component';
import { DescripcionEtapaContruccionComponent } from 'src/app/modals/descripcion-etapa-contruccion/descripcion-etapa-contruccion.component';
import { EquiposModalComponent } from 'src/app/modals/equipos-modal/equipos-modal.component';
import { FuenteAbastecimientoComponent } from 'src/app/modals/fuente-abastecimiento/fuente-abastecimiento.component';
import { InsumosComponent } from 'src/app/modals/insumos/insumos.component';
import { MaquinariaModalComponent } from 'src/app/modals/maquinaria-modal/maquinaria-modal.component';
import { MineralExplotarComponent } from 'src/app/modals/mineral-explotar/mineral-explotar.component';
import { PlataformasPerforacionesComponent } from 'src/app/modals/plataformas-perforaciones/plataformas-perforaciones.component';
import { RequerimientoAguaComponent } from 'src/app/modals/requerimiento-agua/requerimiento-agua.component';
import { ResiduosComponent } from 'src/app/modals/residuos/residuos.component';
import { TipoManoObraComponent } from 'src/app/modals/tipo-mano-obra/tipo-mano-obra.component';
import { ViasAccesoExistentesComponent } from 'src/app/modals/vias-acceso-existentes/vias-acceso-existentes.component';
import { ViasAccesoNuevaComponent } from 'src/app/modals/vias-acceso-nueva/vias-acceso-nueva.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { Observable, catchError, map, of } from 'rxjs';
import { Zona } from 'src/app/core/models/Externos/Zona';
import { Datum } from 'src/app/core/models/Externos/Datum';
import { environment } from 'src/environments/environment';
import { FuenteAgua } from 'src/app/core/models/Externos/FuenteAgua';

@Component({
  selector: 'descripcion-etapa-construc-habilitacion-dialog',
  templateUrl: './descripcion-etapa-construc-habilitacion-dialog.component.html',
})
export class DescripcionEtapaConstrucHabilitacionDialog implements OnInit {
  form: FormGroup;
  selectedUnit: string = '';
  activeModal = inject(NgbActiveModal);
  openModal = inject(NgbModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;

  documentos: ArchivoAdjunto[] = [];
  mineralAExplorar: Mineral[] = [];
  plataformas: PlataformasPerforaciones[] = [];
  componentesProyecto: ComponentesProyecto[] = [];
  topSoil: ArchivoAdjunto[] = [];
  residuos: Residuos[] = [];
  requerimientoAgua: RequerimientoAgua[] = [];
  balanceAgua: ArchivoAdjunto[] = [];
  archivos: ArchivoAdjunto[] = [];
  instalaciones: ArchivoAdjunto[] = [];
  archivosMDS: ArchivoAdjunto[] = [];
  mapaComponentes: ArchivoAdjunto[] = [];
  insumos: Insumos[] = [];
  maquinarias: Maquinarias[] = [];
  equipos: Equipos[] = [];
  viasAccesoExistente: ViasAccesoExistente[] = [];
  viasAccesoNueva: ViasAccesoNueva[] = [];
  tipomanoObra: TipoManoObra[] = [];
  fuenteAbastecimientoEnergia: FuenteAbastecimientoEnergia[] = [];

  listaTipoMineral: ComboGenerico[] = [];
  listaZona: Zona[] = [];
  listaDatum: Datum[] = [];
  listaFuente: FuenteAgua[] = [];

  optsZona: IOption[] = [];
  optsDatum: IOption[] = [];

  optsTipoDocumento: IOption[] = [];
  showTipoDocumento: boolean = true;

  tableData274: TableRow[] = [];
  tableData2751: TableRow[] = [];
  tableData2771: TableRow[] = [];
  tableData2772: TableRow[] = [];
  tableData2773: TableRow[] = [];
  tableData2781: TableRow[] = [];
  tableData2782: TableRow[] = [];
  tableData279: TableRow[] = [];
  tableData2791: TableRow[] = [];
  tableData2710: TableRow[] = [];
  tableData271: TableRow[] = [];
  tableData272a: TableRow[] = [];
  tableData272b: TableRow[] = [];
  tableData2731: TableRow[] = [];
  tableData2732: TableRow[] = [
    {
      areaTotalDistribuir: { text: '0 Hectáreas' },
      totalMaterialRemover: { text: '0m3' },
      totalTopsoilRemover: { text: '0m3' },
    },
  ]

  tableColumns271: TableColumn[] = [];
  tableColumns272a: TableColumn[] = [];
  tableColumns272b: TableColumn[] = [];
  tableColumns2731: TableColumn[] = [];
  tableColumns2732: TableColumn[] = [];
  tableColumns274: TableColumn[] = [];
  tableColumns2751: TableColumn[] = [];
  tableColumns2771: TableColumn[] = [];
  tableColumns2772: TableColumn[] = [];
  tableColumns2773: TableColumn[] = [];
  tableColumns2781: TableColumn[] = [];
  tableColumns2782: TableColumn[] = [];
  tableColumns279: TableColumn[] = [];
  tableColumns2791: TableColumn[] = [];
  tableColumns2710: TableColumn[] = [];

  urlPlantilla: string = '';
  estadoSolicitud: string;
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService,
  ) {
    this.urlPlantilla = `${environment.endPoint.plantillas.Plataformas}`;
    this.form = this.builder.group({
      zona: [''],
      datum: ['']
    });
  }

  //#region ViewOnly
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if (this.form !== undefined)
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          control?.disable();
        });
    } else {
      if (!this.ver()) this.viewOnly;
    }
  }

  private loadTableHeaders() {
    // -------------271-----
    this.tableColumns271 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'ID_TIPO_MINERAL', field: 'Tipo', hidden: true },
      { header: 'TIPO DE MINERAL', field: 'DescripcionTipo', },
      { header: 'ID_RECURSO_EXPLORAR', field: 'Recurso', hidden: true },
      { header: 'RECURSO A EXPLORAR', field: 'DescripcionRecurso', },
      { header: 'PORCENTAJE (%)', field: 'Porcentaje', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------272a-----
    this.tableColumns272a = [
      { header: 'Nº PERFORACIONES', field: 'nroPerforaciones', },
      { header: 'Nº PLATAFORMAS', field: 'nroPlataforma', },
      { header: 'ZONA', field: 'zona', },
      { header: 'DATUM', field: 'datum' },
    ];
    // -------------272b-----
    this.tableColumns272b = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'NOMBRE', field: 'Plataforma', },
      { header: 'COORDENADA ESTE', field: 'Este', },
      { header: 'COORDENADA NORTE', field: 'Norte', },
      { header: 'COTA', field: 'Cota', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2731-----
    this.tableColumns2731 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'PRINCIPALES COMPONENTES', field: 'DescripcionPrincipal', },
      { header: 'LARGO (m)', field: 'Largo', },
      { header: 'ANCHO (m)', field: 'Ancho', },
      { header: 'PROFUNDIDAD PROMEDIO (m)', field: 'Profundidad', },
      { header: 'CANTIDAD', field: 'Cantidad', },
      { header: 'ÁREA (m2)', field: 'Area', },
      { header: 'VOLUMEN (m3)', field: 'Volumen', },
      { header: 'TOPSOIL A REMOVER (m3)', field: 'TopSoil', },
      { header: 'ACTIVIDADES A DESARROLLAR', field: 'Actividades', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2732-----
    this.tableColumns2732 = [
      { header: 'ÁREA TOTAL A DISTURBAR', field: 'areaTotalDistribuir', },
      { header: 'TOTAL MATERIAL A REMOVER', field: 'totalMaterialRemover', },
      { header: 'TOTAL TOPSOIL A REMOVER', field: 'totalTopsoilRemover', },
    ];
    // -------------274-----
    this.tableColumns274 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'CLASIFICACIÓN', field: 'Clasificacion' },
      { header: 'CÓDIGO DE RESIDUO', field: 'Residuos' },
      { header: 'FRECUENCIA', field: 'Frecuencia' },
      { header: 'VOLUMEN TOTAL', field: 'VolumenTotal' },
      { header: 'PESO TOTAL', field: 'PesoTotal' },
      { header: 'UNIDAD DE PESO', field: 'UnidadesPeso' },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2751-----
    this.tableColumns2751 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'FASE', field: 'Fase' },
      { header: 'ETAPA', field: 'Etapa' },
      { header: 'CANTIDAD (m3/dia)', field: 'Cantidad' },
      { header: 'Nº DÍAS', field: 'NroDias' },
      { header: 'TOTAL (m3)', field: 'Total' },
      { header: 'FUENTE DE ABASTECIMIENTO', field: 'FuenteAbastecimiento' },
      { header: 'ESTE', field: 'Este' },
      { header: 'NORTE', field: 'Norte' },
      { header: 'ZONA', field: 'Zona' },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2771-----
    this.tableColumns2771 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'INSUMOS', field: 'Insumos', },
      { header: 'CANTIDAD', field: 'Cantidad', },
      { header: 'UNIDAD DE MEDIDA', field: 'UnidadMedida', },
      { header: '	ALMACENAMIENTO', field: 'Almacenamiento', },
      { header: 'MANEJO', field: 'Manejo', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2772-----
    this.tableColumns2772 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'MAQUINARIAS', field: 'Maquinaria', },
      { header: 'ESPECIFICACIONES TÉCNICAS', field: 'Descripcion', },
      { header: 'CANTIDAD', field: 'Cantidad', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2773-----
    this.tableColumns2773 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'EQUIPO', field: 'Equipo', },
      { header: 'ESPECIFICACIONES TÉCNICAS', field: 'Descripcion', },
      { header: 'CANTIDAD', field: 'Cantidad', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion },
    ];
    // -------------2.7.8.1. VÍAS DE ACCESO EXISTENTES
    this.tableColumns2781 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'TIPO DE VIA', field: 'TipoVia', rowspan: 2, },
      { header: 'RUTA', field: 'ruta', colspan: 2, isParentCol: true, },
      { header: 'DE', field: 'RutaInicio', isChildCol: true },
      { header: 'A', field: 'RutaFin', isChildCol: true },
      { header: 'DISTANCIA (km)', field: 'Distancia', rowspan: 2, },
      { header: 'TIEMPO (hora)', field: 'Tiempo', rowspan: 2, },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion, rowspan: 2 },
    ];
    // -------------2.7.8.2. VÍAS DE ACCESO NUEVAS
    this.tableColumns2782 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'TIPO DE VIA', field: 'TipoVia', rowspan: 2, },
      { header: 'RUTA', field: 'ruta', colspan: 2, isParentCol: true, },
      { header: 'LARGO (m)', field: 'Largo', isChildCol: true },
      { header: 'ANCHO (m)', field: 'Ancho', isChildCol: true },
      { header: 'MATERIA', field: 'Material', rowspan: 2, },
      { header: 'EQUIPOS A UTILIZAR', field: 'Equipos', rowspan: 2, },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion, rowspan: 2 },
    ];
    // -------------2.7.9. MANO DE OBRA
    this.tableColumns279 = [
      { header: 'CONSTRUCCIÓN', field: 'construccion', },
      { header: '%', field: 'porcentaje1', },
      { header: 'EXPLORACIÓN', field: 'exploracion', },
      { header: '%', field: 'porcentaje2', },
      { header: 'CIERRE', field: 'cierre', },
      { header: '%', field: 'porcentaje3', },
      { header: 'TOTAL', field: 'total' },

    ];
    // -------------2.7.9.1. TIPO DE MANO DE OBRA
    this.tableColumns2791 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'CANTIDAD PERSONAL', field: 'NroPersonal', },
      { header: 'ORIGEN', field: 'Origen', },
      { header: 'ESPECIALIZACIÓN', field: 'Especializacion', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion, rowspan: 2 },
    ];
    // -------------2.7.10. FUENTE DE ABASTECIMIENTO DE ENERGÍA
    this.tableColumns2710 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'FUENTE DE ENERGÍA', field: 'FuenteEnergia', },
      { header: '	CARACTERISTICAS', field: 'Caracteristicas', },
      { header: 'EDITAR', field: 'edit', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'ELIMINAR', field: 'delete', hidden: this.modoVisualizacion, rowspan: 2 },
      { header: 'VER', field: 'view', hidden: !this.modoVisualizacion, rowspan: 2 },
    ];
  }
  //#endregion ViewOnly

  ngOnInit(): void {
    this.buildForm();
    this.loadTableHeaders();
    this.loadListas();
    this.getData();
    this.habilitarControles();
  }

  private buildForm(): void {
    this.form = this.builder.group({
      CierrePostCierre: [null, Validators.required],
    });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data);
      }
      this.funcionesMtcService.ocultarCargando();
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud;
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    //debugger;
    this.form.patchValue({ CierrePostCierre: data.DescripcionProyecto?.DescripcionEtapas?.CierrePostCierre });
    this.documentos = this.data.DescripcionProyecto?.DescripcionEtapas?.Documento || [];
    this.mineralAExplorar = this.data.DescripcionProyecto?.DescripcionEtapas?.MineralAExplotar || [];
    this.residuos = this.data.DescripcionProyecto?.DescripcionEtapas?.Residuos || [];
    this.requerimientoAgua = this.data.DescripcionProyecto?.DescripcionEtapas?.RequerimientoAgua || [];
    this.componentesProyecto = this.data.DescripcionProyecto?.DescripcionEtapas?.ComponentesProyecto || [];
    this.archivos = this.data.DescripcionProyecto?.DescripcionEtapas?.Archivos || [];
    this.archivosMDS = this.data.DescripcionProyecto?.DescripcionEtapas?.ArchivosMDS || [];
    this.balanceAgua = this.data.DescripcionProyecto?.DescripcionEtapas?.BalanceAgua || [];
    this.equipos = this.data.DescripcionProyecto?.DescripcionEtapas?.Equipos || [];
    this.maquinarias = this.data.DescripcionProyecto?.DescripcionEtapas?.Maquinarias || [];
    this.insumos = this.data.DescripcionProyecto?.DescripcionEtapas?.Insumos || [];
    this.mapaComponentes = this.data.DescripcionProyecto?.DescripcionEtapas?.MapaComponentes || [];
    this.instalaciones = this.data.DescripcionProyecto?.DescripcionEtapas?.Instalaciones || [];
    this.tipomanoObra = this.data.DescripcionProyecto?.DescripcionEtapas?.TipoManoObra || [];
    this.fuenteAbastecimientoEnergia = this.data.DescripcionProyecto?.DescripcionEtapas?.FuenteAbastecimientoEnergia || [];
    this.viasAccesoExistente = this.data.DescripcionProyecto?.DescripcionEtapas?.ViasAccesoExistente || [];
    this.viasAccesoNueva = this.data.DescripcionProyecto?.DescripcionEtapas?.ViasAccesoNueva || [];
    this.plataformas = this.data.DescripcionProyecto?.DescripcionEtapas?.ComponentesPrincipales?.PlataformasPerforaciones || [];
    this.topSoil = this.data.DescripcionProyecto?.DescripcionEtapas?.TopSoil || [];
    //***Mano de obra y comonente principal

    this.fnGridTableMineralAExplotar(this.mineralAExplorar);
    this.fnGridTableComponentePrincipal(this.plataformas);
    this.fnGridTableComponenteProyecto(this.componentesProyecto);
    this.fnGridTableResiduo(this.residuos);
    this.fnGridTableRequerimiento(this.requerimientoAgua);
    this.fnGridTableInsumo(this.insumos);
    this.fnGridTableMaquinaria(this.maquinarias);
    this.fnGridTableEquipos(this.equipos);
    this.fnGridTableViasAccesoExistentes(this.viasAccesoExistente);
    this.fnGridTableViasAccesoNueva(this.viasAccesoNueva);
    this.fnGridTableTipoManoObra(this.tipomanoObra);
    this.fnGridTableFuenteAbastecimiento(this.fuenteAbastecimientoEnergia);
    this.fnGridTablePrincipal(this.data?.DescripcionProyecto?.DescripcionEtapas?.ComponentesPrincipales);
    this.fnGridManoObra(this.data?.DescripcionProyecto?.DescripcionEtapas?.ManoObra);

  }

  private fnGridTablePrincipal(data?: ComponentePrincipal) {
    this.tableData272a = [
      {
        nroPerforaciones: { text: data?.NroPerforaciones || '0' },
        nroPlataforma: { text: data?.NroPlataformas || '0' },
        zona: { hasSelect: true, select: { options: this.optsZona }, selectedValue: this.data?.DescripcionProyecto?.DescripcionEtapas?.ComponentesPrincipales?.Zona || '' },
        datum: { hasSelect: true, select: { options: this.optsDatum, disabled: true }, selectedValue: '2' },
      },
    ]
  }

  private fnGridManoObra(data?: ManoObra) {
    this.tableData279 = [
      {
        construccion: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.Construccion || '', inputType: 'text', inputMaxlength: 5, onInput: (event: Event, row: any, column: any) => { this.soloNumeros(event, row, 'construccion'); }, },
        porcentaje1: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.PorcentajeConstruccion || '', inputType: 'text', inputMaxlength: 3, onInput: (event: Event, row: any, column: any) => { this.onPorcentajeInput(event, row, 'porcentaje1'); }, },
        exploracion: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.Exploracion || '', inputType: 'text', inputMaxlength: 5, onInput: (event: Event, row: any, column: any) => { this.soloNumeros(event, row, 'exploracion'); }, },
        porcentaje2: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.PorcentajeExploracion || '', inputType: 'text', inputMaxlength: 3, onInput: (event: Event, row: any, column: any) => { this.onPorcentajeInput(event, row, 'porcentaje2'); }, },
        cierre: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.Cierre || '', inputType: 'text', inputMaxlength: 5, onInput: (event: Event, row: any, column: any) => { this.soloNumeros(event, row, 'cierre'); }, },
        porcentaje3: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.PorcentajeCierre || '', inputType: 'text', inputMaxlength: 3, onInput: (event: Event, row: any, column: any) => { this.onPorcentajeInput(event, row, 'porcentaje3'); }, },
        total: { hasInput: true, inputPlaceholder: 'Ingresa ...', value: data?.Total || '', inputType: 'text', inputMaxlength: 5, onInput: (event: Event, row: any, column: any) => { this.soloNumeros(event, row, 'total'); }, },
      },
    ]
  }


  closeDialog() {
    this.activeModal.dismiss();
  };

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  agregarDocumentoTopSoil(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.topSoil.push(item);
  }

  agregarBalanceAgua(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.balanceAgua.push(item);
  }

  agregarArchivos(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.archivos.push(item);
  }

  agregarInstalaciones(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.instalaciones.push(item);
  }

  agregarArchivosMDS(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.archivosMDS.push(item);
  }

  agregarMapaComponentes(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.mapaComponentes.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }

  actualizarTopSoil(documentos: ArchivoAdjunto[]) {
    this.topSoil = documentos;
  }

  actualizarBalanceAgua(documentos: ArchivoAdjunto[]) {
    this.balanceAgua = documentos;
  }

  actualizarArchivos(documentos: ArchivoAdjunto[]) {
    this.archivos = documentos;
  }

  actualizarInstalaciones(documentos: ArchivoAdjunto[]) {
    this.instalaciones = documentos;
  }

  actualizarArchivosMDS(documentos: ArchivoAdjunto[]) {
    this.archivosMDS = documentos;
  }

  actualizarMapaComponentes(documentos: ArchivoAdjunto[]) {
    this.mapaComponentes = documentos;
  }

  save(form: FormGroup) {
    //debugger;

    this.data.DescripcionProyecto.DescripcionEtapas.Documento = this.documentos || [];
    this.data.DescripcionProyecto.DescripcionEtapas.MineralAExplotar = this.mineralAExplorar || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Residuos = this.residuos || [];
    this.data.DescripcionProyecto.DescripcionEtapas.RequerimientoAgua = this.requerimientoAgua || [];
    this.data.DescripcionProyecto.DescripcionEtapas.ComponentesProyecto = this.componentesProyecto || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Archivos = this.archivos || [];
    this.data.DescripcionProyecto.DescripcionEtapas.ArchivosMDS = this.archivosMDS || [];
    this.data.DescripcionProyecto.DescripcionEtapas.BalanceAgua = this.balanceAgua || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Equipos = this.equipos || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Maquinarias = this.maquinarias || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Insumos = this.insumos || [];
    this.data.DescripcionProyecto.DescripcionEtapas.MapaComponentes = this.mapaComponentes || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Instalaciones = this.instalaciones || [];
    this.data.DescripcionProyecto.DescripcionEtapas.TipoManoObra = this.tipomanoObra || [];
    this.data.DescripcionProyecto.DescripcionEtapas.FuenteAbastecimientoEnergia = this.fuenteAbastecimientoEnergia || [];
    this.data.DescripcionProyecto.DescripcionEtapas.ViasAccesoExistente = this.viasAccesoExistente || [];
    this.data.DescripcionProyecto.DescripcionEtapas.ViasAccesoNueva = this.viasAccesoNueva || [];
    this.data.DescripcionProyecto.DescripcionEtapas.Save = true;
    this.data.DescripcionProyecto.DescripcionEtapas.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.DescripcionProyecto.DescripcionEtapas.TopSoil = this.topSoil || [];
    const componentePrincipal: ComponentePrincipal = {
      NroPerforaciones: this.tableData272a[0].nroPerforaciones.text || '0',
      NroPlataformas: this.tableData272a[0].nroPlataforma.text || '0',
      Zona: this.tableData272a[0].zona.selectedValue || '',
      Datum: this.tableData272a[0].datum.selectedValue || '',
      PlataformasPerforaciones: this.plataformas || []
    };

    const manoObra: ManoObra = {
      Construccion: this.tableData279[0].construccion.value || '',
      PorcentajeConstruccion: this.tableData279[0].porcentaje1.value || '',
      Exploracion: this.tableData279[0].exploracion.value || '',
      PorcentajeExploracion: this.tableData279[0].porcentaje2.value || '',
      Cierre: this.tableData279[0].cierre.value || '',
      PorcentajeCierre: this.tableData279[0].porcentaje3.value || '',
      Total: this.tableData279[0].total.value || '',
    };

    this.data.DescripcionProyecto.DescripcionEtapas.ManoObra = manoObra;
    this.data.DescripcionProyecto.DescripcionEtapas.ComponentesPrincipales = componentePrincipal;
    this.data.DescripcionProyecto.DescripcionEtapas.CierrePostCierre = this.form.controls['CierrePostCierre'].value;
    this.data.DescripcionProyecto.DescripcionEtapas.State = this.validarFormularioSolicitudDIA(this.data);
    //this.activeModal.close(this.data);
    this.GuardarJson(this.data);
  }

  validateManoObra(manoObra: ManoObra): boolean {
    // Validar que los campos de construcción, exploración y cierre no estén vacíos
    if (!manoObra.Construccion.trim() || !manoObra.Exploracion.trim() || !manoObra.Cierre.trim()) {
      console.error("Los campos Construcción, Exploración y Cierre no pueden estar vacíos.");
      return false;
    }

    // Validar los porcentajes (deben ser números entre 0 y 100)
    const porcentajeConstruccion = parseFloat(manoObra.PorcentajeConstruccion);
    const porcentajeExploracion = parseFloat(manoObra.PorcentajeExploracion);
    const porcentajeCierre = parseFloat(manoObra.PorcentajeCierre);

    if (isNaN(porcentajeConstruccion) || porcentajeConstruccion < 0 || porcentajeConstruccion > 100) {
      console.error("Porcentaje de Construcción debe ser un número entre 0 y 100.");
      return false;
    }
    if (isNaN(porcentajeExploracion) || porcentajeExploracion < 0 || porcentajeExploracion > 100) {
      console.error("Porcentaje de Exploración debe ser un número entre 0 y 100.");
      return false;
    }
    if (isNaN(porcentajeCierre) || porcentajeCierre < 0 || porcentajeCierre > 100) {
      console.error("Porcentaje de Cierre debe ser un número entre 0 y 100.");
      return false;
    }

    // Validar el total (debe ser un número válido)
    const total = parseFloat(manoObra.Total);
    if (isNaN(total) || total <= 0) {
      console.error("El campo Total debe ser un número válido mayor que 0.");
      return false;
    }

    return true;
  }

  validarDescripcionEtapas(descripcionEtapas: DescripcionEtapas): boolean {
    // Validar campos básicos
    if (!descripcionEtapas.Documento || descripcionEtapas.Documento.length === 0) {
      console.error("El campo Documento está vacío.");
      return false;
    }
    if (!descripcionEtapas.BalanceAgua || descripcionEtapas.BalanceAgua.length === 0) {
      console.error("El campo BalanceAgua está vacío.");
      return false;
    }
    if (!descripcionEtapas.CierrePostCierre || descripcionEtapas.CierrePostCierre.trim() === "") {
      console.error("El campo CierrePostCierre está vacío.");
      return false;
    }

    // Validar objetos complejos

    if (!descripcionEtapas.MineralAExplotar || descripcionEtapas.MineralAExplotar.length === 0) {
      return false;
    }

    if (!descripcionEtapas.Residuos || descripcionEtapas.Residuos.length === 0) {
      return false;
    }

    if (!descripcionEtapas.RequerimientoAgua || descripcionEtapas.RequerimientoAgua.length === 0) {
      return false;
    }

    if (!descripcionEtapas.ComponentesProyecto || descripcionEtapas.ComponentesProyecto.length === 0) {
      return false;
    }

    if (!descripcionEtapas.BalanceAgua || descripcionEtapas.BalanceAgua.length === 0) {
      return false;
    }
    if (!descripcionEtapas.Archivos || descripcionEtapas.Archivos.length === 0) {
      return false;
    }
    if (!descripcionEtapas.Instalaciones || descripcionEtapas.Instalaciones.length === 0) {
      return false;
    }
    if (!descripcionEtapas.ArchivosMDS || descripcionEtapas.ArchivosMDS.length === 0) {
      return false;
    }
    if (!descripcionEtapas.MapaComponentes || descripcionEtapas.MapaComponentes.length === 0) {
      return false;
    }
    if (!descripcionEtapas.Insumos || descripcionEtapas.Insumos.length === 0) {
      return false;
    }
    if (!descripcionEtapas.Maquinarias || descripcionEtapas.Maquinarias.length === 0) {
      return false;
    }
    if (!descripcionEtapas.Equipos || descripcionEtapas.Equipos.length === 0) {
      return false;
    }
    if (!descripcionEtapas.ViasAccesoExistente || descripcionEtapas.ViasAccesoExistente.length === 0) {
      return false;
    }
    if (!descripcionEtapas.ViasAccesoNueva || descripcionEtapas.ViasAccesoNueva.length === 0) {
      return false;
    }
    if (!descripcionEtapas.TipoManoObra || descripcionEtapas.TipoManoObra.length === 0) {
      return false;
    }
    if (!descripcionEtapas.FuenteAbastecimientoEnergia || descripcionEtapas.FuenteAbastecimientoEnergia.length === 0) {
      return false;
    }

    if (!this.validateComponentePrincipal(descripcionEtapas.ComponentesPrincipales)) return false;

    if (!this.validateManoObra(descripcionEtapas.ManoObra)) return false;


    return true;
  }

  validateComponentePrincipal(componente: ComponentePrincipal): boolean {
    // Validar NroPerforaciones y NroPlataformas (deben ser números válidos)
    if (isNaN(Number(componente.NroPerforaciones)) || isNaN(Number(componente.NroPlataformas))) {
      console.error("NroPerforaciones y NroPlataformas deben ser números válidos.");
      return false;
    }

    // Validar que Zona y Datum no estén vacíos
    if (!componente.Zona.trim() || !componente.Datum.trim()) {
      console.error("Zona y Datum no pueden estar vacíos.");
      return false;
    }

    // Validar PlataformasPerforaciones (debe ser un array con al menos un objeto)
    if (!Array.isArray(componente.PlataformasPerforaciones) || componente.PlataformasPerforaciones.length === 0) {
      console.error("PlataformasPerforaciones debe ser un arreglo con al menos un elemento.");
      return false;
    }

    // Validar cada objeto en PlataformasPerforaciones
    for (const plataforma of componente.PlataformasPerforaciones) {
      if (typeof plataforma.Id !== "number" || !plataforma.Plataforma.trim() || !plataforma.Este.trim()) {
        console.error("Cada plataforma debe tener un Id numérico y los campos Plataforma y Este no pueden estar vacíos.");
        return false;
      }
    }

    return true;
  }


  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if (!this.data.DescripcionProyecto.DescripcionEtapas.Save) return 0;
    if (!this.validarDescripcionEtapas(formulario.DescripcionProyecto.DescripcionEtapas)) return 1;
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

  //#region Modal Mineral a Explotar
  openModalMineralAExplotar(text, row?: TableRow) {
    //if(this.data.DescripcionProyecto.Delimitacion.AreasActividadMinera.length === 0){
    //  this.funcionesMtcService.mensajeError("No existen registros en la sección: 2.4.1 Áreas superficiales en actividad minera.");
    //  return;
    //}
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(MineralExplotarComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.mineralAExplorar.length === 0 ? 1 : (this.mineralAExplorar.reduce((max, mineral) => mineral.Id > max ? mineral.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.mineralAExplorar.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.lista = this.data.DescripcionProyecto.DescripcionEtapas.MineralAExplotar;
    let mineralAExplorarTemp: Mineral[] = [];
    if (row != undefined) {
      mineralAExplorarTemp = this.mineralAExplorar.filter(item => item.Id !== parseInt(row.Id.text));
    }
    else
      mineralAExplorarTemp = this.mineralAExplorar;

    modalRef.componentInstance.sumaPorcentaje = this.mineralAExplorar.length === 0 ? 0 : this.getTotalPorcentaje(mineralAExplorarTemp);
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        debugger;
        if (row) {
          this.mineralAExplorar = this.mineralAExplorar.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.mineralAExplorar.push(result);
        this.fnGridTableMineralAExplotar(this.mineralAExplorar);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  private getTotalPorcentaje(minerales: Mineral[]): number {

    return minerales.reduce((sum, mineral) => {
      const porcentaje = parseFloat(mineral.Porcentaje);
      return sum + (isNaN(porcentaje) ? 0 : porcentaje);
    }, 0);
  }

  fnGridTableMineralAExplotar(data: Mineral[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Tipo: { text: datos.Tipo },
        DescripcionTipo: { text: datos.DescripcionTipo },
        Recurso: { text: datos.Recurso },
        DescripcionRecurso: { text: datos.DescripcionRecurso },
        Porcentaje: { text: datos.Porcentaje },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMineral(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarMineral(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMineral(row) }

      }
    });

    this.tableData271 = tabla;
  }

  fnEditarMineral(row?: TableRow) {
    this.openModalMineralAExplotar('MINERAL A EXPLOTAR', row);
  }

  fnEliminarMineral(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.mineralAExplorar = this.mineralAExplorar.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableMineralAExplotar(this.mineralAExplorar);
      });
  }
  //#endregion Modal Mineral a Explotar

  //#region Modal Componente Principal
  openModalComponentesPrincipales(text, row?: TableRow) {
    
    if (!this.tableData272a[0].zona.selectedValue) {
      this.funcionesMtcService.mensajeInfo('Debe seleccionar la Zona');
      return;
    }
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(PlataformasPerforacionesComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.plataformas.length === 0 ? 1 : (this.plataformas.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.plataformas.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.plataformas = this.plataformas.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.plataformas.push(result);
        this.fnGridTableComponentePrincipal(this.plataformas);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTableComponentePrincipal(data: PlataformasPerforaciones[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Plataforma: { text: datos.Plataforma },
        Este: { text: datos.Este },
        Norte: { text: datos.Norte },
        Cota: { text: datos.Cota },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponentePrincipal(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarComponentePrincipal(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponentePrincipal(row) }
      }
    });

    this.tableData272b = tabla;
  }

  fnEditarComponentePrincipal(row?: TableRow) {
    this.openModalComponentesPrincipales('COMPONENTES PRINCIPALES', row);
  }

  fnEliminarComponentePrincipal(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.plataformas = this.plataformas.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableComponentePrincipal(this.plataformas);
      });
  }

  //#endregion Modal Componente Principal

  //#region Modal Componente Proyecto
  openModalComponentesProyecto(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ComponentesProyectoComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.componentesProyecto.length === 0 ? 1 : (this.componentesProyecto.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.componentesProyecto.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.componentesProyecto = this.componentesProyecto.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.componentesProyecto.push(result);
        this.fnGridTableComponenteProyecto(this.componentesProyecto);
        this.updateTopsoilSum();
        this.updateVolumenSum();
        this.updateAreaSum();
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTableComponenteProyecto(data: ComponentesProyecto[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        DescripcionPrincipal: { text: datos.DescripcionPrincipal },
        Largo: { text: datos.Largo },
        Ancho: { text: datos.Ancho },
        Profundidad: { text: datos.Profundidad },
        Cantidad: { text: datos.Cantidad },
        Area: { text: datos.Area },
        Volumen: { text: datos.Volumen },
        TopSoil: { text: datos.TopSoil },
        Actividades: { text: datos.Actividades },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteProyecto(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarComponenteProyecto(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteProyecto(row) },
      }
    });

    this.tableData2731 = tabla;
    this.updateTopsoilSum();
    this.updateVolumenSum();
    this.updateAreaSum();
  }

  fnEditarComponenteProyecto(row?: TableRow) {
    this.openModalComponentesProyecto('COMPONENTE DEL PROYECTO', row);
  }

  fnEliminarComponenteProyecto(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.componentesProyecto = this.componentesProyecto.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableComponenteProyecto(this.componentesProyecto);
      });
  }
  //#endregion Modal Componente Proyecto

  //#region Modal Residuo
  openModalResiduos(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ResiduosComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.residuos.length === 0 ? 1 : (this.residuos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.residuos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.residuos = this.residuos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.residuos.push(result);
        this.fnGridTableResiduo(this.residuos);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableResiduo(data: Residuos[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Clasificacion: { text: datos.DescripcionClasificacion },
        Residuos: { text: datos.Residuos },
        Frecuencia: { text: datos.DescripcionFrecuencia },
        VolumenTotal: { text: datos.VolumenTotal },
        PesoTotal: { text: datos.PesoTotal },
        UnidadesPeso: { text: datos.DescripcionUnidadPeso },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarResiduo(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarResiduo(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarResiduo(row) },
      }
    });

    this.tableData274 = tabla;
  }

  fnEditarResiduo(row?: TableRow) {
    this.openModalResiduos('RESIDUOS A GENERAR', row);
  }

  fnEliminarResiduo(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.residuos = this.residuos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableResiduo(this.residuos);
      });
  }
  //#endregion Modal Residuo

  //#region Modal Requerimiento
  openModalRequerimiento(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(RequerimientoAguaComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.requerimientoAgua.length === 0 ? 1 : (this.requerimientoAgua.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.requerimientoAgua.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.requerimientoAgua = this.requerimientoAgua.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.requerimientoAgua.push(result);
        this.fnGridTableRequerimiento(this.requerimientoAgua);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableRequerimiento(data: RequerimientoAgua[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Fase: { text: datos.DescripcionFase },
        Etapa: { text: datos.DescripcionEtapa },
        Cantidad: { text: datos.Cantidad },
        NroDias: { text: datos.NroDias },
        Total: { text: datos.Total },
        FuenteAbastecimiento: { text: datos.DescripcionFuente },
        Este: { text: datos.Este },
        Norte: { text: datos.Norte },
        Zona: { text: datos.Zona },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarRequerimiento(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarRequerimiento(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarRequerimiento(row) },
      }
    });

    this.tableData2751 = tabla;
  }

  fnEditarRequerimiento(row?: TableRow) {
    this.openModalRequerimiento('REQUERIMIENTO DE AGUA', row);
  }

  fnEliminarRequerimiento(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.requerimientoAgua = this.requerimientoAgua.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableRequerimiento(this.requerimientoAgua);
      });
  }

  //#endregion Modal Requerimiento

  //#region Modal Insumos
  openModalInsumos(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };

    const InsumoArray = this.tableData2771.map((item: any) => {
      return {
        Id: item.Id,
        Insumos: item.Insumos
      };
    });

    const modalRef = this.openModal.open(InsumosComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.insumos.length === 0 ? 1 : (this.insumos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.insumos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.InsumoArray = InsumoArray;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.insumos = this.insumos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.insumos.push(result);
        this.fnGridTableInsumo(this.insumos);
        //this.tableData2771.push(result.row);
        //this.insumos.push(result.data);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableInsumo(data: Insumos[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Insumos: { text: datos.DescripcionInsumos },
        Cantidad: { text: datos.Cantidad },
        UnidadMedida: { text: datos.DescripcionUnidadMedida },
        Almacenamiento: { text: datos.Almacenamiento },
        Manejo: { text: datos.Manejo },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarInsumo(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarInsumo(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarInsumo(row) },
      }
    });

    this.tableData2771 = tabla;
  }

  fnEditarInsumo(row?: TableRow) {
    this.openModalInsumos('INSUMOS', row);
  }

  fnEliminarInsumo(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.insumos = this.insumos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableInsumo(this.insumos);
      });
  }

  //#endregion Modal Insumos

  //#region Modal Maquinarias
  openModalMaquinarias(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(MaquinariaModalComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.maquinarias.length === 0 ? 1 : (this.maquinarias.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.maquinarias.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.maquinarias = this.maquinarias.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.maquinarias.push(result);
        this.fnGridTableMaquinaria(this.maquinarias);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableMaquinaria(data: Maquinarias[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Maquinaria: { text: datos.Maquinaria },
        Descripcion: { text: datos.Descripcion },
        Cantidad: { text: datos.Cantidad },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMaquinaria(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarMaquinaria(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarMaquinaria(row) },
      }
    });

    this.tableData2772 = tabla;
  }

  fnEditarMaquinaria(row?: TableRow) {
    this.openModalMaquinarias('MAQUINARIA', row);
  }

  fnEliminarMaquinaria(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.maquinarias = this.maquinarias.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableMaquinaria(this.maquinarias);
      });
  }

  //#endregion Modal Maquinarias

  //#region Modal Equipos
  openModalEquipos(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(EquiposModalComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.equipos.length === 0 ? 1 : (this.equipos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.equipos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.equipos = this.equipos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.equipos.push(result);
        this.fnGridTableEquipos(this.equipos);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableEquipos(data: Equipos[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        Equipo: { text: datos.Equipo },
        Descripcion: { text: datos.Descripcion },
        Cantidad: { text: datos.Cantidad },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarEquipo(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarEquipo(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarEquipo(row) },
      }
    });

    this.tableData2773 = tabla;
  }

  fnEditarEquipo(row?: TableRow) {
    this.openModalEquipos('EQUIPO', row);
  }

  fnEliminarEquipo(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.equipos = this.equipos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableEquipos(this.equipos);
      });
  }

  //#endregion Modal Equipos

  //#region ViasAccesoExistentes
  openModalViasAccesoExistentes(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ViasAccesoExistentesComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.viasAccesoExistente.length === 0 ? 1 : (this.viasAccesoExistente.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.viasAccesoExistente.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.viasAccesoExistente = this.viasAccesoExistente.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.viasAccesoExistente.push(result);
        this.fnGridTableViasAccesoExistentes(this.viasAccesoExistente);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableViasAccesoExistentes(data: ViasAccesoExistente[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        TipoVia: { text: datos.DescripcionTipoVia },
        RutaInicio: { text: datos.RutaInicio },
        RutaFin: { text: datos.RutaFin },
        Distancia: { text: datos.Distancia },
        Tiempo: { text: datos.Tiempo },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarViasAccesoExistentes(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarViasAccesoExistentes(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarViasAccesoExistentes(row) },
      }
    });

    this.tableData2781 = tabla;
  }

  fnEditarViasAccesoExistentes(row?: TableRow) {
    this.openModalViasAccesoExistentes('VÍAS DE ACCESO EXISTENTES', row);
  }

  fnEliminarViasAccesoExistentes(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.viasAccesoExistente = this.viasAccesoExistente.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableViasAccesoExistentes(this.viasAccesoExistente);
      });
  }

  //#endregion ViasAccesoExistentes

  //#region ViasAccesoNuevas
  openModalViasAccesoNuevas(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(ViasAccesoNuevaComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.viasAccesoNueva.length === 0 ? 1 : (this.viasAccesoNueva.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.viasAccesoNueva.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.viasAccesoNueva = this.viasAccesoNueva.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.viasAccesoNueva.push(result);
        this.fnGridTableViasAccesoNueva(this.viasAccesoNueva);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      }).catch((error) => {
        // Maneja cualquier error adicional
        console.error('Error manejando el modal:', error);
      });
  }

  fnGridTableViasAccesoNueva(data: ViasAccesoNueva[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        TipoVia: { text: datos.DescripcionTipoVia },
        Largo: { text: datos.Largo },
        Ancho: { text: datos.Ancho },
        Material: { text: datos.Material },
        Equipos: { text: datos.Equipos },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarViasAccesoNuevas(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarViasAccesoNuevas(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarViasAccesoNuevas(row) },
      }
    });

    this.tableData2782 = tabla;
  }

  fnEditarViasAccesoNuevas(row?: TableRow) {
    this.openModalViasAccesoNuevas('VÍAS DE ACCESO NUEVAS', row);
  }

  fnEliminarViasAccesoNuevas(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.viasAccesoNueva = this.viasAccesoNueva.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableViasAccesoNueva(this.viasAccesoNueva);
      });
  }

  //#endregion ViasAccesoNuevas

  //#region TipoManoObra
  openModalTipoManoObra(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(TipoManoObraComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.tipomanoObra.length === 0 ? 1 : (this.tipomanoObra.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.tipomanoObra.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.tipomanoObra = this.tipomanoObra.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.tipomanoObra.push(result);
        this.fnGridTableTipoManoObra(this.tipomanoObra);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableTipoManoObra(data: TipoManoObra[]) {
    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        NroPersonal: { text: datos.NroPersonal },
        Origen: { text: datos.DescripcionOrigen },
        Especializacion: { text: datos.Especializacion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarTipoManoObra(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarTipoManoObra(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarTipoManoObra(row) },
      }
    });

    this.tableData2791 = tabla;
  }

  fnEditarTipoManoObra(row?: TableRow) {
    this.openModalTipoManoObra('TIPO DE MANO DE OBRA', row);
  }

  fnEliminarTipoManoObra(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.tipomanoObra = this.tipomanoObra.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableTipoManoObra(this.tipomanoObra);
      });
  }

  //#endregion TipoManoObra

  //#region FuenteAbastecimiento
  openModalFuenteAbastecimiento(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(FuenteAbastecimientoComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.fuenteAbastecimientoEnergia.length === 0 ? 1 : (this.fuenteAbastecimientoEnergia.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.fuenteAbastecimientoEnergia.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.fuenteAbastecimientoEnergia = this.fuenteAbastecimientoEnergia.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.fuenteAbastecimientoEnergia.push(result);
        this.fnGridTableFuenteAbastecimiento(this.fuenteAbastecimientoEnergia);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableFuenteAbastecimiento(data: FuenteAbastecimientoEnergia[]) {
    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        FuenteEnergia: { text: datos.FuenteEnergia },
        Caracteristicas: { text: datos.Caracteristicas },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarFuenteAbastecimiento(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarFuenteAbastecimiento(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarFuenteAbastecimiento(row) },
      }
    });

    this.tableData2710 = tabla;
  }

  fnEditarFuenteAbastecimiento(row?: TableRow) {
    this.openModalFuenteAbastecimiento('FUENTE DE ABASTECIMIENTO DE ENERGÍA', row);
  }

  fnEliminarFuenteAbastecimiento(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.fuenteAbastecimientoEnergia = this.fuenteAbastecimientoEnergia.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableFuenteAbastecimiento(this.fuenteAbastecimientoEnergia);
      });
  }

  //#endregion FuenteAbastecimiento

  private loadListas() {
    //this.comboGenerico(CONSTANTES.ComboGenericoFTAW.Zona).subscribe(response => this.listaTipoMineral = response);
    this.comboZona().subscribe(response => {
      const options = response.map(({ idZona, descripcion }) => ({
        value: idZona.toString(),
        label: descripcion
      }));
      this.optsZona.push(...options);
    });
    this.comboDatum().subscribe(response => {
      const options = response.map(({ idDatum, descripcion }) => ({
        value: idDatum.toString(),
        label: descripcion
      }));
      this.optsDatum.push(...options);
    });


    this.optsZona = [{ value: '', label: 'Seleccione' }, ...this.optsZona];
    this.optsDatum = [{ value: '', label: 'Seleccione' }, ...this.optsDatum];

    this.comboFuenteAgua().subscribe(response => this.listaFuente = response);

    this.comboGenericoEiaw(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });
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
  private comboZona(): Observable<Zona[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getZona().pipe(
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
  private comboDatum(): Observable<Datum[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getDatum().pipe(
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

  fnDescargarPlantilla() {
    this.tramiteService.downloadTemplateFile(CONSTANTES.FilesTemplates.Plataformas).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = CONSTANTES.FilesTemplates.Plataformas;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error downloading the file', error);
    });
  }

  fnEliminarPlataformas() {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el(los) registro(s)?')
      .then(() => { this.fnGridTableComponentePrincipal([]); });
  }

  onFileSelected(event: any) {
    this.funcionesMtcService.mostrarCargando();
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        event.target.value = '';
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos de extensión csv');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.processCsvData(csvData);
      };
      reader.readAsText(file);
      this.funcionesMtcService.ocultarCargando();
    } else {
      this.funcionesMtcService.ocultarCargando();
      this.funcionesMtcService.mensajeError('Seleccione el archivo a adjuntar');
    }
  }

  processCsvData(csvData: string): void {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    let rows = lines.slice(1).map(line => line.split(','));

    rows = rows.filter(array => array.length === 18);

    rows.map(item => {
      const id: number = this.plataformas.length === 0 ? 1 : (this.plataformas.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
      const descripcionFuenteAgua: string = this.listaFuente.find(x => x.idFuenteAbastecimiento === parseInt(item[8])).descripcion;
      this.plataformas.push({
        Id: id,
        Plataforma: item[0],
        Este: item[1],
        Norte: item[2],
        Largo: item[3],
        Ancho: item[4],
        Profundidad: item[5],
        Cota: item[6],
        Distancia: item[7],
        FuenteAgua: item[8],
        DescripcionFuenteAgua: descripcionFuenteAgua,
        NumeroSondaje: item[9]
      });
    });
    this.fnGridTableComponentePrincipal(this.plataformas);
  }

  private comboFuenteAgua(): Observable<FuenteAgua[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getFuenteAgua().pipe(
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

  private comboGenericoEiaw(tipo: string): Observable<ComboGenerico[]> {
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

  ver() {
    if (this.estadoSolicitud !== 'EN PROCESO') {
      return true;
    }
    return false;
  }

  updateTopsoilSum(): void {
    const totalTopsoil = this.tableData2731.reduce((sum, row) => {
      const topsoilValue = parseFloat(row.TopSoil.text) || 0;
      return sum + topsoilValue;
    }, 0);

    if (this.tableData2732 && this.tableData2732.length > 0) {
      const targetRow = this.tableData2732[0];
      targetRow.totalTopsoilRemover.text = totalTopsoil.toString() + 'm3';
    }
  }

  updateVolumenSum(): void {
    const totalMaterialRemover = this.tableData2731.reduce((sum, row) => {
      const volumenValue = parseFloat(row.Volumen.text) || 0;
      return sum + volumenValue;
    }, 0);

    if (this.tableData2732 && this.tableData2732.length > 0) {
      const targetRow = this.tableData2732[0];
      targetRow.totalMaterialRemover.text = totalMaterialRemover.toString() + 'm3';
    }
  }

  updateAreaSum(): void {
    const totalArea = this.tableData2731.reduce((sum, row) => {
      const volumenValue = parseFloat(row.Area.text) || 0;
      return sum + volumenValue;
    }, 0);
    var hectarea = totalArea / 10000;
    if (this.tableData2732 && this.tableData2732.length > 0) {
      const targetRow = this.tableData2732[0];
      targetRow.areaTotalDistribuir.text = hectarea.toString() + ' Hectáreas';
    }
  }

  onPorcentajeInput(event: Event, row: any, columnField: string): void {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;

    newValue = newValue.replace(/[^0-9]/g, '');

    if (newValue.length > 3) {
      newValue = newValue.substring(0, 3);
    }
    let numValue = parseInt(newValue, 10);

    if (isNaN(numValue) || numValue < 0) {
      row[columnField].value = '';
      inputElement.value = '';
    } else {

      numValue = Math.max(0, Math.min(numValue, 100));
      row[columnField].value = numValue.toString();
      inputElement.value = numValue.toString();
    }
  }

  soloNumeros(event: Event, row: any, columnField: string): void {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.value;


    newValue = newValue.replace(/[^0-9]/g, '');

    let numValue = parseInt(newValue, 10);

    if (isNaN(numValue)) {
      row[columnField].value = '';
      inputElement.value = '';
    } else {
      row[columnField].value = numValue.toString();
      inputElement.value = numValue.toString();
    }
  }
}