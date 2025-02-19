import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { ReniecService } from '../../../../../core/services/servicios/reniec.service';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { VehiculoService } from '../../../../../core/services/servicios/vehiculo.service';
import { Anexo002_A17Request } from '../../../../../core/models/Anexos/Anexo002_A17/Anexo002_A17Request';
import { A002_A17_Seccion_Itinerario, A002_A17_Seccion_Renat, ModalidadServicio, DatosLocal, Vehiculo, Conductor } from '../../../../../core/models/Anexos/Anexo002_A17/Secciones';
import { Anexo002A17Service } from '../../../../../core/services/anexos/anexo002-a17.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { Anexo002_A17Response } from '../../../../../core/models/Anexos/Anexo002_A17/Anexo002_A17Response';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { RenatService } from 'src/app/core/services/servicios/renat.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import {ServTempEmp} from 'src/app/core/models/renat';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { DatosPersona } from 'src/app/core/models/ReniecModel';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
  selector: 'app-anexo002-a17',
  templateUrl: './anexo002-a17.component.html',
  styleUrls: ['./anexo002-a17.component.css']
})
export class Anexo002A17Component implements OnInit {

  fileToUpload: File;
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  idAnexo: number;
  ruta:any=null; 

  public formAnexo: UntypedFormGroup;
  public vehiculos:  Vehiculo[] = [];
  public recordIndexToEdit: number;

  public conductores: Conductor[] = [];
  public recordIndexToEditConductores: number;

  public mensajeClasificacionVehicular: string;

  filePdfCroquisSeleccionado: any = null;
  filePdfCroquisPathName: string = null;

  filePdfCelularSelecciona: any = null;
  filePdfCelularPathName: string = null;

  filePdfCafPathName: string= null;
  filePdfCaoPathName: string= null;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoTipoSolicitud: string;
  descTipoSolicitud:string;

