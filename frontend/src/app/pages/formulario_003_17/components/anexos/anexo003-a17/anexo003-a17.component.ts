import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { NgbActiveModal, NgbAccordionDirective ,NgbModal,NgbDateStruct,NgbDatepickerI18n, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Anexo003A17Service } from 'src/app/core/services/anexos/anexo003-a17.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { MtcService } from 'src/app/core/services/servicios/mtc.service';
import { Vehiculos,Conductores, A003_A17_Seccion1, A003_A17_Seccion2, A003_A17_Seccion3} from 'src/app/core/models/Anexos/Anexo003_A17/Secciones';
import { Anexo003_A17Request } from 'src/app/core/models/Anexos/Anexo003_A17/Anexo003_A17Request';
import { Anexo003_A17Response } from 'src/app/core/models/Anexos/Anexo003_A17/Anexo003_A17Response';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
  selector: 'app-anexo003-a17',
  templateUrl: './anexo003-a17.component.html',
  styleUrls: ['./anexo003-a17.component.css']
})

export class Anexo003A17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  
  txt_opcional: string = '(OPCIONAL)'; 
  paRelacionConductores: string[]=["DSTT-037"];
  
  opcionalRelacionConductores: boolean=true;
 
  graboUsuario: boolean = false;

  uriArchivo: string = ''; 
  tramiteReqId: number = 0;
  errorAlCargarData: boolean = false;

  codigoTupa: string='';
  descripcionTupa: String='';
  
  anexo:UntypedFormGroup;
  tituloAnexo='SERVICIO DE TRANSPORTE TERRESTRE DE ÁMBITO NACIONAL';
  submitted=false;
  
  paTipoServicio = [
    {"pa":"DSTT-037","tipoServicio":"3"},
    {"pa":"DSTT-038","tipoServicio":"4"}
   ];

  paCategoriaM1:string[]=["DSTT-037"];
  mostrarCategoriaM1: boolean=true;

  listaCategorias: any[]=[
      {value: '',   text:'Selecciona'},
      {value: 'M1', text:'M1'},
      {value: 'M2', text:'M2'},
      {value: 'M3', text:'M3'}
  ]

  listaFlotaVehicular: Vehiculos[] = [];
  listaConductores: Conductores[] = [];


  indexEditTabla: number = -1;
  idFormularioMovimiento: number = 18;
  idAnexoMovimiento=0
  
  //listaFlotaVehicular: A001_A17_Seccion4[] = [];

  //CARGA PDF
  filePdfCroquisSeleccionado: any = null;
  filePdfCroquisPathName: string = null;

  visibleButtonCaf: boolean=false;
  filePdfCafSeleccionado: any =null;
  filePdfCafPathName: string=null;

  visibleButtonCao: boolean=false;
  filePdfCaoSeleccionado: any =null;
  filePdfCaoPathName: string=null;

  caf_vinculado: string='' ;
