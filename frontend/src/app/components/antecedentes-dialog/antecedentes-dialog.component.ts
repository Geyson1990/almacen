import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { Antecedentes, ComponenteNoCerrado, CorreoNotificacion, DatosGenerales, DatosRepresentante, DatosTitular, DatosGeneralesEmpresa, DescripcionProyecto, Distancia, Estudio, FormularioSolicitudDIA, PasivoAmbiental, Permiso, RepresentanteAcreditado, DerechosMineros, ArchivoAdjunto } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
//import { Antecedentes, CorreoNotificacion, DatosGenerales, DatosGeneralesEmpresa, DatosRepresentante, DatosTitular, DescripcionProyecto, Distancia, Estudio, FormularioSolicitudDIA, PasivoAmbiental, Permiso, RepresentanteAcreditado } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { AreaSuperficialActivityComponent } from 'src/app/modals/area-superficial-activity/area-superficial-activity.component';
import { ComponentesNoCerradosComponent } from 'src/app/modals/componentes-no-cerrados/componentes-no-cerrados.component';
import { DistanciaProyectoAreasNaturalesComponent } from 'src/app/modals/distancia-proyecto-areas-naturales/distancia-proyecto-areas-naturales.component';
import { EstudiosInvestigacionesComponent } from 'src/app/modals/estudios-investigaciones/estudios-investigaciones.component';
import { PermisosLicenciasComponent } from 'src/app/modals/permisos-licencias/permisos-licencias.component';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { UnidadMinera } from 'src/app/core/models/Externos/UnidadMinera';
import { Observable, catchError, map, of } from 'rxjs';
import { AreasNaturalesProtegidas } from 'src/app/core/models/Externos/areas-protegidas';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';
import { CONSTANTES } from 'src/app/enums/constants';

@Component({
  selector: 'antecedentes-dialog',
  templateUrl: './antecedentes-dialog.component.html',
})
export class AntecedentesDialogComponent implements OnInit {
  form: FormGroup;
  openModal = inject(NgbModal);
  activeModal = inject(NgbActiveModal);

  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  data: FormularioSolicitudDIA;

  selectedUnitNueva: boolean = false;
  estudios: Estudio[] = [];
  permisos: Permiso[] = [];
  distancia: Distancia[] = [];
  componentesNoCerrados: ComponenteNoCerrado[] = [];
  areasNaturalesProtegidas: AreasNaturalesProtegidas[] = [];
  documentos: ArchivoAdjunto[] = [];
  propiedadSuperficial: ArchivoAdjunto[] = [];
  mapasAreasNaturales: ArchivoAdjunto[] = [];
  listaUnidadMinera: UnidadMinera[] = [];
  datosGeneralesEmpresa: DatosGeneralesEmpresa;
  representantesAcreditados: RepresentanteAcreditado[];
  optsTipoDocumento: IOption[] = [];
  showTipoDocumento: boolean = true;

  

  tableData214: TableRow[] = [
    // { nombrePasivo: { text: '1. Primer pasivo', },
    //   tipoComponent: { text: '1. Primer pasivo', },
    //   subTipoComponent: { text: '1. Primer pasivo', },
    //   este: { text: '23', hasCursorPointer: true },
    //   norte: { text: '45' },
    //   zona: { text: '56' },
    //   datum: { text: '00' },
    //   responsable: { text: 'SI' },
    // },
  ];

  //#region Columnas
  tableData215: TableRow[] = [];
  tableData216: TableRow[] = [];
  tableData217: TableRow[] = [];
  tableData2191: TableRow[] = [];
  tableData2192: TableRow[] = [];
  tableDataDerechoMineroSolicitante: TableRow[] = [];
  tableDataDerechoMineroTercero: TableRow[] = [];

  tableColumns214: TableColumn[] = [];
  tableColumns215: TableColumn[] = [];
  tableColumns2: TableColumn[] = [];
  tableColumns216: TableColumn[] = [];  
  tableColumns217: TableColumn[] = [];  
  tableColumns2191: TableColumn[] = [];  
  tableColumns2192: TableColumn[] = [];  
  tableColumnsDerechoMineroSolicitante: TableColumn[] = [];  
  tableColumnsDerechoMineroTercero: TableColumn[] = [];  
  //#endregion Columnas
  