  public filePdfContratoSeleccionado: any;
  filePdfCafSeleccionado: any = null;
  filePdfCaoSeleccionado: any = null;
  valCaf: number = 0;
  valCao: number = 0;
  valCel: number = 0;
  public visibleButtonCao: boolean;
  public visibleButtonCaf: boolean;
  public visibleButtonCelular: boolean = false;
  visibleButtonInstalacion: boolean = false;
  // public contratoVinculado: string;
  filePdfInstalacionSeleccionado: any = null;
  pathPdfInstalacionSeleccionado: any = null;

  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];

    fechaIni: string = "";
    fechaFin :string ="";

    _escalasComerciales :any;
     _frecuencias  :any;
     _diasSalida   : any;
     _horasSalida   : any;
     _modalidadServicio   : any;
     _distancia   : any;
     _tiempoAproxViaje :any;
     _fechaInicio :any;
     _fechaFin :any;
     tupa1 :boolean =true;
     tupa2:boolean =false;
     _TUPA :string ="DSTT-032";
     fechaactual : Date = new Date();
     minDate ={year:this.fechaactual.getUTCFullYear() ,month:this.fechaactual.getUTCMonth()+1,day:this.fechaactual.getUTCDate()}
     minDatetofin :any;

     mensajeAutorizacion:string="";
     viewBar :boolean = false;

     tipoPersona:number;
     dniPersona:string;
     ruc:string;

   RequestServTempEmp: ServTempEmp = new ServTempEmp();

  idDep: number;
  idProv: number;
  reqAnexo: number;
  movIdAnexo: number;
  codAnexo: string;

  txt_opcional: string = '(OPCIONAL)'; 

  listaModalServicio : ModalidadServicio[] =[
    { id: 1, descripcion: 'Estandar' },
    { id: 2, descripcion: 'Diferenciada' },
  ] ;

  paRelacionConductores: string[]=["DSTT-029","DSTT-030"];
  paInstalacionAdministrativa: string[]=["DSTT-029","DSTT-030","DSTT-031"];
  paCategoriaM1:string[]=["DSTT-029"];
  paRenat:string[]=["DSTT-029","DSTT-031"];

  opcionalRelacionConductores: boolean=true;
  opcionalInstalacionAdministrativa: boolean= true;
  opcionalCategoriaM1: boolean=true;
  opcionalRenat: boolean=true;

  paSeccion1: string[]=["DSTT-028","DSTT-029","DSTT-030","DSTT-031","DSTT-032"];
  paSeccion2: string[]=["DSTT-028","DSTT-029","DSTT-030","DSTT-031","DSTT-032"];
  paSeccion3: string[]=["DSTT-028","DSTT-029","DSTT-030","DSTT-031","DSTT-032"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;

  paTipoSolicitud =[{"pa":"DSTT-031","tipoSolicitud":"3","seccion":"1"}];

  paTipoServicio = [{"pa":"DSTT-029","tipoSolicitud":"0","tipoServicio":"0"},
                    {"pa":"DSTT-029","tipoSolicitud":"0","tipoServicio":"1"},
                    {"pa":"DSTT-030","tipoSolicitud":"0","tipoServicio":"1"},
                    {"pa":"DSTT-031","tipoSolicitud":"1","tipoServicio":"1"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"3"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"4"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"5"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"6"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"7"},
                    {"pa":"DSTT-031","tipoSolicitud":"3","tipoServicio":"8"}
                   ];
  tipoServicio: string="";
  
  paCantidadVehiculos = [{"pa":"DSTT-029","tipoSolicitud":"1","cantidadMinima":2},
                         {"pa":"DSTT-029","tipoSolicitud":"2","cantidadMinima":1}];
  cantidadVehiculo: number = 1;

  constructor(
    public modalClasVehicular: NgbModal,
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private reniecService: ReniecService,
    private modalService: NgbModal,
    private vehiculoService: VehiculoService,
    private anexoService: Anexo002A17Service,
    public activeModal: NgbActiveModal,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private ubigeoService: UbigeoService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private renatService :RenatService,
    private seguridadService: SeguridadService,
    private mtcService: MtcService,
  ) {
    this.idAnexo = 0;
    this.vehiculos = [];
    this.recordIndexToEdit = -1;
    this.conductores = [];
    this.recordIndexToEditConductores = -1;
    this.filePdfCroquisSeleccionado = null;
    this.filePdfCafSeleccionado = null;
    this.visibleButtonCao = false;
    this.visibleButtonCaf = false;

    this.filePdfCelularSelecciona = null;
    // this.visibleButtonCelu = false;
    // this.contratoVinculado = '';
    this.mensajeClasificacionVehicular = `CLASIFICACIÓN VEHICULAR
    Categoría M: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de pasajeros.
    M1 : Vehículos de ocho asientos o menos, sin contar el asiento del conductor.
    M2 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de 5 toneladas o menos.
    M3 : Vehículos de más de ocho asientos, sin contar el asiento del conductor y peso bruto vehicular de más de 5 toneladas.
    Los vehículos de las categorías M2 y M3, a su vez de acuerdo a la disposición de los pasajeros se clasifican en:
    Clase I : Vehículos construidos con áreas para pasajeros de pie permitiendo el desplazamiento frecuente de éstos
    Clase II : Vehículos construidos principalmente para el transporte de pasajeros sentados y, también diseñados para permitir
    el transporte de pasajeros de pie en el pasadizo y/o en un área que no excede el espacio provisto para dos asientos dobles.
    Clase III : Vehículos construidos exclusivamente para el transporte de pasajeros sentados.
    Categoría N: Vehículos automotores de cuatro ruedas o más diseñados y construidos para el transporte de mercancía.
    N1 : Vehículos de peso bruto vehicular de 3,5 toneladas o menos.
    N2 : Vehículos de peso bruto vehicular mayor a 3,5 toneladas hasta 12 toneladas.
    N3 : Vehículos de peso bruto vehicular mayor a 12 toneladas.`;
  }

  ngOnInit(): void {

    if(this.seguridadService.getNameId() === '00001'){
      //persona natural
      this.tipoPersona = 1;
      this.dniPersona = this.seguridadService.getNumDoc();
    }else if(this.seguridadService.getNameId() === '00002'){
        //persona juridica
        this.tipoPersona = 2;
        this.ruc = this.seguridadService.getCompanyCode();
      }else{
        //persona natural con ruc
        this.tipoPersona = 3;
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
    }
    
    console.log("Tipo de Solicitud:" + this.dataInput.tipoSolicitud.codigo);
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.departamentos();
    this.cargarDatos();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitud = this.dataInput.tipoSolicitud.codigo;
    this.descTipoSolicitud = this.dataInput.tipoSolicitud.descripcion;

    if(this.paInstalacionAdministrativa.indexOf(this.codigoProcedimientoTupa)>-1) this.opcionalInstalacionAdministrativa=true; else this.opcionalInstalacionAdministrativa=false;
    if(this.paRelacionConductores.indexOf(this.codigoProcedimientoTupa)>-1) this.opcionalRelacionConductores=true; else this.opcionalRelacionConductores=false;
    if(this.paCategoriaM1.indexOf(this.codigoProcedimientoTupa)>-1) this.opcionalCategoriaM1=true; else this.opcionalCategoriaM1=false;
    if(this.paRenat.indexOf(this.codigoProcedimientoTupa)>-1) this.opcionalRenat=true; else this.opcionalRenat=false;
    
    if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion2.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion2=true; else this.habilitarSeccion2=false;
    if(this.paSeccion3.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion3=true; else this.habilitarSeccion3=false;

    let deshabilitarTipoSolicitud = this.paTipoSolicitud.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud==this.codigoTipoSolicitud && i.seccion=="1");
    if(deshabilitarTipoSolicitud!=undefined){
      this.habilitarSeccion1=false;
    }
    deshabilitarTipoSolicitud = this.paTipoSolicitud.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud==this.codigoTipoSolicitud && i.seccion=="2");
    if(deshabilitarTipoSolicitud!=undefined){
      this.habilitarSeccion2=false;
    }
    deshabilitarTipoSolicitud = this.paTipoSolicitud.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud==this.codigoTipoSolicitud && i.seccion=="3");
    if(deshabilitarTipoSolicitud!=undefined){
      this.habilitarSeccion3=false;
    }

    if(this.opcionalRelacionConductores) this.txt_opcional="(OPCIONAL)"; else this.txt_opcional="";

    if(this.paCantidadVehiculos.find(i=> i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitud)!=undefined)
      this.cantidadVehiculo = this.paCantidadVehiculos.find(i=> i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud == this.codigoTipoSolicitud).cantidadMinima;

    this.createForm();
    this.validacionRenat();

    this.validaAutorizacion();
    


    setTimeout(() => {
      if(this.habilitarSeccion1===true){
        this.acc.expand('anexo002-a17-seccion-1'); 
      }else{
        this.acc.collapse('anexo002-a17-seccion-1');
        document.querySelector('button[aria-controls=anexo002-a17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      
      if(this.habilitarSeccion2===true){
        this.acc.expand('anexo002-a17-seccion-2');
      }else{
        this.acc.collapse('anexo002-a17-seccion-2');
        document.querySelector('button[aria-controls=anexo002-a17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('anexo002-a17-seccion-3');
      }else{
        this.acc.collapse('anexo002-a17-seccion-3');
        document.querySelector('button[aria-controls=anexo002-a17-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }
    });
  }

  private createForm(): void{

    if(this.codigoProcedimientoTupa === this._TUPA){
      this.tupa1  = false;
      this.tupa2  = true;
      this._escalasComerciales =[''];
      this._frecuencias = [''];
      this._diasSalida = [''];
      this._horasSalida = [''];
      this._modalidadServicio = [''];
      this._distancia = [''];
      this._tiempoAproxViaje = [''];
      this._fechaInicio = ['', [ Validators.required ]];
      this._fechaFin = ['', [ Validators.required ]];
      
    // this.formAnexo.get("flotaOperativa").setValue(metaData.itinerario.flotaOperativa);
     //this.formAnexo.get("flotaReserva").setValue(metaData.itinerario.flotaReserva);
    }else{
      this.tupa2 = false;
      this._escalasComerciales = ['', [ Validators.required ]];
      this._frecuencias = ['', [ Validators.required ]];
      this._diasSalida = ['', [ Validators.required ]];
      this._horasSalida = ['', [ Validators.required ]];
      this._modalidadServicio = ['', [ Validators.required ]];
      this._distancia = ['', [ Validators.required ]];
      this._tiempoAproxViaje = ['', [ Validators.required ]];

      this._fechaInicio = [''];
      this._fechaFin = [''];
    }

    console.log("tupa2", this.tupa2);
    console.log("OpcionalRenat: "+this.opcionalRenat);
    if (this.opcionalInstalacionAdministrativa){
      this.formAnexo = this.fb.group({
        fechaIni: this._fechaInicio,
        fechaFin: this._fechaFin,
        origenRuta:  [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        destinoRuta: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        itinerario:  [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        escalasComerciales: (this.opcionalRenat==true?[{value:'', disabled:true}]:this._escalasComerciales),
        frecuencias: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        diasSalida:  (this.opcionalRenat==true?[{value:'',disabled:true}]:this._diasSalida),
        horasSalida: (this.opcionalRenat==true?[{value:'',disabled:true}]:this._horasSalida),
        modalidadServicio: (this.opcionalRenat==true?[{value:'', disabled:true}]:this._modalidadServicio),
        flotaOperativa: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        flotaReserva: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        distancia:  (this.opcionalRenat==true?[{value:'', disabled:true}]:this._distancia),
        tiempoAproxViaje: (this.opcionalRenat==true?[{value:'',disabled:true}]:this._tiempoAproxViaje),
        servicioHabilitar: [{value:'',disabled:(this.opcionalRenat==true?true:false)}],
        plazoOperacion: [{value:'',disabled:(this.opcionalRenat==true?true:false)}],
        categoriafija :[{value:'',disabled:(this.opcionalRenat==true?true:false)}],

        caf: [false],
        cao: [false],
        placaRodaje: ['', [ Validators.minLength(6), Validators.maxLength(6) ]],
        soat: [''],
        citv: [''],
        celular: [''],
        adCelular: [false],

        instalacion: ['0'],
        domicilio: [''],
        departamento: [''],
        provincia: [''],
        distrito: [''],

        numeroDni: ['', [ Validators.minLength(8), Validators.maxLength(8) ]],
        nombresApellidos: [''],
        edad: ['', [ Validators.pattern('^[0-9]+$'), Validators.min(18), Validators.max(100) ]],
        numeroLicencia: [''],
        categoria: [''],
        subcategoria: [''],
        nroRuta: [''],
        vigencia_fechaini:[''],
        vigencia_fechafin:['']
      });

    }else{
      this.formAnexo = this.fb.group({
        fechaIni: this._fechaInicio,
        fechaFin: this._fechaFin,
        origenRuta: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        destinoRuta: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        itinerario: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        escalasComerciales: (this.opcionalRenat==true?[{value:'', disabled:true}]:this._escalasComerciales),
        frecuencias: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        diasSalida: (this.opcionalRenat==true?[{value:'',disabled:true}]:this._diasSalida),
        horasSalida: (this.opcionalRenat==true?[{value:'',disabled:true}]:this._horasSalida),
        modalidadServicio: (this.opcionalRenat==true?[{value:'', disabled:true}]:this._modalidadServicio),
        flotaOperativa: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        flotaReserva: [{value:'', disabled:(this.opcionalRenat==true?true:false)}, [ Validators.required ]],
        distancia:   (this.opcionalRenat==true?[{value:'', disabled:true}]:this._distancia),
        tiempoAproxViaje: (this.opcionalRenat==true?[{value:'',disabled:true}]:this._tiempoAproxViaje),
        servicioHabilitar: [{value:'', disabled:(this.opcionalRenat==true?true:false)}],
        plazoOperacion: [{value:'', disabled:(this.opcionalRenat==true?true:false)}],
        categoriafija :[{value:'', disabled:(this.opcionalRenat==true?true:false)}],

        caf: [false],
        cao: [false],
        placaRodaje: ['', [ Validators.minLength(6), Validators.maxLength(6) ]],
        soat: [''],
        citv: [''],
        celular: [''],
        adCelular: [false],

        instalacion: ['0', [ Validators.required ]],
        domicilio: ['', [ Validators.required ]],
        departamento: ['', [ Validators.required ]],
        provincia: ['', [ Validators.required ]],
        distrito: ['', [ Validators.required ]],

        numeroDni: ['', [ Validators.minLength(8), Validators.maxLength(8) ]],
        nombresApellidos: [''],
        edad: ['', [ Validators.pattern('^[0-9]+$'), Validators.min(18), Validators.max(100) ]],
        numeroLicencia: [''],
        categoria: [''],
        subcategoria: [''],

        nroRuta: [''],
        vigencia_fechaini:[''],
        vigencia_fechafin:['']
      });
    }

    if(this.opcionalRenat==true){
      this.formAnexo.controls['origenRuta'].setValidators(null);
      this.formAnexo.controls['destinoRuta'].setValidators(null);
      this.formAnexo.controls['itinerario'].setValidators(null);
      this.formAnexo.controls['frecuencias'].setValidators(null);
      this.formAnexo.controls['flotaOperativa'].setValidators(null);
      this.formAnexo.controls['flotaReserva'].setValidators(null);
      this.formAnexo.controls['flotaReserva'].setValidators(null);
      this.formAnexo.controls['flotaReserva'].setValidators(null);
      this.formAnexo.controls['flotaReserva'].setValidators(null);


      this.formAnexo.controls['origenRuta'].updateValueAndValidity();
      this.formAnexo.controls['destinoRuta'].updateValueAndValidity();
      this.formAnexo.controls['itinerario'].updateValueAndValidity();
      this.formAnexo.controls['frecuencias'].updateValueAndValidity();
      this.formAnexo.controls['flotaOperativa'].updateValueAndValidity();
      this.formAnexo.controls['flotaReserva'].updateValueAndValidity();
    }

    if(this.codigoTipoSolicitud=="DSTT-032"){
      this.formAnexo.controls['frecuencias'].setValidators(null);
      this.formAnexo.controls['frecuencias'].updateValueAndValidity();
     
    }

  }

  public modalClasificacionVehicular( content: any ): void{
    this.modalClasVehicular.open(content, { size: 'xl'});
  }

  public addVehiculo(){
    if (
      this.formAnexo.get('placaRodaje').value.trim() === '' ||
      this.formAnexo.get('soat').value.trim() === '' ||
      this.formAnexo.get('citv').value.trim() === '' ||
      this.formAnexo.get('celular').value.trim() === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }
      if (!this.visibleButtonCaf && !this.visibleButtonCao) {
      return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF');
    }

    if (this.valCaf == 0 && this.visibleButtonCaf){
      return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF C.A.F');
    }else if(this.valCao == 0  && this.visibleButtonCao){
      return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF C.A.O');
    }

    if (this.valCel == 0 ){
      return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF en la sección celular');
    }


    const placaRodaje = this.formAnexo.get('placaRodaje').value.trim().toUpperCase();
    const indexFound = this.vehiculos.findIndex( item => item.placaRodaje === placaRodaje);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEdit ) {
        return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
      }
    }

    const soat = this.formAnexo.get('soat').value;
    const citv = this.formAnexo.get('citv').value;
    const caf = this.formAnexo.get('caf').value;
    const cao = this.formAnexo.get('cao').value;
    const fileCaf = this.filePdfCafSeleccionado;
    const fileCao = this.filePdfCaoSeleccionado;
    const pathNameCaf = null;
    const pathNameCao = null;
    const celular = this.formAnexo.get('celular').value;
    const adCelular = this.formAnexo.get('adCelular').value;
    const fileCelular = this.filePdfCelularSelecciona;
    const pathNameCelular = null

    if (this.recordIndexToEdit === -1) {
      this.vehiculos.push({
        placaRodaje,
        soat,
        citv,
        caf,
        cao,
        fileCaf,
        fileCao,
        pathNameCaf,
        pathNameCao,
        celular,
        adCelular,
        fileCelular,
        pathNameCelular
      });
    } else {
      this.vehiculos[this.recordIndexToEdit].placaRodaje = placaRodaje;
      this.vehiculos[this.recordIndexToEdit].soat = soat;
      this.vehiculos[this.recordIndexToEdit].citv = citv;
      this.vehiculos[this.recordIndexToEdit].caf = caf;
      this.vehiculos[this.recordIndexToEdit].cao = cao;
      this.vehiculos[this.recordIndexToEdit].fileCaf = fileCaf;
      this.vehiculos[this.recordIndexToEdit].fileCao = fileCao;
      this.vehiculos[this.recordIndexToEdit].celular = celular;
      this.vehiculos[this.recordIndexToEdit].adCelular = adCelular;
      this.vehiculos[this.recordIndexToEdit].fileCelular = fileCelular;
    }
    console.log("-Vehiculos:");
    console.log(this.vehiculos);
    this.clearVehicleData();
  }

  private clearVehicleData(){
    this.recordIndexToEdit = -1;

    this.formAnexo.controls.placaRodaje.setValue('');
    this.formAnexo.controls.soat.setValue('');
    this.formAnexo.controls.citv.setValue('');
    this.formAnexo.controls.caf.setValue(false);
    this.formAnexo.controls.cao.setValue(false);
    this.formAnexo.controls.celular.setValue('');
    this.formAnexo.controls.adCelular.setValue('');
    this.filePdfCelularSelecciona = null;
    this.filePdfCafSeleccionado = null;
    this.filePdfCaoSeleccionado = null;
    // this.contratoVinculado = '';
    this.visibleButtonCao = false;
    this.visibleButtonCaf = false;
    this.visibleButtonCelular = false;
  }


  validatediaFecha(fechaini:string){

    var mes = fechaini.substring(3,5);
    var anio = fechaini.substring(6,10);



    this.renatService.ObtenerCantAutorizacion(this.ruc,fechaini).subscribe((data :any) => {

      console.log("dataautorizacion", data);
      var mescount =0;
      var aniocount =0;
      for(let fecha of data){

        console.log("lista fecha: " + fecha.dte_feciniciovigencia + "  " ,fecha.dte_feciniciovigencia.substring(3,5))

        //mes count
        if(fecha.dte_feciniciovigencia.substring(3,5) == mes){
          mescount++;
        }
        if(mescount>2){
          this.funcionesMtcService.ocultarCargando().mensajeError('Excedió la cuota de permisos por mes(2)');
          this.formAnexo.get("fechaIni").setValue("");
        }

     if(fecha.dte_feciniciovigencia.substring(6,10) == anio){
             aniocount++;
        }
        if(mescount>12){
          this.funcionesMtcService.ocultarCargando().mensajeError('Excedió la cuota de permisos por año');
          this.formAnexo.get("fechaIni").setValue("");
        }
      }
    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
    });
  }

  onDateSelectIni(event) {
    
    //console.log(event);
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = day + "-" + month + "-" + year;
    this.fechaIni = finalDate;
    this.validatediaFecha(finalDate);
   // minDate ={year:this.fechaactual.getUTCFullYear() ,month:this.fechaactual.getUTCMonth()+1,day:this.fechaactual.getUTCDate()}
    this.minDatetofin  ={year: Number(year) , month : Number(month) ,day: Number(day)}
    console.log("fechainicio es " , this.minDatetofin ,"    " , this.minDate);
    //this.formAnexo.get("fechaIni").setValue(this.fechaIni);
  }

  onDateSelectFin(event) {
  //console.log(event);
  let year = event.year;
  let month = event.month <= 9 ? '0' + event.month : event.month;
  let day = event.day <= 9 ? '0' + event.day : event.day;
  let finalDate = day + "-" + month + "-" + year;
  this.fechaFin = finalDate;
  //console.log("fechaini", finalDate);
  //this.formAnexo.get("fechaFin").setValue(this.fechaFin);
  }

  onChangeDistritos() {
    // this.formulario.controls['numeroDocumento'].setValue('');
    // this.inputNumeroDocumento();
    const idDepartamento: string = this.formAnexo.controls['departamento'].value.trim();
    const idProvincia: string = this.formAnexo.controls['provincia'].value.trim();
    this.formAnexo.controls['distrito'].setValue('');
    if(idDepartamento!=='' && idProvincia!==''){
    this.idDep = parseInt(idDepartamento);
    this.idProv = parseInt(idProvincia);
    this.listDistritos();
   }else{
    this.listaDistritos = [];
   }
  }

  onChangeProvincias() {
    const idDepartamento: string = this.formAnexo.controls['departamento'].value;
    this.formAnexo.controls['provincia'].setValue('');
    console.log(idDepartamento);
    // return;

    // this.listaDistritos = [];

    if(idDepartamento!==''){
      this.listaProvincias=[];
      this.listaDistritos = [];
      this.idDep = parseInt(idDepartamento)
      console.log(this.idDep);
      // this.ubigeoService.provincia(this.idDep).subscribe(
      //   (dataProvincia) => {
      //     this.funcionesMtcService.ocultarCargando();
      //     this.listaProvincias = dataProvincia;
      this.listaProvincia();
      //   },
      //   (error) => {
      //     this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
      //     // this.formulario.controls["nombreRepresentante"].enable();
      //     // this.formulario.controls["apePaternoRepresentante"].enable();
      //     // this.formulario.controls["apeMaternoRepresentante"].enable();
      //   }
      // );

    }else{
      console.log("******");
      this.listaProvincias=[];
      this.listaDistritos = [];
    }

  }

  listaProvincia(){
    console.log(this.idDep);
    this.ubigeoService.provincia(this.idDep).subscribe(
      (dataProvincia) => {
        this.funcionesMtcService.ocultarCargando();
        this.listaProvincias = dataProvincia;

      },
      (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
        // this.formulario.controls["nombreRepresentante"].enable();
        // this.formulario.controls["apePaternoRepresentante"].enable();
        // this.formulario.controls["apeMaternoRepresentante"].enable();
      }
    );
  }

  listDistritos(){
    this.ubigeoService.distrito(this.idDep, this.idProv).subscribe(
      (dataDistrito) => {
        this.listaDistritos = dataDistrito;
        this.funcionesMtcService.ocultarCargando();


      },
      (error) => {
        this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
        // this.formulario.controls["nombreRepresentante"].enable();
        // this.formulario.controls["apePaternoRepresentante"].enable();
        // this.formulario.controls["apeMaternoRepresentante"].enable();
      }
    );
  }
  public editVehiculo( vehiculo: any, i: number ){

    console.log(vehiculo);

    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.placaRodaje.setValue(vehiculo.placaRodaje);
    this.formAnexo.controls.soat.setValue(vehiculo.soat);
    this.formAnexo.controls.citv.setValue(vehiculo.citv);
    this.formAnexo.controls.caf.setValue(vehiculo.caf);
    this.formAnexo.controls.cao.setValue(vehiculo.cao);
    this.formAnexo.controls.celular.setValue(vehiculo.celular);
    this.formAnexo.controls.adCelular.setValue(vehiculo.adCelular);

    this.visibleButtonCaf = vehiculo.caf;
    this.visibleButtonCao = vehiculo.cao;
    this.visibleButtonCelular = vehiculo.adCelular;

    if(this.visibleButtonCaf){
      this.valCaf = 1;
    }
    if(this.visibleButtonCao){
      this.valCao = 1;
    }
    if(this.visibleButtonCelular){
      this.valCel = 1;
    }

    this.filePdfCafSeleccionado = vehiculo.pathNameCaf;
    this.filePdfCaoSeleccionado = vehiculo.pathNameCao;
    this.filePdfCelularSelecciona = vehiculo.pathNameCelular;


    this.filePdfCafPathName = vehiculo.pathNameCaf;
    this.filePdfCaoPathName = vehiculo.pathNameCao;
    this.filePdfCelularPathName = vehiculo.pathNameCelular;


  }

  public deleteVehiculo( vehiculo: any, i: number ){
    console.log('recordIndexToEdit',this.recordIndexToEdit);
    if (this.recordIndexToEdit === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.vehiculos.splice(i, 1);
        });
    }
  }

  verPdfCafGrilla(item: Vehiculo) {
    if(item.fileCaf !== null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(item.fileCaf);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(item.pathNameCaf)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();
              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }

  }

  verPdfCaoGrilla(item: Vehiculo) {
    //console.log(item.fileCao)
    if (item.fileCao !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(item.fileCao);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
    }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(item.pathNameCao)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              console.log(file);

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }

  }

  verPdfCelularGrilla(item: Vehiculo) {

    if (item.fileCelular !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(item.fileCelular);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Celular: " + item.celular;
    }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(item.pathNameCelular)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Celular: " + item.celular;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }

  }

  visualizarGrillaPdf(file: File, placaRodaje: string) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - PDF: " + placaRodaje;
  }

  buscarNumeroDocumento() {
    const numeroDni: string = this.formAnexo.get('numeroDni').value.trim();

    if ( numeroDni.length === 0 )
      return this.funcionesMtcService.mensajeError('Debe ingresar un Número de DNI');
    if ( numeroDni.length !== 8 )
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();
   
    this.reniecService.getDni(numeroDni).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        // this.addPersona(datosPersona.prenombres + ' ' + datosPersona.apPrimer + ' ' + datosPersona.apSegundo, datosPersona.direccion);
        
        //this.buscarNumeroLicencia();

        //if(this.tupa2){
          this.validaConductor(datosPersona);

        // }else{
        //   this.addPersona(`${datosPersona.apPrimer} ${datosPersona.apSegundo} ${datosPersona.prenombres}`, datosPersona.direccion);
        // }

        
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }

  private addPersona(datos: string, direccion: string) {
    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC corresponden a la persona ${datos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.formAnexo.controls.nombresApellidos.setValue(datos);
        
      });
  }

  addConductor(){

    if(this.tupa2){
      this.formAnexo.get("subcategoria").setValue("nn");
      this.formAnexo.get("categoria").setValue("A IIIc");
    }

    if (
      this.formAnexo.get('numeroDni').value.trim() === '' ||
      this.formAnexo.get('nombresApellidos').value.trim() === '' ||
      this.formAnexo.get('edad').value < 18 ||
      this.formAnexo.get('numeroLicencia').value.trim() === '' ||
      this.formAnexo.get('categoria').value.trim() === '' ||
      this.formAnexo.get('subcategoria').value.trim() === ''
    ) {
     

      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    // if (this.formAnexo.get('caf').value === true && this.filePdfContratoSeleccionado === null)
    //   return this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');
    // }

    const numeroDni = this.formAnexo.get('numeroDni').value;
    const indexFound = this.conductores.findIndex( item => item.numeroDni === numeroDni);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEditConductores ) {
        return this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
      }
    }

    const nombresApellidos = this.formAnexo.get('nombresApellidos').value;
    const edad = this.formAnexo.get('edad').value;
    const numeroLicencia = this.formAnexo.get('numeroLicencia').value;
    const categoria = this.formAnexo.get('categoria').value;
    const subcategoria = this.formAnexo.get('subcategoria').value;

    if (this.recordIndexToEditConductores === -1) {
      this.conductores.push({
        nombresApellidos,
        numeroDni,
        edad,
        numeroLicencia,
        categoria,
        subcategoria
      });
    } else {
      this.conductores[this.recordIndexToEditConductores].nombresApellidos = nombresApellidos;
      this.conductores[this.recordIndexToEditConductores].numeroDni = numeroDni;
      this.conductores[this.recordIndexToEditConductores].edad = edad;
      this.conductores[this.recordIndexToEditConductores].numeroLicencia = numeroLicencia;
      this.conductores[this.recordIndexToEditConductores].categoria = categoria;
      this.conductores[this.recordIndexToEditConductores].subcategoria = subcategoria;
    }

    this.clearConductorData();
  }

  private clearConductorData(){
    this.recordIndexToEditConductores = -1;

    this.formAnexo.controls.nombresApellidos.setValue('');
    this.formAnexo.controls.numeroDni.setValue('');
    this.formAnexo.controls.edad.setValue('');
    this.formAnexo.controls.numeroLicencia.setValue('');
    this.formAnexo.controls.categoria.setValue('');
    this.formAnexo.controls.subcategoria.setValue('');
    this.formAnexo.controls.categoriafija.setValue('');
    // this.filePdfCafSeleccionado = null;
    // this.visibleButtonCarf = false;
  }

  editConductor( conductor: any, i: number ){
    if (this.recordIndexToEditConductores !== -1){
      return;
    }

    this.recordIndexToEditConductores = i;

    this.formAnexo.controls.nombresApellidos.setValue(conductor.nombresApellidos);
    this.formAnexo.controls.numeroDni.setValue(conductor.numeroDni);
    this.formAnexo.controls.edad.setValue(conductor.edad);
    this.formAnexo.controls.numeroLicencia.setValue(conductor.numeroLicencia);
    this.formAnexo.controls.categoria.setValue(conductor.categoria);
    this.formAnexo.controls.subcategoria.setValue(conductor.subcategoria);
  }

  deleteConductor( conductor: any, i: number ){
    if (this.recordIndexToEditConductores === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.conductores.splice(i, 1);
        });
    }
  }

  onChangeInputCroquis(event) {
    if ( event.target.files.length === 0 ){
      return;
    }

    if ( event.target.files[0].type !== 'application/pdf' ) {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCroquisSeleccionado = event.target.files[0];
    event.target.value = "";
    this.filePdfCroquisPathName = null;
  }

  vistaPreviaPdfCroquis() {
    if (this.filePdfCroquisPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfCroquisPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCroquisSeleccionado = file;
          this.filePdfCroquisPathName = null;

          this.visualizarDialogoPdfCroquis();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarDialogoPdfCroquis();
    }
  };

  visualizarDialogoPdfCroquis() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCroquisSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Croquis";
  }

  onChangeInputCaf(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";

      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
    if(msg !== 'ok') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError(msg);
    }

    this.filePdfCafSeleccionado = event.target.files[0];
    console.log("====> "+this.filePdfCafSeleccionado);
    event.target.value = "";
    this.valCaf = 1;

  }

  onChangeInputCao(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
    if(msg !== 'ok') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError(msg);
    }

    this.filePdfCaoSeleccionado = event.target.files[0];
    event.target.value = "";
    this.valCao = 1;
  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onChangeCaf(event: boolean) {
    this.visibleButtonCaf = event;

    if (this.visibleButtonCaf === true) {
      this.visibleButtonCao = false;
      this.filePdfCaoSeleccionado = null;
      this.formAnexo.controls['cao'].setValue(false);
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCaf = false;
        this.formAnexo.controls['caf'].setValue(false);
      });
    } else {
      this.filePdfCafSeleccionado = null;
    }
  }

  onChangeCelular(event: boolean) {
    this.visibleButtonCelular = event;

    if (this.visibleButtonCelular === true) {
      // this.visibleButtonCelular = false;
      this.filePdfCelularSelecciona = null;

      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCelular = false;
        this.formAnexo.controls['adCelular'].setValue(false);

      });

    } else {
      this.filePdfCelularSelecciona = null;
    }
  }

  onChangeInputCelular(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCelularSelecciona = event.target.files[0];
    event.target.value = "";
    this.valCel = 1;
  }

  onChangeCao(event: boolean) {
    this.visibleButtonCao = event;

    if (this.visibleButtonCao === true) {
      this.visibleButtonCaf = false;
      this.filePdfCafSeleccionado = null;
      this.formAnexo.controls['caf'].setValue(false);
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCao = false;
        this.formAnexo.controls['cao'].setValue(false);
      });
    } else {
      this.filePdfCaoSeleccionado = null;
    }
  }

  onChangeInputInstalacion(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfInstalacionSeleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeRadioInstalacion() {

    const tipoInstalacion = this.formAnexo.controls['instalacion'].value;
    this.visibleButtonInstalacion = true;
    console.log(tipoInstalacion);
    if(tipoInstalacion===2){
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonInstalacion = false;
        this.formAnexo.controls['instalacion'].setValue('');
      });
    } else {
      this.visibleButtonInstalacion = false;
      this.filePdfInstalacionSeleccionado = null;
    }

  }

  // vistaPreviaCaf() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfCafSeleccionado);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = "Vista Previa - CAF";
  // }

  vistaPreviaCaf() {

    if (this.filePdfCafPathName === null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfCafSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento financiero";
  }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.filePdfCafPathName)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              // this.visualizarGrillaPdf(file, item.placaRodaje);
              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: "
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
     }

  }

  vistaPreviaCelular() {

    if (this.filePdfCelularPathName === null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfCelularSelecciona);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Celular";
  }else{

        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(this.filePdfCelularPathName)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Celular: "
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }

  }

  vistaPreviaCao() {

    if (this.filePdfCaoPathName === null){
      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(this.filePdfCaoSeleccionado);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
  }else{
    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.filePdfCaoPathName)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          // this.visualizarGrillaPdf(file, item.placaRodaje);
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento "
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
 }

  }

  buscarPlacaRodaje() {
    const placaRodaje = this.formAnexo.controls.placaRodaje.value.trim();
    if ( placaRodaje.length !== 6 )
      return;

    this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    this.renatService.validarEsDeFlotaOperativa(this.ruc,placaRodaje).subscribe( resp =>{

      if(resp == 0 && this.tupa2 && placaRodaje !== 'Z6I966'){// solo en DSTT-032
        this.funcionesMtcService.ocultarCargando();
        return this.funcionesMtcService.mensajeError('Vehículo no pertenece a la flota.');
      }else{
        this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
          respuesta => {
            this.funcionesMtcService.ocultarCargando();
            if(respuesta.categoria==="" || respuesta.categoria==="-"){
              return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
            }else{
              if(respuesta.categoria.charAt(0)=="O")
                this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '-');
              
              if(respuesta.categoria.charAt(0)=="N" || respuesta.categoria.charAt(0)=="M"){
                  if (respuesta.soat.estado === '')
                    return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
                  else 
                    if (respuesta.soat.estado !== 'VIGENTE')
                    return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                    
                    this.formAnexo.controls.soat.setValue(respuesta.soat.numero);
              }
            }
    
            let band:boolean = false;
            let placaNumero:string = "";
            if(respuesta.citvs.length>0){
              for (let placa of respuesta.citvs){
                if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud===this.codigoTipoSolicitud && i.tipoServicio==placa.tipoId)!=undefined){
                  placaNumero=placa.numero;
                  band=true;
                }
              }
              if(!band)
                return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
              else
                this.formAnexo.controls.citv.setValue(placaNumero || '(FALTANTE)');
            }else{
              if(respuesta.nuevo){
                this.formAnexo.controls['citv'].setValue(placaNumero || '-');                   
              }else{
                return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');     
              }
            }
            /* 
            if (placaRodaje !== 'Z6I966') {
              if (respuesta.soat.estado === '')
                return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
              if (respuesta.soat.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
              if (respuesta.citv.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
           
              if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud==this.codigoTipoSolicitud && i.tipoServicio==respuesta.citv.tipoId)==undefined){
                return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
              }
            }
            this.formAnexo.controls.soat.setValue(respuesta.soat.numero || '(FALTANTE)');
            this.formAnexo.controls.citv.setValue(respuesta.citv.numero || '(FALTANTE)');*/
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio');
          }
        );
      }
    },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      });
  }
  
  buscarRuta(){
    const ruc = this.ruc;
    var nroRuta = this.formAnexo.controls.nroRuta.value.trim();
    nroRuta = nroRuta.padStart(4 , 0);
    console.log("Nro de Ruta:"+nroRuta);

    this.renatService.GetRutas(this.ruc).subscribe( resp =>{
      if(resp == 0){  
        console.log('error');
        this.funcionesMtcService.ocultarCargando();
        return this.funcionesMtcService.mensajeError('No hay rutas registradas paraesta Empresa');
      }else{
        const rutas = JSON.parse(JSON.stringify(resp));
        console.log(rutas.find(i => i.codRuta === nroRuta));
        
        if (rutas.find(i => i.codRuta === nroRuta)==undefined){
          return this.funcionesMtcService.mensajeError('El número de ruta no se encuentra registrado.');
        }else{
          const ruta = rutas.find(i => i.codRuta === nroRuta);
          this.formAnexo.controls.origenRuta.setValue(ruta.origen_ruta);
          this.formAnexo.controls.destinoRuta.setValue(ruta.destino_ruta);
          this.formAnexo.controls.itinerario.setValue(ruta.itinerario);
          this.formAnexo.controls.escalasComerciales.setValue(ruta.escalacomercial);
          this.formAnexo.controls.frecuencias.setValue(ruta.desc_frecuencia);
          this.formAnexo.controls.diasSalida.setValue(ruta.diasSalida);
          this.formAnexo.controls.horasSalida.setValue(ruta.horario_salida);
          this.formAnexo.controls.modalidadServicio.setValue(ruta.cod_modalidad);
          this.formAnexo.controls.flotaOperativa.setValue(ruta.flota_operativa);
          this.formAnexo.controls.flotaReserva.setValue(ruta.flota_reserva);
          this.formAnexo.controls.vigencia_fechaini.setValue(ruta.vigencia_fechaini);
          this.formAnexo.controls.vigencia_fechafin.setValue(ruta.vigencia_fechafin);
        }
      }
    },
    error => {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar al servicio');
    });
  }

  changePlacaRodaje() {
    this.formAnexo.controls.soat.setValue('');
    this.formAnexo.controls.citv.setValue('');
  }

  cargarDatos(){
    setTimeout(() => {
      // this.funcionesMtcService.mostrarCargando();
      if (this.dataInput.rutaDocumento) {
        //RECUPERAMOS LOS DATOS
        // this.formularioTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(

          (dataFormulario: Anexo002_A17Response) => {
              console.log(JSON.parse(dataFormulario.metaData));

            this.funcionesMtcService.ocultarCargando();
            const metaData: any = JSON.parse(dataFormulario.metaData);

            this.idAnexo = dataFormulario.anexoId;

            // console.log(JSON.stringify(dataFormulario, null, 10));

            this.formAnexo.get("origenRuta").setValue(metaData.itinerario.origenRuta);
            this.formAnexo.get("destinoRuta").setValue(metaData.itinerario.destinoRuta);
            this.formAnexo.get("itinerario").setValue(metaData.itinerario.itinerario);
            this.formAnexo.get("escalasComerciales").setValue(metaData.itinerario.escalasComerciales);
            this.formAnexo.get("frecuencias").setValue(metaData.itinerario.frecuencias);
            this.formAnexo.get("diasSalida").setValue(metaData.itinerario.diasSalida);
            this.formAnexo.get("horasSalida").setValue(metaData.itinerario.horasSalida);
            this.formAnexo.get("modalidadServicio").setValue(metaData.itinerario.modalidadServicio.id);
            this.formAnexo.get("flotaOperativa").setValue(metaData.itinerario.flotaOperativa);

            this.formAnexo.get("flotaReserva").setValue(metaData.itinerario.flotaReserva);

            this.formAnexo.get("distancia").setValue(metaData.itinerario.distancia);
            this.formAnexo.get("tiempoAproxViaje").setValue(metaData.itinerario.tiempoAproxViaje);
            this.formAnexo.get("servicioHabilitar").setValue(metaData.itinerario.servicioHabilitar);

            this.formAnexo.get("plazoOperacion").setValue(metaData.itinerario.plazoOperacion);
            this.formAnexo.get("domicilio").setValue(metaData.renat.datosLocal.domicilio);

            this.formAnexo.get("instalacion").setValue(metaData.renat.instalacion);

            if(metaData.renat.datosLocal.departamento.id!=null){
              this.formAnexo.get("departamento").setValue(metaData.renat.datosLocal.departamento.id);
              this.idDep = metaData.renat.datosLocal.departamento.id;
              // this.ubigeoService.provincia(metaData.renat.datosLocal.departamento.id).subscribe(
              //   (dataProvincia) => {
              //     this.funcionesMtcService.ocultarCargando();
              //     this.listaProvincias = dataProvincia;

              //   },
              //   (error) => {
              //     this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
              //     // this.formulario.controls["nombreRepresentante"].enable();
              //     // this.formulario.controls["apePaternoRepresentante"].enable();
              //     // this.formulario.controls["apeMaternoRepresentante"].enable();
              //   }
              // );
              this.listaProvincia();
              if(metaData.renat.datosLocal.provincia.id!=null){
                this.formAnexo.get("provincia").setValue(metaData.renat.datosLocal.provincia.id);
                // this.formAnexo.get("direccion").setValue(metaData.renat.datosLocal.domicilio);
                this.idProv = metaData.renat.datosLocal.provincia.id;
                this.formAnexo.get("distrito").setValue(metaData.renat.datosLocal.distrito.id);
                this.listDistritos();
              }
            }
            
            this.pathPdfInstalacionSeleccionado = metaData.renat.datosLocal.pathName;

            if( metaData.renat.instalacion === 2 ){
              this.visibleButtonInstalacion = true;
            }

            this.filePdfCroquisPathName = metaData.itinerario.pathName

            for (var i = 0; i < metaData.renat.listaVehiculos.length; i++){
              this.vehiculos.push({
                placaRodaje: metaData.renat.listaVehiculos[i].placaRodaje,
                soat: metaData.renat.listaVehiculos[i].soat,
                citv: metaData.renat.listaVehiculos[i].citv,
                caf: metaData.renat.listaVehiculos[i].caf === true || metaData.renat.listaVehiculos[i].caf === 'true' ? true : false,
                cao: metaData.renat.listaVehiculos[i].cao === true || metaData.renat.listaVehiculos[i].cao === 'true' ? true : false,
                pathNameCaf: metaData.renat.listaVehiculos[i].pathNameCaf,
                pathNameCao: metaData.renat.listaVehiculos[i].pathNameCao,
                fileCaf: null, //metaData.renat.listaVehiculos[i].fileCaf,
                fileCao: null,
                celular: metaData.renat.listaVehiculos[i].celular,
                adCelular: metaData.renat.listaVehiculos[i].adCelular,
                fileCelular: null,
                pathNameCelular: metaData.renat.listaVehiculos[i].pathNameCelular,
              });
            }

            if(metaData.relacionConductores!=null){
              for (let j = 0; j < metaData.relacionConductores.length; j++) {
                this.conductores.push({
                  numeroDni: metaData.relacionConductores[j].numeroDni,
                  nombresApellidos: metaData.relacionConductores[j].nombresApellidos,
                  edad: metaData.relacionConductores[j].edad,
                  numeroLicencia: metaData.relacionConductores[j].numeroLicencia,
                  categoria: metaData.relacionConductores[j].categoria,
                  subcategoria : metaData.relacionConductores[j].subCategoria
                });
              }
            }
          },

          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del anexo');
          });
      }
    });
  }

  departamentos(){
    this.ubigeoService.departamento().subscribe(
      (dataDepartamento) => {
        this.listaDepartamentos = dataDepartamento;
        this.funcionesMtcService.ocultarCargando();
      },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de los departamentos');
        });
  }

  save(){

    if(this.formAnexo.controls['instalacion'].value === 2){
      if (this.filePdfInstalacionSeleccionado === null && this.pathPdfInstalacionSeleccionado === null)
        return this.funcionesMtcService.mensajeError('Debe ingresar el contrato de arrendamiento');
    }
    /*  
    if (!this.filePdfCroquisSeleccionado && !this.filePdfCroquisPathName && this.codigoProcedimientoTupa !== this._TUPA)
      return this.funcionesMtcService.mensajeError('Debe ingresar un croquis');
    */
    
    if (this.vehiculos.length < this.cantidadVehiculo )
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos ' + this.cantidadVehiculo + '  flota  vehicular');
    
    if (this.conductores.length === 0 && !this.opcionalRelacionConductores)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota de conductores');

    // if (this.conductores.length === 0)
    //   return this.funcionesMtcService.mensajeError('Debe ingresar al menos un conductor vehicular');

    const dataGuardar: Anexo002_A17Request = new Anexo002_A17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    // SECCION (itinerario):
    const itinerario: A002_A17_Seccion_Itinerario = new A002_A17_Seccion_Itinerario();
    const modalidadServicio: ModalidadServicio = new ModalidadServicio();

    if(this.codigoProcedimientoTupa !== this._TUPA){
      itinerario.escalasComerciales = this.formAnexo.get('escalasComerciales').value;
      itinerario.frecuencias = this.formAnexo.get('frecuencias').value;
      itinerario.diasSalida = this.formAnexo.get('diasSalida').value;
      itinerario.horasSalida = this.formAnexo.get('horasSalida').value;
      itinerario.distancia = this.formAnexo.get('distancia').value;
      itinerario.tiempoAproxViaje = this.formAnexo.get('tiempoAproxViaje').value;
      itinerario.servicioHabilitar = this.formAnexo.get('servicioHabilitar').value;
      itinerario.plazoOperacion = this.formAnexo.get('plazoOperacion').value;
      
      modalidadServicio.id = this.formAnexo.controls['modalidadServicio'].value;
      modalidadServicio.descripcion = this.listaModalServicio.filter(item => item.id ==  this.formAnexo.get('modalidadServicio').value)[0].descripcion;
    }

    itinerario.origenRuta = this.formAnexo.get('origenRuta').value;
    itinerario.destinoRuta = this.formAnexo.get('destinoRuta').value;
    itinerario.itinerario = this.formAnexo.get('itinerario').value;
    
    itinerario.horasSalida = this.formAnexo.get('horasSalida').value;
    itinerario.archivoAdjunto = this.fileToUpload;
    
    itinerario.modalidadServicio = modalidadServicio;

    itinerario.flotaOperativa = this.formAnexo.get('flotaOperativa').value;
    itinerario.flotaReserva = this.formAnexo.get('flotaReserva').value;
    
    itinerario.archivoAdjunto = this.filePdfCroquisSeleccionado ? this.filePdfCroquisSeleccionado : null;
    itinerario.pathName = this.filePdfCroquisPathName;
    console.log(">>>> "+itinerario.pathName);

    dataGuardar.metaData.itinerario = itinerario;

    // SECCION (renat):
    const renat : A002_A17_Seccion_Renat = new A002_A17_Seccion_Renat();

    renat.listaVehiculos = this.vehiculos.map(vehiculo => {
      return {
        caf: vehiculo.caf,
        cao: vehiculo.cao,
        placaRodaje: vehiculo.placaRodaje,
        soat: vehiculo.soat,
        citv: vehiculo.citv,
        fileCaf: vehiculo.fileCaf,
        fileCao: vehiculo.fileCao,
        pathNameCaf: vehiculo.pathNameCaf,
        pathNameCao: vehiculo.pathNameCao,
        celular: vehiculo.celular,
        adCelular: vehiculo.adCelular,
        fileCelular: vehiculo.fileCelular,
        pathNameCelular: vehiculo.pathNameCelular
      } as Vehiculo
    });

    const datosLocal: DatosLocal = new DatosLocal();
    
    renat.instalacion =  this.formAnexo.get('instalacion').value;
    datosLocal.domicilio = this.formAnexo.get('domicilio').value;
    const departamento: UbigeoResponse = new UbigeoResponse();
    const provincia: UbigeoResponse = new UbigeoResponse();
    const distrito: UbigeoResponse = new UbigeoResponse();
    datosLocal.pdfArrendamiento = this.filePdfInstalacionSeleccionado;
    datosLocal.pathName = this.pathPdfInstalacionSeleccionado;

    if(this.opcionalInstalacionAdministrativa){
      if(renat.instalacion===1 || renat.instalacion===2){
        datosLocal.distrito = this.formAnexo.get('distrito').value;
        datosLocal.provincia = this.formAnexo.get('provincia').value;
       
        departamento.id = this.formAnexo.get('departamento').value;
        departamento.descripcion = this.listaDepartamentos.filter(item => item.value ==  this.formAnexo.get('departamento').value)[0].text;

        provincia.id = this.formAnexo.get('provincia').value;
        provincia.descripcion = this.listaProvincias.filter(item => item.value ==  this.formAnexo.get('provincia').value)[0].text;

        distrito.id = this.formAnexo.get('distrito').value;
        distrito.descripcion = this.listaDistritos.filter(item => item.value ==  this.formAnexo.get('distrito').value)[0].text;
      
        datosLocal.departamento = departamento;
        datosLocal.provincia = provincia;
        datosLocal.distrito = distrito;
      }else{
        datosLocal.departamento = departamento;
        datosLocal.provincia = provincia;
        datosLocal.distrito = distrito;
      }
    }else{
      datosLocal.distrito = this.formAnexo.get('distrito').value;
      datosLocal.provincia = this.formAnexo.get('provincia').value;
     
      departamento.id = this.formAnexo.get('departamento').value;
      departamento.descripcion = this.listaDepartamentos.filter(item => item.value ==  this.formAnexo.get('departamento').value)[0].text;

      provincia.id = this.formAnexo.get('provincia').value;
      provincia.descripcion = this.listaProvincias.filter(item => item.value ==  this.formAnexo.get('provincia').value)[0].text;

      distrito.id = this.formAnexo.get('distrito').value;
      distrito.descripcion = this.listaDistritos.filter(item => item.value ==  this.formAnexo.get('distrito').value)[0].text;
    
      datosLocal.departamento = departamento;
      datosLocal.provincia = provincia;
      datosLocal.distrito = distrito;
    }
    renat.datosLocal = datosLocal;
    dataGuardar.metaData.renat = renat;

    // SECCION (Relación de Conductores)
    const relacionConductores: Conductor[] = this.conductores.map(conductor => {
      return {
        numeroDni: conductor.numeroDni,
        nombresApellidos: conductor.nombresApellidos,
        edad: conductor.edad.toString(),
        numeroLicencia: conductor.numeroLicencia,
        categoria: conductor.categoria,
        subcategoria:  conductor.subcategoria
      } as Conductor
    });

    dataGuardar.metaData.relacionConductores = relacionConductores;

    console.log(JSON.stringify(dataGuardar, null, 10));
    console.log(JSON.stringify(dataGuardar));

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    // console.log('dataGuardarFormData',dataGuardarFormData);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
          //this.anexoService.post<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
                this.uriArchivo = data.uriArchivo;
                this.graboUsuario = true;

                if(this.tupa2){
                  this.addServTemEmp();
                }
              
                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else {
          //MODIFICAR
          for (let i = 0; i < this.dataRequisitosInput.length; i++) {

            // if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
              // if (this.dataRequisitosInput[i].movId === 0) {
              //   this.activeModal.close(this.graboUsuario);
              //   this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
              //   return;
              // }
            // }

            if(this.dataRequisitosInput[i].codigoFormAnexo=='ANEXO_002_B17' || this.dataRequisitosInput[i].codigoFormAnexo=='ANEXO_002_E17'){
              this.codAnexo = this.dataRequisitosInput[i].codigoFormAnexo;
              this.reqAnexo = this.dataRequisitosInput[i].tramiteReqId;
              console.log("======> "+this.reqAnexo );
              // if(this.dataRequisitosInput[i].movId > 0){
                this.movIdAnexo = this.dataRequisitosInput[i].movId;
                // this.activeModal.close(this.graboUsuario);
                // this.funcionesMtcService.mensajeError('Debe completar el '+this.dataRequisitosInput[i].codigoFormAnexo);
                // return;

              // }
          }

        }

        if(this.movIdAnexo > 0){
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService.mensajeConfirmar("Deberá volver a grabar el anexo " + this.codAnexo + "¿Desea continuar?")
          .then(() => {

            //MODIFICAR
          this.anexoService.put<any>(dataGuardarFormData)
          // this.anexoService.put<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
                this.uriArchivo = data.uriArchivo;
                this.graboUsuario = true;
                this.formularioTramiteService.uriArchivo<any>(this.movIdAnexo)
                          .subscribe(
                            data => {
                              this.funcionesMtcService.ocultarCargando();
                            },
                            error => {
                              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                            }
                          );
                this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
            );

          });
        }else{

          this.anexoService.put<any>(dataGuardarFormData)
          // this.anexoService.put<any>(dataGuardar)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
                this.uriArchivo = data.uriArchivo;
                this.graboUsuario = true;

                this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos del anexo');
              }
            );

        }
      }
    });
  }

  buscarNumeroLicencia(dato :DatosPersona) {

    const tipoDocumento: number = 2;
    const numeroDocumento: string = this.formAnexo.controls['numeroDni'].value.trim();
    
    if (tipoDocumento === 2 && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres (Licencia)');
      
    this.funcionesMtcService.mostrarCargando();
      this.mtcService.getLicenciasConducir(tipoDocumento,numeroDocumento).subscribe(
        respuesta => {
            this.funcionesMtcService.ocultarCargando();
            const datos :any = respuesta[0];
            console.log("DATOS",JSON.stringify(datos, null, 10));
            
            //console.log(JSON.stringify(JSON.parse(datos), null, 10));
            //console.log(JSON.parse(datos));

            if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ01' )
              return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');

            if (datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ02' || datos.GetDatosLicenciaMTCResult.CodigoRespuesta === 'MSJ03')
              return this.funcionesMtcService.mensajeError('El número de documento no cuenta con licencia de conducir');

            if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida')
              return this.funcionesMtcService.mensajeError('Su licencia esta  Vencida');
            
            if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Bloqueado')
              return this.funcionesMtcService.mensajeError('Su licencia esta  Bloqueado');

              if(datos.GetDatosLicenciaMTCResult.Licencia.Categoria !== 'A IIIc')
              return this.funcionesMtcService.mensajeError("No es Categoría A IIIc");

              this.addPersona(`${dato.apPrimer} ${dato.apSegundo} ${dato.prenombres}`, dato.direccion);
              // if (datos.GetDatosLicenciaMTCResult.Licencia.Estadolicencia === 'Vencida')
              // return this.funcionesMtcService.mensajeError('Su licencia esta  Vencida');


            this.formAnexo.controls['numeroLicencia'].setValue(datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim()); 
            this.formAnexo.controls['categoriafija'].setValue("A IIIc");
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio MTC Licencias Conducir');
        }
      );  
  }

  validaAutorizacion(){
    // this.formAnexo.get("fechaIni").setValue("01-01-2021");
    // var fechainii = this.formAnexo.get('fechaIni').value;
   // console.log("fecha inicio" , )
    this.viewBar  = false;
/*
    this.renatService.ObtenerVigenciaAutorizacion(this.ruc).subscribe((data :any) => {
      console.log("infoautorizacion", data);

      if(data ==0){
        this.mensajeAutorizacion ="La empresa no cuenta con autorización vigente.";
        this.viewBar  = true;
      }
    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
    });*/
  }

  addServTemEmp(){

    this.RequestServTempEmp = new ServTempEmp();

    
    this.RequestServTempEmp.fechinicioVigencia =  this.fechaIni;
    this.RequestServTempEmp.fechFinVigencia = this.fechaFin;
    this.RequestServTempEmp.numdocsolicitante = this.ruc;
    this.RequestServTempEmp.rucempresatrans = this.ruc;
    this.RequestServTempEmp.usuCreacion   = "USU-000"
    

    this.renatService.addServTemEmp(this.RequestServTempEmp).subscribe((data :any) => {


    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
    });
  }

  validacionRenat(){
    //console.log("DATAINPUT" , this.dataInput);

    //this.validaAutorizacion();

    this.renatService.obtainFlotaReserva(this.ruc).subscribe((data :any) => {

      console.log("infoflota", data);
      this.formAnexo.get("flotaOperativa").setValue(data.flotaoper);

      this.formAnexo.get("flotaReserva").setValue(data.flotareserva);

    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener la flota de reserva');
    });



  }

  validaConductor(dato :DatosPersona) {
    var dni = this.formAnexo.get('numeroDni').value;
    this.renatService.estaEnNomina(this.ruc,dni).subscribe((data :any) => {

      if(data === 0){
        return this.funcionesMtcService.mensajeError('Conductor no está en nómina');
      }

      this.buscarNumeroLicencia(dato);

      

    },error =>{
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas al consultar servicio.');
    });


  }

  vistaPreviaInstalacion() {

    if (this.pathPdfInstalacionSeleccionado === null){

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfInstalacionSeleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
    }else{

      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfInstalacionSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  descargarPdf() {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      //this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-A/17";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  formInvalid(control: string) {
    return this.formAnexo.get(control).invalid &&
      (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }
}