/*
  addVehiculos(){
    console.log("Agrego Vehículo") ;
    
    if (
      this.anexo.controls['placaRodaje'].value.trim() === '' ||
      this.anexo.controls['soat'].value.trim() === ''  ||
      this.anexo.controls['citv'].value.trim() === ''       
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }
    const placaRodaje = this.anexo.controls['placaRodaje'].value.trim().toUpperCase();
    const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      this.listaFlotaVehicular.push({
        placaRodaje: placaRodaje,
        soat: this.anexo.controls['soat'].value,
        citv: this.anexo.controls['citv'].value,
        caf: this.anexo.controls['caf'].value,
        cao: this.anexo.controls['cao'].value,
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;    
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexo.controls['soat'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexo.controls['citv'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexo.controls['caf'].value;
      this.listaFlotaVehicular[this.indexEditTabla].cao = this.anexo.controls['cao'].value;
    }

    this.limpiarCamposVehiculo();
    console.log(this.listaFlotaVehicular);
   }*/


  agregarFlotaVehicular(){
     
    console.log("caf seleccionado"+this.filePdfCafSeleccionado);
    console.log(this.filePdfCafPathName);
    console.log("cao seleccionado"+this.filePdfCaoSeleccionado);
    console.log(this.filePdfCaoPathName);

    if (
      this.anexo.controls['placaRodaje'].value.trim() === '' ||
      this.anexo.controls['soat'].value.trim() === '' ||
      this.anexo.controls['citv'].value.trim() === ''    
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    if (this.anexo.controls['caf'].value === true /*|| this.filePdfCafSeleccionado === null*/){ //|| this.anexo.controls['vinculadoForm'].value === true*/) {
      if (this.filePdfCafSeleccionado === null)
        return this.funcionesMtcService.mensajeError('Debe cargar un CAF archivo PDF ');
    }

    if (this.anexo.controls['cao'].value === true /*&& this.filePdfCaoSeleccionado === null*/){
      if (this.filePdfCaoSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado C.A.O, debe cargar un archivo PDF');
    }
    const placaRodaje = this.anexo.controls['placaRodaje'].value.trim().toUpperCase();
    const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

    //Validamos que la placa de rodaje no esté incluida en la grilla
    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      console.log("segunda caf seleccionado"+this.filePdfCafSeleccionado);
      console.log(this.filePdfCafPathName);
      console.log("cao seleccionado"+this.filePdfCaoSeleccionado);
      console.log(this.filePdfCaoPathName);
  
      this.listaFlotaVehicular.push({
        placaRodaje: placaRodaje,
        soat: this.anexo.controls['soat'].value,
        citv: this.anexo.controls['citv'].value,
        caf: this.anexo.controls['caf'].value,
        cao: this.anexo.controls['cao'].value,
        fileCaf: this.filePdfCafSeleccionado,
        fileCao: this.filePdfCaoSeleccionado,
        pathNameCaf: this.filePdfCafPathName,
        pathNameCao: this.filePdfCaoPathName,
        /*vinculado: this.anexo.controls['vinculadoForm'].value,
        anioFabricacion: this.anexo.controls['anioFabForm'].value,
        chasis: this.anexo.controls['chasisForm'].value,
        marca: this.anexo.controls['marcaForm'].value,
        modelo: this.anexo.controls['modeloForm'].value,*/
        
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexo.controls['soat'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexo.controls['citv'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexo.controls['caf'].value;
      this.listaFlotaVehicular[this.indexEditTabla].cao = this.anexo.controls['cao'].value;
      //this.listaFlotaVehicular[this.indexEditTabla].vinculado = this.anexoFormulario.controls['vinculadoForm'].value;
      //this.listaFlotaVehicular[this.indexEditTabla].anioFabricacion = this.anexoFormulario.controls['anioFabForm'].value;
      //this.listaFlotaVehicular[this.indexEditTabla].chasis = this.anexoFormulario.controls['chasisForm'].value;
      //this.listaFlotaVehicular[this.indexEditTabla].marca = this.anexoFormulario.controls['marcaForm'].value;
      //this.listaFlotaVehicular[this.indexEditTabla].modelo = this.anexoFormulario.controls['modeloForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].fileCaf = this.filePdfCafSeleccionado;
      this.listaFlotaVehicular[this.indexEditTabla].fileCao = this.filePdfCaoSeleccionado;
      this.listaFlotaVehicular[this.indexEditTabla].pathNameCaf = this.filePdfCafPathName;
      this.listaFlotaVehicular[this.indexEditTabla].pathNameCao = this.filePdfCaoPathName;
    }

    this.limpiarCamposVehiculo();
    console.log(this.listaFlotaVehicular);
  }

  limpiarCamposVehiculo(){
    this.anexo.controls['placaRodaje'].setValue('');
    this.anexo.controls['soat'].setValue('');
    this.anexo.controls['citv'].setValue('');
    this.anexo.controls['caf'].setValue(false);
    this.anexo.controls['cao'].setValue(false);

    
    this.filePdfCafSeleccionado=null;
    this.filePdfCafPathName=null;
    
    this.filePdfCaoSeleccionado=null;
    this.filePdfCaoPathName=null;

    this.caf_vinculado='';
    this.visibleButtonCaf=false;
    this.visibleButtonCao=false;
  }

  eliminarVehiculo(index){
    this.funcionesMtcService
    .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
    .then(() => {
      this.listaFlotaVehicular.splice(index, 1);
    });
  }

  eliminarFlotaVehicular(item: Vehiculos, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  modificarFlotaVehicular(item: Vehiculos, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexo.controls['placaRodaje'].setValue(item.placaRodaje);
    this.anexo.controls['soat'].setValue(item.soat);
    this.anexo.controls['citv'].setValue(item.citv);
    this.anexo.controls['caf'].setValue(item.caf);
    this.anexo.controls['cao'].setValue(item.cao);

    //this.visibleButtonCaf = item.caf === true; // || item.vinculado === true ? true : false
    this.visibleButtonCaf = item.caf;
    this.visibleButtonCao = item.cao;
    
    this.filePdfCafSeleccionado = item.fileCaf;
    this.filePdfCafPathName = item.pathNameCaf;
    this.filePdfCaoSeleccionado = item.fileCao;
    this.filePdfCaoPathName = item.pathNameCao;
  }

  buscarNumeroLicencia() {

    const tipoDocumento: number = 2;
    const numeroDocumento: string = this.anexo.controls['nroDni'].value.trim();
    
    if (tipoDocumento === 2 && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres (Licencia)');
      
    this.funcionesMtcService.mostrarCargando();
      this.mtcService.getLicenciasConducir(tipoDocumento,numeroDocumento).subscribe(
        respuesta => {
            this.funcionesMtcService.ocultarCargando();
            const datos :any = respuesta[0];
            console.log(JSON.stringify(datos, null, 10));
            
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

            this.anexo.controls['nroLicencia'].setValue(datos.GetDatosLicenciaMTCResult.Licencia.NroLicencia.trim()); 
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar el Servicio MTC Licencias Conducir');
        }
      );  
  }
     
  addConductores(){
    console.log("Agrego Conductores") ;
    
    if (
      this.anexo.controls['nroDni'].value.trim() === '' ||
      this.anexo.controls['nombresApellidos'].value.trim() === '' ||
      this.anexo.controls['edad'].value.trim() === ''  ||
      this.anexo.controls['nroLicencia'].value.trim() === '' ||
      this.anexo.controls['categoria'].value.trim() === '' 
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    if (this.anexo.controls['edad'].value <18 || this.anexo.controls['edad'].value>80)
      return this.funcionesMtcService.mensajeError('Debe ingresar edad entra 18 y 80');

    const nroDni = this.anexo.controls['nroDni'].value.trim().toUpperCase();
    const indexFind = this.listaConductores.findIndex(item => item.nroDni === nroDni);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El conductor ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      this.listaConductores.push({
        nroDni: nroDni,
        nombres: this.anexo.controls['nombres'].value,
        ape_Paterno: this.anexo.controls['apellidoPaterno'].value,
        ape_Materno: this.anexo.controls['apellidoMaterno'].value,
        nombresApellidos: this.anexo.controls['nombresApellidos'].value,
        edad: this.anexo.controls['edad'].value,
        nroLicencia: this.anexo.controls['nroLicencia'].value,
        categoria: this.anexo.controls['categoria'].value                  
      });
    } else {
      this.listaConductores[this.indexEditTabla].nroDni = nroDni;
      this.listaConductores[this.indexEditTabla].nombres = this.anexo.controls['nombres'].value;
      this.listaConductores[this.indexEditTabla].ape_Paterno = this.anexo.controls['apellidoPaterno'].value;
      this.listaConductores[this.indexEditTabla].ape_Materno = this.anexo.controls['apellidoMaterno'].value;
      this.listaConductores[this.indexEditTabla].nombresApellidos = this.anexo.controls['nombresApellidos'].value;
      this.listaConductores[this.indexEditTabla].edad = this.anexo.controls['edad'].value;
      this.listaConductores[this.indexEditTabla].nroLicencia = this.anexo.controls['nroLicencia'].value;
      this.listaConductores[this.indexEditTabla].categoria =  this.anexo.controls['categoria'].value;        
    }

    this.limpiarCamposConductor();
    console.log(this.listaConductores);
  }

  limpiarCamposConductor(){
    this.anexo.controls['nroDni'].setValue('');
    this.anexo.controls['nombres'].setValue('');
    this.anexo.controls['apellidoPaterno'].setValue('');
    this.anexo.controls['apellidoMaterno'].setValue('');
    this.anexo.controls['nombresApellidos'].setValue('');
    this.anexo.controls['edad'].setValue('');
    this.anexo.controls['nroLicencia'].setValue('');
    this.anexo.controls['categoria'].setValue(0);
  }

  eliminarConductor(index){
    this.funcionesMtcService
    .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
    .then(() => {
      this.listaConductores.splice(index, 1);
    });
  }
  
  changePlacaRodaje() {
    this.anexo.controls['soat'].setValue('');
    this.anexo.controls['citv'].setValue('');
    this.anexo.controls['caf'].setValue(false);
    this.anexo.controls['cao'].setValue(false);
    this.visibleButtonCaf=false;
    this.visibleButtonCao=false;
    //this.anexo.controls[].setValue(false);
    /*
    this.anexoFormulario.controls['anioFabForm'].setValue('');
    this.anexoFormulario.controls['chasisForm'].setValue('');
    this.anexoFormulario.controls['marcaForm'].setValue('');
    this.anexoFormulario.controls['modeloForm'].setValue('');
    */
  }

  buscarPlacaRodaje() {
    const placaRodaje = this.anexo.controls['placaRodaje'].value.trim();
    if (placaRodaje.length !== 6)
      return;

    this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();
        /*
        if (respuesta.soat.estado === '')
          return this.funcionesMtcService.mensajeError('Placa de rodaje no encontrada');
        
        if (respuesta.soat.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
       
       if (respuesta.citv.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
        if (respuesta.citv.tipo !== '(OFERTADO)')
          return this.funcionesMtcService.mensajeError('El número de CITV no cuenta con un servicio "OFERTADO"');
        

        this.anexo.controls['soat'].setValue(respuesta.soat.numero);
        this.anexo.controls['citv'].setValue(respuesta.citv.numero);*/
        /*this.anexoFormulario.controls['anioFabForm'].setValue(respuesta.anioModelo || respuesta.anioFabricacion || '(FALTANTE)');
        this.anexoFormulario.controls['chasisForm'].setValue(respuesta.chasis || '(FALTANTE)');
        this.anexoFormulario.controls['marcaForm'].setValue(respuesta.marca || '(FALTANTE)');
        this.anexoFormulario.controls['modeloForm'].setValue(respuesta.modelo || '(FALTANTE)');
        */
        if(respuesta.categoria==="" || respuesta.categoria==="-"){
          return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
        }else{
          if(respuesta.categoria.charAt(0)=="O")
            this.anexo.controls.soat.setValue(respuesta.soat.numero || '-');
          
          if(respuesta.categoria.charAt(0)=="N"){
              if (respuesta.soat.estado === '')
                return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
              else 
                if (respuesta.soat.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                
                this.anexo.controls.soat.setValue(respuesta.soat.numero);
          }
        }

        let band:boolean = false;
        let placaNumero:string = "";
        if(respuesta.citvs.length>0){
          for (let placa of respuesta.citvs){
            if (this.paTipoServicio.find(i => i.pa === this.codigoTupa &&  i.tipoServicio==placa.tipoId)!=undefined){
              placaNumero=placa.numero;
              band=true;
            }
          }
          if(!band)
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
          else
            this.anexo.controls.citv.setValue(placaNumero || '(FALTANTE)');
        }else{
          return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');
        }
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );


    // this.funcionesMtcService.mostrarCargando();
    // setTimeout(() => {
    //   this.funcionesMtcService.ocultarCargando();
    //   this.anexoFormulario.controls['citvForm'].setValue('SDFH5SS5');
    //   this.anexoFormulario.controls['anioFabForm'].setValue('2015');
    //   this.anexoFormulario.controls['chasisForm'].setValue('GRET651651651');
    //   this.anexoFormulario.controls['marcaForm'].setValue('MERCEDZ BENZ');
    //   this.anexoFormulario.controls['modeloForm'].setValue('BLUE EFICIENCY');
    // }, 1000);
  }
   
  formInvalid(control: string) {
    return this.anexo.get(control).invalid &&
      (this.anexo.get(control).dirty || this.anexo.get(control).touched);
  }
   
  @ViewChild('acc') acc: NgbAccordionDirective ;
  
  constructor(
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo003A17Service,
    private modalService: NgbModal,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private reniecService: ReniecService,
    private mtcService: MtcService,
    private formularioTramiteService: FormularioTramiteService,

  ) { 
    this.anexo=this.fb.group({
      ambitoOperacion:['',[Validators.required,Validators.minLength(5), Validators.maxLength(170)]] ,
      placaRodaje:[''],
      soat:{value:'',disabled:true},
      citv:{value:'',disabled:true},
      caf:[false],
      cao:[false],
      nroDni:[''],
      nombresApellidos:{value:'',disabled:true},
      nombres:[''],
      apellidoPaterno:[''],
      apellidoMaterno:[''],
      edad:[''],
      nroLicencia:[''],//{value:'',disabled:true},
      categoria:[''],
      dia:[],
      mes:[],
      anio:[],
      nombresRepresentante:[],
      ap_paternoRepresentante:[],
      ap_maternoRepresentante:[],
      nombresApellidosRepresentante:[],
    })
  }
  
  get form() {return this.anexo.controls;}

  
  soloNumeros(event){
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    
    this.anexo.controls['nombresApellidos'].setValue('');
    this.anexo.controls['nroLicencia'].setValue('');
    this.anexo.controls['edad'].setValue('');
  }

  soloNumeros_edad(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  buscarDNI(){
  const tipoDocumento: string = '01';    //this.formulario.controls['cod_identidad_representante'].value.trim();
  const numeroDocumento: string = this.anexo.controls['nroDni'].value.trim();

  

  if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
    return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
  if (tipoDocumento === '01' && numeroDocumento.length !== 8)
    return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

  this.funcionesMtcService.mostrarCargando();

  if (tipoDocumento === '01') {//DNI
    this.reniecService.getDni(numeroDocumento).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
          return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

        const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
        const nombre_aux=datosPersona.prenombres+' '+ datosPersona.apPrimer + ' ' + datosPersona.apSegundo;
        this.anexo.controls['nombres'].setValue(datosPersona.prenombres);
        this.anexo.controls['apellidoPaterno'].setValue(datosPersona.apPrimer);
        this.anexo.controls['apellidoMaterno'].setValue(datosPersona.apSegundo);
        this.anexo.controls['nombresApellidos'].setValue(nombre_aux);
        //this.buscarNumeroLicencia();
        //this.datos.nombre_representante= nombre_aux;
        //this.anexo.controls['domicilio_representante'].setValue(datosPersona.direccion);

      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
      );
    } 
    this.buscarNumeroLicencia();

  }

  guardarAnexo() {

    console.log("Iniciamos el guardado de datos en sistema");
    
    if (this.anexo.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    if (this.listaFlotaVehicular.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
    
    
    if (this.listaConductores.length === 0 && !this.opcionalRelacionConductores)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una lista de Conductores');


    let dataGuardar: Anexo003_A17Request = new Anexo003_A17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexoMovimiento;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    
    //SECCION 1:
    let seccion1: A003_A17_Seccion1 = new A003_A17_Seccion1();
    seccion1.ambitoOperacion=this.anexo.controls['ambitoOperacion'].value;
    seccion1.dia=this.getDia();
    seccion1.mes=this.getMes();
    seccion1.anio=this.getAnio();
    seccion1.nombres=this.anexo.controls['nombresRepresentante'].value;
    seccion1.ap_paterno=this.anexo.controls['ap_paternoRepresentante'].value;
    seccion1.ap_materno=this.anexo.controls['ap_maternoRepresentante'].value;
    seccion1.nombresApellidos=this.anexo.controls['nombresApellidosRepresentante'].value;
    dataGuardar.metaData.seccion1 = seccion1;

    let seccion2: A003_A17_Seccion2=new A003_A17_Seccion2();
    seccion2.vehiculos=this.listaFlotaVehicular.map(item => {
      return {
        placaRodaje: item.placaRodaje,
        soat: item.soat,
        citv: item.citv,
        caf: item.caf,
        cao: item.cao,
        fileCaf: item.fileCaf,
        fileCao: item.fileCao,
        pathNameCaf: item.pathNameCaf,
        pathNameCao: item.pathNameCao,
      } as Vehiculos
    });    
    seccion2.pdfCroquis=this.filePdfCroquisSeleccionado;
    seccion2.pathNameCroquis=this.filePdfCroquisPathName;
    dataGuardar.metaData.seccion2 = seccion2;

    let seccion3: A003_A17_Seccion3= new A003_A17_Seccion3();
    seccion3.conductores=this.listaConductores.map(item => {
      return {
        nroDni: item.nroDni,
        nombresApellidos: item.nombresApellidos,
        ape_Paterno: item.ape_Paterno,
        ape_Materno: item.ape_Materno,
        nombres: item.nombres,
        edad: item.edad,
        nroLicencia: item.nroLicencia,
        categoria: item.categoria,
      } as Conductores
    });    
    dataGuardar.metaData.seccion3 = seccion3;

    console.log(JSON.stringify(dataGuardar));
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
       
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexoMovimiento === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexoMovimiento = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;
                this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
              }
            );
        } else {
          //MODIFICAR
          this.anexoService.put<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexoMovimiento = data.id;
                this.uriArchivo = data.uriArchivo;

                this.graboUsuario = true;
                this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
              },
              error => {
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
            );
        }
      });

  }

  descargarPdf() {
    if (this.idAnexoMovimiento === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    //this.anexoService.readPostFie(this.idAnexoMovimiento)
    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 003-A/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  onChangeInputCroquis(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCroquisSeleccionado = event.target.files[0];
    event.target.value = "";
    this.filePdfCroquisPathName = null;
    console.log(this.filePdfCroquisSeleccionado);
  }

  vistaPreviaPdfCroquis() {
    if (this.filePdfCroquisPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfCroquisPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCroquisSeleccionado = file;
          this.filePdfCroquisPathName = null;
          console.log(this.filePdfCroquisSeleccionado);
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

  onChangeCaf(event: boolean) {
    this.visibleButtonCaf = event;

    if (this.visibleButtonCaf === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCaf = false;
        //this.cafForm = false;
        this.anexo.controls['caf'].setValue(false);
      });
      this.anexo.controls['cao'].setValue(false);
      this.filePdfCaoSeleccionado = null;
      this.filePdfCaoPathName = null;
      this.visibleButtonCao=false;
    } else {
      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
    }
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
    event.target.value = "";
  }

  vistaPreviaCaf() {

    if (this.filePdfCafPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfCafPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCafSeleccionado = <File>file;
          this.filePdfCafPathName = null;

          this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexo.get("placaRodaje").value);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexo.get("placaRodaje").value);
    }

  }

  visualizarGrillaPdf(file: File, placaRodaje: string) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + placaRodaje;
  }

  verPdfCafGrilla(item: Vehiculos) {

    if (item.fileCaf !== null){
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
  //cao

  onChangeCao(event: boolean) {
    this.visibleButtonCao = event;

    if (this.visibleButtonCao === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCao = false;
        this.anexo.controls['cao'].setValue(false);
      });
      this.anexo.controls['caf'].setValue(false);
      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
      this.visibleButtonCaf=false;      
    } else {
      this.filePdfCaoSeleccionado = null;
    }
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
  }

  vistaPreviaCao() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCaoSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - CAO";
  }

  verPdfCaoGrilla(item: Vehiculos) {
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

  cancelarFlotaVehicular() {
    this.indexEditTabla = -1;

    this.anexo.controls['placaRodaje'].setValue('');
    this.anexo.controls['soat'].setValue('');
    this.anexo.controls['citv'].setValue('');
    this.anexo.controls['caf'].setValue(false);
    this.anexo.controls['cao'].setValue(false);

    this.filePdfCafSeleccionado = null;
    this.filePdfCaoSeleccionado = null;
    this.visibleButtonCaf = false;
    this.visibleButtonCao = false;
  }

  getDia() {
    return ('0' + (new Date().getDate())).slice(-2);
  }

  getMes() {
    switch (new Date().getMonth()) {
      case 0:
        return 'Enero';
      case 1:
        return 'Febrero';
      case 2:
        return 'Marzo';
      case 3:
        return 'Abril';
      case 4:
        return 'Mayo';
      case 5:
        return 'Junio';
      case 6:
        return 'Julio';
      case 7:
        return 'Agosto';
      case 8:
        return 'Setiembre';
      case 9:
        return 'Octubre';
      case 10:
        return 'Noviembre';
      case 11:
        return 'Diciembre';
    }
  }

  getAnio() {
    return new Date().getFullYear().toString().substr(2);
  }


  ngOnInit(): void {
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.uriArchivo = this.dataInput.rutaDocumento;
    
    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;

    if(this.paRelacionConductores.indexOf(this.codigoTupa)>-1) this.opcionalRelacionConductores=true; else this.opcionalRelacionConductores=false;
    if(this.paCategoriaM1.indexOf(this.codigoTupa)>-1) this.mostrarCategoriaM1=true; else this.mostrarCategoriaM1=false;
    //this.codigoTupa = localStorage.getItem('tupa-codigo');  
    //this.descripcionTupa = localStorage.getItem('tupa-nombre');


    /* if (this.dataInput.tramiteReqRefId === 0) {
      this.activeModal.close(this.graboUsuario);
      this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
      return;
    } */

    //VERIFICAMOS QUE EL FORMULARIO YA ESTÉ GRABADO
    for (let i = 0; i < this.dataRequisitosInput.length; i++) {
      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }
    }

    this.recuperarInformacion();

    setTimeout(() => {
      this.acc.expand('seccion-1');
      this.acc.expand('seccion-2');
      this.acc.expand('seccion-3');
  });

  }

  recuperarInformacion(){

    //si existe el documento
    if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
      this.heredarInformacionFormulario();
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo003_A17Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          this.anexo.get("ambitoOperacion").setValue(metaData.seccion1.ambitoOperacion);
          this.anexo.get("dia").setValue(metaData.seccion1.dia);
          this.anexo.get("mes").setValue(metaData.seccion1.mes);
          this.anexo.get("anio").setValue(metaData.seccion1.anio);
          
          /*
          //INFORMACION HEREDADA DE FORMULARIO
          this.anexo.get("nombresRepresentante").setValue(metaData.seccion1.nombres);
          this.anexo.get("ap_paternoRepresentante").setValue(metaData.seccion1.ap_paterno);
          this.anexo.get("ap_maternoRepresentante").setValue(metaData.seccion1.ap_materno);
          this.anexo.get("nombresApellidosRepresentante").setValue(metaData.seccion1.nombresApellidos);
          */

          let i = 0;

          for (i = 0; i < metaData.seccion2.vehiculos.length; i++) {
            this.listaFlotaVehicular.push({
              placaRodaje: metaData.seccion2.vehiculos[i].placaRodaje,
              soat: metaData.seccion2.vehiculos[i].soat,
              citv: metaData.seccion2.vehiculos[i].citv,
              caf: metaData.seccion2.vehiculos[i].caf === true || metaData.seccion2.vehiculos[i].caf === 'true' ? true : false,
              cao: metaData.seccion2.vehiculos[i].cao === true || metaData.seccion2.vehiculos[i].cao === 'true' ? true : false,
              pathNameCaf: metaData.seccion2.vehiculos[i].pathNameCaf,
              pathNameCao: metaData.seccion2.vehiculos[i].pathNameCao,
              fileCaf: null,
              fileCao: null
            });
          }

          this.filePdfCroquisPathName=metaData.seccion2.pathName;
          this.filePdfCroquisSeleccionado=null;

          i = 0;

          for (i = 0; i < metaData.seccion3.conductores.length; i++) {
            this.listaConductores.push({
              nroDni: metaData.seccion3.conductores[i].nroDni,
              nombresApellidos: metaData.seccion3.conductores[i].nombresApellidos,
              ape_Paterno:  metaData.seccion3.conductores[i].ape_Paterno,
              ape_Materno:  metaData.seccion3.conductores[i].ape_Materno,
              nombres:  metaData.seccion3.conductores[i].nombres,
              edad:  metaData.seccion3.conductores[i].edad,
              nroLicencia:  metaData.seccion3.conductores[i].nroLicencia,
              categoria:  metaData.seccion3.conductores[i].categoria
            });
          }



        },
        error => {
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }else if(this.dataInput.movId > 0 && this.dataInput.completo === true) {
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo003_A17Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          this.anexo.get("ambitoOperacion").setValue(metaData.seccion1.ambitoOperacion);
          this.anexo.get("dia").setValue(metaData.seccion1.dia);
          this.anexo.get("mes").setValue(metaData.seccion1.mes);
          this.anexo.get("anio").setValue(metaData.seccion1.anio);
          
          
          //INFORMACION HEREDADA DE FORMULARIO YA ALMACENADA
          this.anexo.get("nombresRepresentante").setValue(metaData.seccion1.nombres);
          this.anexo.get("ap_paternoRepresentante").setValue(metaData.seccion1.ap_paterno);
          this.anexo.get("ap_maternoRepresentante").setValue(metaData.seccion1.ap_materno);
          this.anexo.get("nombresApellidosRepresentante").setValue(metaData.seccion1.nombresApellidos);
          

          let i = 0;

          for (i = 0; i < metaData.seccion2.vehiculos.length; i++) {
            this.listaFlotaVehicular.push({
              placaRodaje: metaData.seccion2.vehiculos[i].placaRodaje,
              soat: metaData.seccion2.vehiculos[i].soat,
              citv: metaData.seccion2.vehiculos[i].citv,
              caf: metaData.seccion2.vehiculos[i].caf === true || metaData.seccion2.vehiculos[i].caf === 'true' ? true : false,
              cao: metaData.seccion2.vehiculos[i].cao === true || metaData.seccion2.vehiculos[i].cao === 'true' ? true : false,
              pathNameCaf: metaData.seccion2.vehiculos[i].pathNameCaf,
              pathNameCao: metaData.seccion2.vehiculos[i].pathNameCao,
              fileCaf: null,
              fileCao: null
            });
          }

          this.filePdfCroquisPathName=metaData.seccion2.pathName;
          this.filePdfCroquisSeleccionado=null;

          i = 0;

          for (i = 0; i < metaData.seccion3.conductores.length; i++) {
            this.listaConductores.push({
              nroDni: metaData.seccion3.conductores[i].nroDni,
              nombresApellidos: metaData.seccion3.conductores[i].nombresApellidos,
              ape_Paterno:  metaData.seccion3.conductores[i].ape_Paterno,
              ape_Materno:  metaData.seccion3.conductores[i].ape_Materno,
              nombres:  metaData.seccion3.conductores[i].nombres,
              edad:  metaData.seccion3.conductores[i].edad,
              nroLicencia:  metaData.seccion3.conductores[i].nroLicencia,
              categoria:  metaData.seccion3.conductores[i].categoria
            });
          }



        },
        error => {
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
        

    }
    else{
        this.heredarInformacionFormulario();
    }

  }

  heredarInformacionFormulario(){

    this.funcionesMtcService.mostrarCargando();

    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        //console.log(JSON.stringify(metaDataForm));
        const nombres=metaDataForm.seccion1.nombreRepresentanteLegal +' '+ metaDataForm.seccion1.apePaternoRepresentanteLegal + ' ' +  metaDataForm.seccion1.apeMaternoRepresentanteLegal;
        this.anexo.controls['nombres'].setValue(metaDataForm?.seccion1?.nombreRepresentanteLegal);
        this.anexo.controls['ap_paternoRepresentante'].setValue(metaDataForm?.seccion1?.apePaternoRepresentanteLegal);
        this.anexo.controls['ap_maternoRepresentante'].setValue(metaDataForm?.seccion1?.apePaternoRepresentanteLegal);
        this.anexo.controls['nombresApellidosRepresentante'].setValue(nombres);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );

}




}