  estadoSolicitud: string;
  nombreUnidadMinera: string;
  mensaje:string;
  mensaje2191:string;
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private externoService: ExternoService
  ) { }

  ngOnInit(): void {
    this.loadTableHeaders();
    this.buildForm();
    this.loadListas();    
    this.loadDataInicial();
    this.habilitarControles();   
    this.mensaje = 'De acuerdo al inventario de la Dirección General de Minería, no hay pasivos ambientales mineros ubicados en el Área de proyecto.';
    this.mensaje2191='El proyecto no se encuentra dentro de un Área Protegida.'
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
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }

  private loadTableHeaders() {
    this.tableColumns214 = [
      { header: 'NOMBRE PASIVO', field: 'nombrePasivo', rowspan: 2, },
      { header: 'TIPO COMPONENTE', field: 'tipoComponent', rowspan: 2, },
      { header: 'SUB TIPO COMPONENTE', field: 'subTipoComponent', rowspan: 2, },
      { header: 'UBICACIÓN (Coordenadas WGS84)', field: 'ubicacion', colspan: 4, isParentCol: true, },
      { header: 'ESTE', field: 'este', isChildCol: true },
      { header: 'NORTE', field: 'norte', isChildCol: true },
      { header: 'ZONA', field: 'zona', isChildCol: true },
      { header: 'DATUM', field: 'datum', isChildCol: true },
      { header: 'RESPONSABLE', field: 'responsable', rowspan: 2, },
    ];
  
    this.tableColumns215 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'NOMBRE PASIVO', field: 'Nombre', rowspan: 2, },
      { header: 'UBICACIÓN (Coordenadas WGS84)', field: 'Ubicacion', colspan: 4, isParentCol: true },
      { header: 'ESTE', field: 'Este', isChildCol: true },
      { header: 'NORTE', field: 'Norte', isChildCol: true },
      { header: 'ZONA', field: 'Zona', isChildCol: true },
      { header: 'DATUM', field: 'Datum', isChildCol: true },
      { header: 'DESCRIPCIÓN DE LA SITUACIÓN ACTUAL', field: 'Condicion', rowspan: 2, },
      { header: 'EDITAR', field: 'edit', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', rowspan: 2, hidden: !this.modoVisualizacion },
    ];
  
    this.tableColumns2 = [
      { header: 'NOMBRE ACTIVO', field: 'nombrePasivo', rowspan: 2, },
      { header: 'UBICACIÓN (Coordenadas WGS84)', field: 'ubicacion', colspan: 4, isParentCol: true, },
      { header: 'ESTE', field: 'este', isChildCol: true },
      { header: 'NORTE', field: 'norte', isChildCol: true },
      { header: 'ZONA', field: 'zona', isChildCol: true },
      { header: 'DATUM', field: 'datum', isChildCol: true },
      { header: 'DESCRIPCIÓN DE LA SITUACIÓN ACTUAL', field: 'descripcion', rowspan: 2, },
    ];
  
    this.tableColumns216 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'Nº EXPEDIENTE', field: 'NroExpediente', },
      { header: 'TIPO ESTUDIO', field: 'TipoEstudio', },
      { header: 'PROYECTO', field: 'Proyecto', },
      { header: 'ESTADO', field: 'Estado', },
      { header: 'FECHA ENVÍO', field: 'FechaEnvio', },
      { header: 'AUTORIDAD COMPETENTE', field: 'AutoridadCompetente', },
      { header: 'EDITAR', field: 'edit', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', rowspan: 2, hidden: !this.modoVisualizacion },
    ];  
  
    this.tableColumns217 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'TIPO DE ESTUDIO', field: 'TipoEstudio', },
      { header: 'INSTITUCIÓN', field: 'Institucion', },
      { header: 'CERTIFICACIÓN', field: 'Certificacion', },
      { header: 'NRO RD', field: 'NroRD', },
      { header: 'FECHA', field: 'Fecha', },
      { header: 'PLAZO(días)', field: 'PlazoDias', },
      { header: 'EDITAR', field: 'edit', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', rowspan: 2, hidden: !this.modoVisualizacion },
    ];
    
    this.tableColumns2191 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'TIPO', field: 'Tipo', },
      { header: 'CATEGORÍA', field: 'Categoria', },
      { header: 'CLASE', field: 'Clase', },
      { header: 'FUENTE', field: 'Fuente', },
    ];
    
    this.tableColumns2192 = [
      { header: 'ID', field: 'Id', hidden: true },
      { header: 'ÁREA NATURAL PROTEGIDA / ZONA DE AMORTIGUAMIENTO / ÁREAS DE CONSERVACIÓN REGIONAL', field: 'AreaNatural', },
      { header: 'DISTANCIA (km)', field: 'Distancia', },
      { header: 'EDITAR', field: 'edit', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'ELIMINAR', field: 'delete', rowspan: 2, hidden: this.modoVisualizacion},
      { header: 'VER', field: 'view', rowspan: 2, hidden: !this.modoVisualizacion },
    ];
    
    this.tableColumnsDerechoMineroSolicitante = [
      { header: 'CÓDIGO', field: 'IdUnidad' },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'TIPO EXPEDIENTE', field: 'TipoExpediente', },
      { header: 'TITULARIDAD(Inscrita en SUNARP)', field: 'Titularidad', },
      { header: '% PARTICIPACIÓN', field: 'PorcentajeParticipacion', },
      { header: 'FECHA FORMULACIÓN', field: 'FecFormulacion', }
    ];
    
    this.tableColumnsDerechoMineroTercero = [
      { header: 'CÓDIGO', field: 'IdUnidad' },
      { header: 'NOMBRE', field: 'Nombre', },
      { header: 'TIPO EXPEDIENTE', field: 'TipoExpediente', },
      { header: 'TITULARIDAD(Inscrita en SUNARP)', field: 'Titularidad', },
      { header: '% PARTICIPACIÓN', field: 'PorcentajeParticipacion', },
      { header: 'FECHA FORMULACIÓN', field: 'FecFormulacion', }
    ];  
  }

  private loadDataInicial() {
   
    this.externoService.getRepresentantes(this.idCliente).subscribe(resp => {
      this.representantesAcreditados = resp.data;
    });

    this.externoService.getDatosTitularRepresentante(this.idCliente).subscribe(resp => {
      this.datosGeneralesEmpresa = resp.Data;
      this.getData();
    });
 
    this.externoService.getAreasNaturalesProtegidas(1).subscribe(resp => {
      this.areasNaturalesProtegidas = resp.data || [];
      this.fnGridTableAreasNaturales(this.areasNaturalesProtegidas);
    });

    this.externoService.getDerechosMinerosSolicitante(this.idEstudio).subscribe(resp => {
      if (!resp.Success) {
        return;
      }
      this.fnGridTableDerechosMinerosSolicitante(resp.Data);
    });

    this.externoService.getDerechosMinerosTercero(this.idEstudio).subscribe(resp => {
      if (!resp.Success) {
        return;
      }
      this.fnGridTableDerechosMinerosSolicitante(resp.Data);
    });
 
  }

  private fnGridTableAreasNaturales(data: AreasNaturalesProtegidas[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.idAreaProtegida.toString() },
        Nombre: { text: datos.nombre },
        Tipo: { text: datos.tipo },
        Categoria: { text: datos.categoria },
        Clase: { text: datos.clase },
        Fuente: { text: datos.fuente }
      }
    });

    this.tableData2191 = tabla;
  }

  private buildForm(): void {
    this.form = this.builder.group({
      NombreProyecto: [null, Validators.required],
      InversionEstimada: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      Tipo: ['existente', Validators.required],
      UnidadMinera: [null, Validators.required],
      NuevaUnidadMinera: [null, Validators.required],
      NombreTitular: [null, Validators.required],
      Direccion: [null, Validators.required],
      Region: [null, Validators.required],
      Telefono: [null, Validators.required],
      Fax: [null, Validators.required],
      Ruc: [null, Validators.required],
      Email: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      PaginaWeb: [null, Validators.required],
      IdRepresentante: [null, Validators.required],
      ApellidoPaterno: [null, Validators.required],
      ApellidoMaterno: [null, Validators.required],
      Nombres: [null, Validators.required],
      Cargo: [null, Validators.required],
      DocumentoIdentidad: [null, Validators.required],
      EmailRepresentante: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      EmailNotificacion1: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      EmailNotificacion2: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Telefono1: [null, Validators.required],
      Telefono2: [null, Validators.required],
    });
  }
  
  get emailNotificacion1() {
    return this.form.get('EmailNotificacion1');
  }

  get emailNotificacion2() {
    return this.form.get('EmailNotificacion2');
  }

  get emailRepresentante() {
    return this.form.get('EmailRepresentante');
  }

  get email() {
    return this.form.get('Email');
  }

  get inversionEstimada(){
    return this.form.get('InversionEstimada');
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  save(form: FormGroup) {   
    
   
    const data = form.value;   
    var nombreProyecto =  data.NombreProyecto;      
    const tramiteId = localStorage.getItem('tramite-id');
    var idTramite = JSON.parse(tramiteId);   

    const formData = new FormData();
    formData.append('idTramite', idTramite);
    formData.append('nombreProyecto', data.NombreProyecto);

 

    if(nombreProyecto.length>0){
      this.tramiteService.getValidarNombreProyecto(idTramite,  data.NombreProyecto).subscribe(resp => {
        if (resp.success){
          if ( resp.data==1) {      
            this.funcionesMtcService.mensajeError('El nombre del proyecto existe');
            return;
          } 
        }
      });
      

      this.tramiteService.postRegistrarNombreProyecto(
        {
          idTramite: idTramite,
          nombreProyecto: data.NombreProyecto
        }
      ).subscribe(resp => {
        if (resp.success){
   
        }
      });
    }
        
    const objeto: Antecedentes = this.getValues(form);
    this.data.DescripcionProyecto.Antecedentes = objeto;
    this.data.DescripcionProyecto.Antecedentes.Estudios = this.estudios || [];
    this.data.DescripcionProyecto.Antecedentes.Permisos = this.permisos || [];
    this.data.DescripcionProyecto.Antecedentes.Distanciamiento = this.distancia || [];
    this.data.DescripcionProyecto.Antecedentes.MapaComponentes = this.documentos || [];
    this.data.DescripcionProyecto.Antecedentes.PropiedadSuperficial = this.propiedadSuperficial || [];
    this.data.DescripcionProyecto.Antecedentes.MapaAreasNaturales = this.mapasAreasNaturales || [];
    this.data.DescripcionProyecto.Antecedentes.ComponentesNoCerrados = this.componentesNoCerrados || [];
    this.data.DescripcionProyecto.Antecedentes.Save = true;
    this.data.DescripcionProyecto.Antecedentes.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.DescripcionProyecto.Antecedentes.DatosGenerales.NombreUnidadMinera = this.nombreUnidadMinera;
    //this.activeModal.close(this.data);
    this.data.DescripcionProyecto.Antecedentes.State =  this.validarFormularioSolicitudDIA(this.data);
    this.GuardarJson(this.data); 
    
  }

  

  validarAntecedentes(antecedentes: Antecedentes): boolean {
    if (!antecedentes) return false;
  
    // Validar campos obligatorios individuales
    if (!antecedentes.DatosGenerales)return false;    
    if (!antecedentes.DatosTitular)return false;
    if (!antecedentes.DatosRepresentante)return false;
    if (!antecedentes.CorreoNotificacion)return false;

    // Validar listas
    if (!antecedentes.PasivosAmbientales || antecedentes.PasivosAmbientales.length === 0) return false;
    if (!antecedentes.ComponentesNoCerrados || antecedentes.ComponentesNoCerrados.length === 0) return false;
    if (!antecedentes.MapaComponentes || antecedentes.MapaComponentes.length === 0) return false;
    if (!antecedentes.Estudios || antecedentes.Estudios.length === 0)return false;
    if (!antecedentes.Permisos || antecedentes.Permisos.length === 0) return false;
    if (!antecedentes.PropiedadSuperficial || antecedentes.PropiedadSuperficial.length === 0)return false;
    if (!antecedentes.AreasProtegidas || antecedentes.AreasProtegidas.length === 0) return false;
    if (!antecedentes.Distanciamiento || antecedentes.Distanciamiento.length === 0) return false;
    if (!antecedentes.MapaAreasNaturales || antecedentes.MapaAreasNaturales.length === 0) return false;
    debugger;
    if (!this.form.valid) return false;
    // Validar campos booleanos y de texto
    return true;
  }
  
  
  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    debugger;
    if(!this.data.DescripcionProyecto.Antecedentes.Save) return 0;
    if (!this.validarAntecedentes(formulario.DescripcionProyecto.Antecedentes)) return 1;
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

  private getValues(form: FormGroup): Antecedentes {
    const data = form.value;
    const datosGenerales: DatosGenerales = {
      NombreProyecto: data.NombreProyecto,
      InversionEstimada: data.InversionEstimada,
      UnidadMinera: parseInt(data.UnidadMinera),
      NuevaUnidadMinera: data.NuevaUnidadMinera,
      Tipo: data.Tipo,
      NombreUnidadMinera: data.nombreUnidadMinera,
    };
    const datosTitular: DatosTitular = {
      NombreTitular: data.NombreTitular,
      Direccion: data.Direccion,
      Region: data.Region,
      Telefono: data.Telefono,
      Fax: data.Fax,
      Ruc: data.Ruc,
      Email: data.Email,
      PaginaWeb: data.PaginaWeb
    };
    const datosRepresentante: DatosRepresentante = {
      IdRepresentante: data.IdRepresentante,
      ApellidoPaterno: data.ApellidoPaterno,
      ApellidoMaterno: data.ApellidoMaterno,
      Nombres: data.Nombre ?? '',
      Cargo: data.Cargo,
      DocumentoIdentidad: data.DocumentoIdentidad,
      EmailRepresentante: data.EmailRepresentante
    };
    const correoNotificacion: CorreoNotificacion = {
      EmailNotificacion1: data.EmailNotificacion1,
      EmailNotificacion2: data.EmailNotificacion2,
      Telefono1: data.Telefono1,
      Telefono2: data.Telefono2
    };

    const antecedentes: Antecedentes = {
      DatosGenerales: datosGenerales,
      DatosTitular: datosTitular,
      DatosRepresentante: datosRepresentante,
      CorreoNotificacion: correoNotificacion,
      PasivosAmbientales: [],
      ComponentesNoCerrados: [],
      MapaComponentes: [],
      Estudios: [],
      Permisos: [],
      PropiedadSuperficial: [],
      AreasProtegidas: [],
      Distanciamiento: [],
      MapaAreasNaturales: [],
      Save: false,
      FechaRegistro: '',
      State: 0
    };

    return antecedentes;
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.data.DescripcionProyecto.Antecedentes.DatosTitular = this.datosGeneralesEmpresa.DatosTitular;
        this.data.DescripcionProyecto.Antecedentes.DatosRepresentante = this.datosGeneralesEmpresa.DatosRepresentante;
        this.patchFormValues(this.data);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
 
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    
    //this.form.controls['Resumen'].setValue(this.data.ResumenEjecutivo.Resumen);

    //Datos Generales
    if(data.DescripcionProyecto?.Antecedentes?.DatosGenerales.Tipo=='nueva'){
      this.selectedUnitNueva = true;
    }else{    
      this.selectedUnitNueva = false;          
    }
    
    this.form.patchValue(data.DescripcionProyecto?.Antecedentes?.DatosGenerales);
    if(data.DescripcionProyecto?.Antecedentes?.DatosGenerales.Tipo=='0'){
      this.form.controls['Tipo'].setValue('existente');
    }
    // this.form.controls['NombreProyecto'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosGenerales.NombreProyecto);
    // this.form.controls['InversionEstimada'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosGenerales.InversionEstimada);
    //Datos Titular
    this.form.patchValue(data.DescripcionProyecto?.Antecedentes?.DatosTitular);
    this.form.patchValue(data.DescripcionProyecto?.Antecedentes?.DatosRepresentante);
    // this.form.controls['NombreTitular'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.NombreTitular);
    // this.form.controls['Direccion'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.DireccionTitular);
    // this.form.controls['Region'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.Region);
    // this.form.controls['Telefono'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.Telefono);
    // this.form.controls['Fax'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.Fax);
    // this.form.controls['Ruc'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.Ruc);
    // this.form.controls['Email'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.Email);
    // this.form.controls['PaginaWeb'].setValue(this.data.DescripcionProyecto.Antecedentes.DatosTitular.PaginaWeb);
    //Correo Notificacion
    this.form.patchValue(data.DescripcionProyecto?.Antecedentes?.CorreoNotificacion);
    // this.form.controls['EmailNotificacion1'].setValue(this.data.DescripcionProyecto.Antecedentes.CorreoNotificacion.EmailNotificacion1);
    // this.form.controls['EmailNotificacion2'].setValue(this.data.DescripcionProyecto.Antecedentes.CorreoNotificacion.EmailNotificacion2);
    // this.form.controls['Telefono1'].setValue(this.data.DescripcionProyecto.Antecedentes.CorreoNotificacion.Telefono1);
    // this.form.controls['Telefono2'].setValue(this.data.DescripcionProyecto.Antecedentes.CorreoNotificacion.Telefono2);



    this.estudios = data.DescripcionProyecto?.Antecedentes?.Estudios || [];
    this.fnGridTableEstudios(this.estudios);
    this.permisos = data.DescripcionProyecto?.Antecedentes?.Permisos || [];
    this.fnGridTablePermisos(this.permisos);
    this.distancia = data.DescripcionProyecto?.Antecedentes?.Distanciamiento || [];
    this.fnGridTableDistancia(this.distancia);
    this.componentesNoCerrados = data.DescripcionProyecto?.Antecedentes?.ComponentesNoCerrados || [];
    this.fnGridTableComponenteNoCerrado(this.componentesNoCerrados);
    //Documentos
    this.documentos = data.DescripcionProyecto?.Antecedentes?.MapaComponentes || [];
    this.mapasAreasNaturales = data.DescripcionProyecto?.Antecedentes?.MapaAreasNaturales || [];
    this.propiedadSuperficial = data.DescripcionProyecto?.Antecedentes?.PropiedadSuperficial || [];

  }

  openModalComponent(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
      // beforeDismiss: () => {
      //   return this.beforeCloseModal();
      // }
    };
    const modalRef = this.openModal.open(ComponentesNoCerradosComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.componentesNoCerrados.length === 0 ? 1 : (this.componentesNoCerrados.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.componentesNoCerrados.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.componentesNoCerrados = this.componentesNoCerrados.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.componentesNoCerrados.push(result);
        this.fnGridTableComponenteNoCerrado(this.componentesNoCerrados);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  // beforeCloseModal(): boolean {
  //   debugger;
  //   // Lógica para interceptar el cierre del modal
  //   console.log('Interceptando antes del cierre del modal.');
  //   // Devuelve true para permitir el cierre, false para evitarlo
  //   return true;
  // }

  fnGridTableComponenteNoCerrado(data: ComponenteNoCerrado[]) {

    const tabla: TableRow[] = data.map(datos => {
      //debugger;
      //const tipo = datos.ComponenteExUnidadMinera.map(param=>`<li>${param.DescripcionTipo}</li>`).join('<br>');
      //const subtipo = datos.ComponenteExUnidadMinera.map(param=>`<li>${param.DescripcionSubtipo}</li>`).join('<br>');
      const este = datos.ComponenteExUnidadMinera.map(param => `<li>${param.Este}</li>`).join('<br>');
      const norte = datos.ComponenteExUnidadMinera.map(param => `<li>${param.Norte}</li>`).join('<br>');
      const zona = datos.ComponenteExUnidadMinera.map(param => `<li>${param.DescripcionZona}</li>`).join('<br>');
      const datum = datos.ComponenteExUnidadMinera.map(param => `<li>${param.DescripcionDatum}</li>`).join('<br>');

      return {
        Id: { text: datos.Id.toString() },
        Nombre: { text: datos.NombrePasivo },
        //Tipo: { htmlText: `<ul>${tipo}</ul>` },
        //Subtipo: { htmlText: `<ul>${subtipo}</ul>` },
        //Ubicacion: { text: '' },
        Este: { htmlText: `<ul>${este}</ul>` },
        Norte: { htmlText: `<ul>${norte}</ul>` },
        Zona: { htmlText: `<ul>${zona}</ul>` },
        Datum: { htmlText: `<ul>${datum}</ul>` },
        Condicion: { text: datos.Condicion },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteNoCerrado(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarComponenteNoCerrado(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarComponenteNoCerrado(row) },
      }
    });

    this.tableData215 = tabla;
  }

  fnEditarComponenteNoCerrado(row?: TableRow) {
    this.openModalComponent('EDITAR PASIVO DE LABORES E INFRAESTRUCTURA', row);
  }

  fnEliminarComponenteNoCerrado(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.componentesNoCerrados = this.componentesNoCerrados.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableComponenteNoCerrado(this.componentesNoCerrados);
      });
  }

  openModalEstudios(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(EstudiosInvestigacionesComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.estudios.length === 0 ? 1 : (this.estudios.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.estudios.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.estudios = this.estudios.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.estudios.push(result);
        this.fnGridTableEstudios(this.estudios);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  }

  fnGridTableEstudios(data: Estudio[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        NroExpediente: { text: datos.NroExpediente },
        TipoEstudio: { text: datos.DescripcionTipoEstudio },
        Proyecto: { text: datos.Proyecto },
        Estado: { text: datos.Estado },
        FechaEnvio: { text: datos.FechaEnvio },
        AutoridadCompetente: { text: datos.AutoridadCompetente },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarEstudios(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarEstudios(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarEstudios(row) },
      }
    });

    this.tableData216 = tabla;
  }

  fnEditarEstudios(row?: TableRow) {
    this.openModalEstudios('ESTUDIOS E INVESTIGACIONES PREVIAS', row);
  }

  fnEliminarEstudios(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.estudios = this.estudios.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableEstudios(this.estudios);
      });
  }

  openModalPermisos(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(PermisosLicenciasComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.permisos.length === 0 ? 1 : (this.permisos.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.permisos.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.permisos = this.permisos.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.permisos.push(result);
        this.fnGridTablePermisos(this.permisos);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTablePermisos(data: Permiso[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        TipoEstudio: { text: datos.TipoEstudio },
        Institucion: { text: datos.Institucion },
        Certificacion: { text: datos.Certificacion },
        NroRD: { text: datos.NroRD },
        Fecha: { text: datos.Fecha },
        PlazoDias: { text: datos.Plazo.toString() },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarPermisos(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarPermisos(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarPermisos(row) },
      }
    });

    this.tableData217 = tabla;
  }

  fnEditarPermisos(row?: TableRow) {
    this.openModalPermisos('PERMISOS, LICENCIAS Y/O PERMISOS EXISTENTES', row);
  }

  fnEliminarPermisos(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.permisos = this.permisos.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTablePermisos(this.permisos);
      });
  }

  openModalDistancia(text: string, row?: TableRow) {
    const modalOptions: NgbModalOptions = {
      size: 'md',
      centered: true,
      ariaLabelledBy: 'modal-basic-title',
    };
    const modalRef = this.openModal.open(DistanciaProyectoAreasNaturalesComponent, modalOptions);
    modalRef.componentInstance.title = text;
    modalRef.componentInstance.id = this.distancia.length === 0 ? 1 : (this.distancia.reduce((max, item) => item.Id > max ? item.Id : max, 0)) + 1;
    modalRef.componentInstance.edicion = row ? this.distancia.find(x => x.Id === parseInt(row.Id.text)) : undefined;
    modalRef.componentInstance.codMaeSolicitud = this.codMaeSolicitud;
    modalRef.componentInstance.modoVisualizacion = this.modoVisualizacion;
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.componentInstance.idEstudio = this.idEstudio;
    modalRef.result.then(
      (result) => {// Maneja el resultado aquí
        if (row) {
          this.distancia = this.distancia.filter(x => x.Id !== parseInt(row.Id.text));
        }
        this.distancia.push(result);
        this.fnGridTableDistancia(this.distancia);
      },
      (reason) => {// Maneja la cancelación aquí
        console.log('Modal fue cerrado sin resultado:', reason);
      });
  };

  fnGridTableDistancia(data: Distancia[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        Id: { text: datos.Id.toString() },
        AreaNatural: { text: datos.AreaNatural },
        Distancia: { text: datos.Distancia },
        edit: { buttonIcon: 'edit', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarDistancia(row) },
        delete: { buttonIcon: 'remove', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEliminarDistancia(row) },
        view: { buttonIcon: 'search', hasCursorPointer: true, onClick: (row: TableRow) => this.fnEditarDistancia(row) },
      }
    });

    this.tableData2192 = tabla;
  }

  fnEditarDistancia(row?: TableRow) {
    this.openModalDistancia('DISTANCIA DEL PROYECTO A ÁREAS NATURALES Y/O ZONA DE AMORTIGUAMIENTO Y ÁREAS DE CONSERVACIÓN REGIONAL (ACR)', row);
  }

  fnEliminarDistancia(row?: TableRow) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.distancia = this.distancia.filter(x => x.Id !== parseInt(row.Id.text));
        this.fnGridTableDistancia(this.distancia);
      });
  }

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);  
  }

  agregarPropiedadSuperficial(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.propiedadSuperficial.push(item);
  }

  agregarMapaAreasNaturales(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.mapasAreasNaturales.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
    this.documentos = documentos;
  }  

  actualizarDocumentosPropiedad(documentos: ArchivoAdjunto[]) {
    this.propiedadSuperficial = documentos;
  } 

  actualizarDocumentosMapas(documentos: ArchivoAdjunto[]) {
    this.mapasAreasNaturales = documentos;
  } 
  
  private loadListas() {
    this.comboUnidadMinera(9261, 431).subscribe(response => this.listaUnidadMinera = response);
     
    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

  }

  private comboUnidadMinera(idEstudio: number, idCliente: number): Observable<UnidadMinera[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getUnidadMinera(idEstudio, idCliente).pipe(
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

  rbUnidadMineraSelect(colEvent: any) {
    if (colEvent.target.value === 'existente') {
      this.selectedUnitNueva = false;
      this.form.controls['NuevaUnidadMinera'].setValue('');   
      this.form.controls['UnidadMinera'].setValue('0');     
    }
    else if (colEvent.target.value === 'nueva') {
      this.selectedUnitNueva = true;
      this.form.controls['UnidadMinera'].setValue(''); 
    }
  }

  fnGridTableDerechosMinerosSolicitante(data: DerechosMineros[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        IdUnidad: { text: datos.IdUnidad },
        Nombre: { text: datos.Nombre },
        TipoExpediente: { text: datos.TipoExpediente },
        Titularidad: { text: datos.Titularidad },
        PorcentajeParticipacion: { text: datos.PorcentajeParticipacion.toString() },
        FecFormulacion: { text: datos.FecFormulacion }
      }
    });

    this.tableDataDerechoMineroSolicitante = tabla;
  }

  fnGridTableDerechosMinerosTercero(data: DerechosMineros[]) {

    const tabla: TableRow[] = data.map(datos => {
      return {
        IdUnidad: { text: datos.IdUnidad },
        Nombre: { text: datos.Nombre },
        TipoExpediente: { text: datos.TipoExpediente },
        Titularidad: { text: datos.Titularidad },
        PorcentajeParticipacion: { text: datos.PorcentajeParticipacion.toString() },
        FecFormulacion: { text: datos.FecFormulacion }
      }
    });

    this.tableDataDerechoMineroTercero = tabla;
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

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }

  soloDecimales(event: any, controlName: string): void {
    const inputValue: string = event.target.value;
    const formattedValue = inputValue
      .replace(/[^0-9.]/g, '')               
      .replace(/(\..*?)\..*/g, '$1')         
      .replace(/(\.\d{2})\d+/g, '$1'); 
    
    event.target.value = formattedValue;
 
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(formattedValue, { emitEvent: false });
      control.updateValueAndValidity();
    }
  }
 
  onUnidadMinera(event: any){    
    this.nombreUnidadMinera = event.target.options[event.target.selectedIndex].text;
  }
}
