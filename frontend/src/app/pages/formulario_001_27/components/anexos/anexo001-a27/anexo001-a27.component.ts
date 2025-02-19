import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { FormArray, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo001A17Service } from 'src/app/core/services/anexos/anexo001-a17.service';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { PaisService } from 'src/app/core/services/maestros/pais.service';

import { Anexo001_A17Request } from 'src/app/core/models/Anexos/Anexo001_A17/Anexo001_A17Request';

import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { Anexo001_A17Response } from 'src/app/core/models/Anexos/Anexo001_A17/Anexo001_A17Response';
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_A17/MetaData';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CompletarReqRequestModel } from 'src/app/core/models/Tramite/CompletarReqRequest';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { AnioInversionModel } from 'src/app/core/models/AnioInversionModel';
import { A001_A27_Seccion1, A001_A27_Seccion2, A001_A27_Seccion3, Proyeccion } from 'src/app/core/models/Anexos/Anexo001_A27/Secciones';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001_A27Request } from 'src/app/core/models/Anexos/Anexo001_A27/Anexo001_A27Request';
import { Anexo001A27Service } from 'src/app/core/services/anexos/anexo001-a27.service';
import { Anexo001_A27Response } from 'src/app/core/models/Anexos/Anexo001_A27/Anexo001_A27Response';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'app-anexo001-a27',
  templateUrl: './anexo001-a27.component.html',
  styleUrls: ['./anexo001-a27.component.css'],
})
export class Anexo001A27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO
  tramiteReqId: number = 0;
  indexEditTabla: number = -1;
  disabledAcordion: number = 2;

  listaPaises: PaisResponse[] = [];
  listaPasoFrontera: SelectionModel[] = [];

  //anexoFormulario: FormGroup;
  visibleButtonCarf: boolean = false;



  fechaMinimaSalida: Date = (new Date()).addDays(1);
  fechaMinimaLlegada: Date = (new Date()).addDays(2);

  filePdfCroquisSeleccionado: any = null;
  filePdfCroquisPathName: string = null;

  filePdfPolizaSeleccionado: any = null;
  filePdfPolizaPathName: string = null;

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;
  tipoDocumento: TipoDocumentoModel;

 

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    public activeModal: NgbActiveModal,
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001A27Service,
    private paisService: PaisService,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    private sunatService: SunatService,
    private formularioTramiteService: FormularioTramiteService
  ) { }

  anexoFormulario = this.fb.group({

    //***************************** */

    //S1
    tipoDocumentoForm: this.fb.control(''),
    numeroDocumentoForm: this.fb.control(''),
    nombresApellidosRazonSocialForm: this.fb.control(''),
    rucForm: this.fb.control(''),
    telefonoForm: this.fb.control(''),
    celularForm: this.fb.control(''),
    correoElectronicoForm: this.fb.control(''),


    //S2
    portadorLocalConmutadoForm: this.fb.control(false),
    portadorLocalNoConmutadoForm: this.fb.control(false),
    portadorLargaDistanciaInternacionalConmutadoForm: this.fb.control(false),
    portadorLargaDistanciaInternacionalNoConmutadoForm: this.fb.control(false),
    portadorLargaDistanciaNacionalConmutadoForm: this.fb.control(false),
    portadorLargaDistanciaNacionalNoConmutadoForm: this.fb.control(false),
    telefoníaFijaAbonadosForm: this.fb.control(false),
    telefoníaFijaTelefonosPublicosForm: this.fb.control(false),
    telefoniaMovilAbonadosForm: this.fb.control(false),
    telefoniaMovilTelefonosPublicosForm: this.fb.control(false),

    distribucionRadiodifusiionCableAlambricoOpticoForm: this.fb.control(false),
    distribucionRadiodifusionCableDifusionDirectaSateliteForm: this.fb.control(false),
    distribucionRadiodifusionCableMMDSForm: this.fb.control(false),
    servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizadoForm: this.fb.control(false),
    servicioComunicacionesPersonalesPCSForm: this.fb.control(false),

    movilporSateliteForm: this.fb.control(false),
    movildDatosMarítimoSateliteForm: this.fb.control(false),
    otrosEstablecidosArticulo53Form: this.fb.control(false),
    otrosDescripcionForm: this.fb.control(''),


    //S3

    dolaresForm: this.fb.control(''),
    solesForm: this.fb.control(''),
    MonedaForm: this.fb.control(''),
    anioForm: this.fb.control(''),
    cantidadForm: this.fb.control(''),
    ///************************ */
  });

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    { id: "04", documento: 'RUC' }
  ];

  ngOnInit(): void {

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.tramiteReqId = this.dataInput.tramiteReqId;
    console.log("this.dataInput::", this.dataInput)

   // this.cargarDatos();
   setTimeout(() => {
    this.funcionesMtcService.mostrarCargando();
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //RECUPERAMOS DATOS DEL FORMULARIO
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

       
        if (this.dataInput.movId > 0) {
          //RECUPERAMOS LOS DATOS
          this.funcionesMtcService.mostrarCargando();
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataAnexo: Anexo001_A27Response) => {
              this.funcionesMtcService.ocultarCargando();

              const metaData: any = JSON.parse(dataAnexo.metaData);
              this.idAnexo = dataAnexo.anexoId;

        
              //*******************Cargar todo para edicion**************** */
              this.anexoFormulario.get("tipoDocumentoForm").setValue(metaData?.seccion1?.TipoDocumento.id);
              this.anexoFormulario.get("numeroDocumentoForm").setValue(metaData?.seccion1?.NumeroDocumento);
              this.anexoFormulario.get("nombresApellidosRazonSocialForm").setValue(metaData?.seccion1?.NombresApellidosRazonSocial);
              this.anexoFormulario.get("rucForm").setValue(metaData?.seccion1?.Ruc);
              this.anexoFormulario.get("telefonoForm").setValue(metaData?.seccion1?.telefono);
              this.anexoFormulario.get("celularForm").setValue(metaData?.seccion1?.Celular);
              this.anexoFormulario.get("correoElectronicoForm").setValue(metaData?.seccion1?.CorreoElectronico);
             
              this.anexoFormulario.get("portadorLocalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLocalNoConmutado);
              this.anexoFormulario.get("portadorLargaDistanciaInternacionalConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaInternacionalConmutado);
              this.anexoFormulario.get("portadorLargaDistanciaInternacionalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaInternacionalNoConmutado);
              this.anexoFormulario.get("portadorLargaDistanciaNacionalConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaNacionalConmutado);
              this.anexoFormulario.get("portadorLargaDistanciaNacionalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaNacionalNoConmutado);
              this.anexoFormulario.get("telefoníaFijaAbonadosForm").setValue(metaData?.seccion2?.TelefoníaFijaAbonados);
              this.anexoFormulario.get("telefoníaFijaTelefonosPublicosForm").setValue(metaData?.seccion2?.TelefoníaFijaTelefonosPublicos);
              this.anexoFormulario.get("telefoniaMovilAbonadosForm").setValue(metaData?.seccion2?.TelefoniaMovilAbonados);
              this.anexoFormulario.get("telefoniaMovilTelefonosPublicosForm").setValue(metaData?.seccion2?.TelefoniaMovilTelefonosPublicos);
              this.anexoFormulario.get("distribucionRadiodifusiionCableAlambricoOpticoForm").setValue(metaData?.seccion2?.DistribucionRadiodifusiionCableAlambricoOptico);
              this.anexoFormulario.get("distribucionRadiodifusionCableDifusionDirectaSateliteForm").setValue(metaData?.seccion2?.DistribucionRadiodifusionCableDifusionDirectaSatelite);
              this.anexoFormulario.get("distribucionRadiodifusionCableMMDSForm").setValue(metaData?.seccion2?.DistribucionRadiodifusionCableMMDS);
              this.anexoFormulario.get("servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizadoForm").setValue(metaData?.seccion2?.ServicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizado);
              this.anexoFormulario.get("servicioComunicacionesPersonalesPCSForm").setValue(metaData?.seccion2?.ServicioComunicacionesPersonalesPCS);
              this.anexoFormulario.get("movilporSateliteForm").setValue(metaData?.seccion2?.MovilporSatelite);
              this.anexoFormulario.get("movildDatosMarítimoSateliteForm").setValue(metaData?.seccion2?.MovildDatosMarítimoSatelite);
              this.anexoFormulario.get("otrosEstablecidosArticulo53Form").setValue(metaData?.seccion2?.OtrosEstablecidosArticulo53);
              this.anexoFormulario.get("otrosDescripcionForm").setValue(metaData?.seccion2?.OtrosDescripcion);
              this.anexoFormulario.get("MonedaForm").setValue(metaData?.seccion3?.Moneda);
             
              // seccion3.moneda=this.anexoFormulario.controls['MonedaForm'].value;

              // this.anexoFormulario.get("otrosDescripcionForm").setValue();
              if(metaData?.seccion3?.Proyeccion!= null)
              {
                this.relacionProyeccion.proyeccion=  metaData?.seccion3?.Proyeccion;
              }
              else{
                this.relacionProyeccion.proyeccion=[];
              }
              
             

          
             
//                 Proyeccion: Array(1)
// 0: {Dolares: false, Soles: false, Moneda: false, Anio: "Primer Año", Cantidad: 370}
// length: 1
//                 // this.anexoFormulario.get("dolaresForm").setValue(metaData?.seccion3?.Proyeccion.Dolares);
              // this.anexoFormulario.get("solesForm").setValue(metaData?.seccion3?.Soles);
              // this.anexoFormulario.get("MonedaForm").setValue(metaData?.seccion3?.Moneda);
              // this.anexoFormulario.get("anioForm").setValue(metaData?.seccion3?.Anio);
              // this.anexoFormulario.get("cantidadForm").setValue(metaData?.seccion3?.Cantidad);
             
                      
        
              //************************************************** */
            },
            error => {
              // this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
              //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });
        }

      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );

  });

  this.traerDatos();
 
  this.recuperarDatosSunat();
 
  }

  cargarDatos(){

    
    if( this.dataInput.rutaDocumento!="")
    {
    setTimeout(() => {
      this.funcionesMtcService.mostrarCargando();
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //RECUPERAMOS DATOS DEL FORMULARIO
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {

          this.funcionesMtcService.ocultarCargando();
          const metaDataForm: any = JSON.parse(dataForm.metaData);

         
          if (this.dataInput.movId > 0) {
            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_A27Response) => {
                this.funcionesMtcService.ocultarCargando();

                const metaData: any = JSON.parse(dataAnexo.metaData);
                this.idAnexo = dataAnexo.anexoId;

          
                //*******************Cargar todo para edicion**************** */
                this.anexoFormulario.get("tipoDocumentoForm").setValue(metaData?.seccion1?.TipoDocumento.id);
                this.anexoFormulario.get("numeroDocumentoForm").setValue(metaData?.seccion1?.NumeroDocumento);
                this.anexoFormulario.get("nombresApellidosRazonSocialForm").setValue(metaData?.seccion1?.NombresApellidosRazonSocial);
                this.anexoFormulario.get("rucForm").setValue(metaData?.seccion1?.Ruc);
                this.anexoFormulario.get("telefonoForm").setValue(metaData?.seccion1?.telefono);
                this.anexoFormulario.get("celularForm").setValue(metaData?.seccion1?.Celular);
                this.anexoFormulario.get("correoElectronicoForm").setValue(metaData?.seccion1?.CorreoElectronico);
               
                this.anexoFormulario.get("portadorLocalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLocalNoConmutado);
                this.anexoFormulario.get("portadorLargaDistanciaInternacionalConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaInternacionalConmutado);
                this.anexoFormulario.get("portadorLargaDistanciaInternacionalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaInternacionalNoConmutado);
                this.anexoFormulario.get("portadorLargaDistanciaNacionalConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaNacionalConmutado);
                this.anexoFormulario.get("portadorLargaDistanciaNacionalNoConmutadoForm").setValue(metaData?.seccion2?.PortadorLargaDistanciaNacionalNoConmutado);
                this.anexoFormulario.get("telefoníaFijaAbonadosForm").setValue(metaData?.seccion2?.TelefoníaFijaAbonados);
                this.anexoFormulario.get("telefoníaFijaTelefonosPublicosForm").setValue(metaData?.seccion2?.TelefoníaFijaTelefonosPublicos);
                this.anexoFormulario.get("telefoniaMovilAbonadosForm").setValue(metaData?.seccion2?.TelefoniaMovilAbonados);
                this.anexoFormulario.get("telefoniaMovilTelefonosPublicosForm").setValue(metaData?.seccion2?.TelefoniaMovilTelefonosPublicos);
                this.anexoFormulario.get("distribucionRadiodifusiionCableAlambricoOpticoForm").setValue(metaData?.seccion2?.DistribucionRadiodifusiionCableAlambricoOptico);
                this.anexoFormulario.get("distribucionRadiodifusionCableDifusionDirectaSateliteForm").setValue(metaData?.seccion2?.DistribucionRadiodifusionCableDifusionDirectaSatelite);
                this.anexoFormulario.get("distribucionRadiodifusionCableMMDSForm").setValue(metaData?.seccion2?.DistribucionRadiodifusionCableMMDS);
                this.anexoFormulario.get("servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizadoForm").setValue(metaData?.seccion2?.ServicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizado);
                this.anexoFormulario.get("servicioComunicacionesPersonalesPCSForm").setValue(metaData?.seccion2?.ServicioComunicacionesPersonalesPCS);
                this.anexoFormulario.get("movilporSateliteForm").setValue(metaData?.seccion2?.MovilporSatelite);
                this.anexoFormulario.get("movildDatosMarítimoSateliteForm").setValue(metaData?.seccion2?.MovildDatosMarítimoSatelite);
                this.anexoFormulario.get("otrosEstablecidosArticulo53Form").setValue(metaData?.seccion2?.OtrosEstablecidosArticulo53);
                this.anexoFormulario.get("otrosDescripcionForm").setValue(metaData?.seccion2?.OtrosDescripcion);
                this.anexoFormulario.get("MonedaForm").setValue(metaData?.seccion3?.Moneda);
               
                // seccion3.moneda=this.anexoFormulario.controls['MonedaForm'].value;

                // this.anexoFormulario.get("otrosDescripcionForm").setValue();
                this.relacionProyeccion.proyeccion=  metaData?.seccion3?.Proyeccion;

            
               
//                 Proyeccion: Array(1)
// 0: {Dolares: false, Soles: false, Moneda: false, Anio: "Primer Año", Cantidad: 370}
// length: 1
//                 // this.anexoFormulario.get("dolaresForm").setValue(metaData?.seccion3?.Proyeccion.Dolares);
                // this.anexoFormulario.get("solesForm").setValue(metaData?.seccion3?.Soles);
                // this.anexoFormulario.get("MonedaForm").setValue(metaData?.seccion3?.Moneda);
                // this.anexoFormulario.get("anioForm").setValue(metaData?.seccion3?.Anio);
                // this.anexoFormulario.get("cantidadForm").setValue(metaData?.seccion3?.Cantidad);
               
                        
          
                //************************************************** */
              },
              error => {
                // this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
              });
          }

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );

    });

  }
else
{

  this.traerDatos();
 
  this.recuperarDatosSunat();
}


}


  tupaId: number;
  codigoTupa: String;
  descripcionTupa: String;
  //Datos Generales
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  datos: any = {};

  traerDatos() {

    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login

    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    console.log('RUC obtenido token' + this.ruc);
    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersonaLogin = 'PERSONA NATURAL';
      this.datos.tipo_solicitante = 'PN';
      // this.anexoFormulario.controls['tipoPersonaForm'].setValue('PERSONA NATURAL');

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue("01");
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);
      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);


    }
    else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersonaLogin = 'PERSONA JURIDICA';
      this.datos.tipo_solicitante = 'PJ';

      // this.anexoFormulario.controls['tipoPersonaForm'].setValue('PERSONA JURIDICA');

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue("04");
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(this.ruc);
      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);

      //this.formulario.controls['nombres'].setValue(this.razonsocial);
    } else {
      this.tipoPersonaLogin = 'PERSONA NATURAL CON RUC';
      this.datos.tipo_solicitante = 'PN';
      this.anexoFormulario.controls['tipo_solicitante'].setValue('PERSONA NATURAL CON RUC');
      this.anexoFormulario.controls['doc_identidad'].setValue('01');

    }


    this.tupaId = Number(localStorage.getItem('tupa-id'));
    this.codigoTupa = localStorage.getItem('tupa-codigo');    //'DSTT-033'
    this.descripcionTupa = localStorage.getItem('tupa-nombre');

   

  }

  idAnexoMovimiento = 0

  recuperarInformacion() {

    //si existe el documento
    if (this.dataInput.rutaDocumento) {
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo001_A27Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

         

        },
        error => {
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
      //}else{
      //    this.heredarInformacionFormulario();
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-A/27";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarAnexo() {


    let dataGuardar: Anexo001_A27Request = new Anexo001_A27Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    

    let seccion1: A001_A27_Seccion1 = new A001_A27_Seccion1();

    //seccion1.celular = this.anexoFormulario.controls['celularForm'].value.trim();
    //seccion1.correoElectronico = this.anexoFormulario.controls['correoElectronicoForm'].value.trim();
    seccion1.nombresApellidosRazonSocial = this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].value.trim();
    seccion1.numeroDocumento = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();
    seccion1.ruc = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();
   // seccion1.telefono = this.anexoFormulario.controls['telefonoForm'].value.trim();
    
    seccion1.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento;
    seccion1.tipoDocumento.id = this.anexoFormulario.controls['tipoDocumentoForm'].value;
   
    dataGuardar.metaData.seccion1 = seccion1;
    //-------------------------------------    
    let seccion2: A001_A27_Seccion2 = new A001_A27_Seccion2();
    seccion2.distribucionRadiodifusiionCableAlambricoOptico = this.anexoFormulario.controls['distribucionRadiodifusiionCableAlambricoOpticoForm'].value=='undefined'?false :  this.anexoFormulario.controls['distribucionRadiodifusiionCableAlambricoOpticoForm'].value;

    seccion2.distribucionRadiodifusionCableDifusionDirectaSatelite = this.anexoFormulario.controls['distribucionRadiodifusionCableDifusionDirectaSateliteForm'].value=='undefined'? false : this.anexoFormulario.controls['distribucionRadiodifusionCableDifusionDirectaSateliteForm'].value;
    seccion2.distribucionRadiodifusionCableMMDS = this.anexoFormulario.controls['distribucionRadiodifusionCableMMDSForm'].value=='undefined'? false : this.anexoFormulario.controls['distribucionRadiodifusionCableMMDSForm'].value;
    seccion2.movildDatosMarítimoSatelite = this.anexoFormulario.controls['movildDatosMarítimoSateliteForm'].value=='undefined'? false : this.anexoFormulario.controls['movildDatosMarítimoSateliteForm'].value;
    seccion2.movilporSatelite = this.anexoFormulario.controls['movilporSateliteForm'].value=='undefined'? false : this.anexoFormulario.controls['movilporSateliteForm'].value;
    seccion2.otrosDescripcion = this.anexoFormulario.controls['otrosDescripcionForm'].value=='undefined'? false : this.anexoFormulario.controls['otrosDescripcionForm'].value;
    seccion2.otrosEstablecidosArticulo53 = this.anexoFormulario.controls['otrosEstablecidosArticulo53Form'].value=='undefined'? false : this.anexoFormulario.controls['otrosEstablecidosArticulo53Form'].value;
    seccion2.portadorLargaDistanciaInternacionalConmutado = this.anexoFormulario.controls['portadorLargaDistanciaInternacionalConmutadoForm'].value=='undefined'? false :  this.anexoFormulario.controls['portadorLargaDistanciaInternacionalConmutadoForm'].value;
    seccion2.portadorLargaDistanciaInternacionalNoConmutado = this.anexoFormulario.controls['portadorLargaDistanciaInternacionalNoConmutadoForm'].value=='undefined'? false : this.anexoFormulario.controls['portadorLargaDistanciaInternacionalNoConmutadoForm'].value;
  seccion2.portadorLargaDistanciaNacionalConmutado = this.anexoFormulario.controls['portadorLargaDistanciaNacionalConmutadoForm'].value=='undefined'? false : this.anexoFormulario.controls['portadorLargaDistanciaNacionalConmutadoForm'].value;
    seccion2.portadorLargaDistanciaNacionalNoConmutado = this.anexoFormulario.controls['portadorLargaDistanciaNacionalNoConmutadoForm'].value =='undefined'? false : this.anexoFormulario.controls['portadorLargaDistanciaNacionalNoConmutadoForm'].value;
    seccion2.portadorLocalConmutado = this.anexoFormulario.controls['portadorLocalConmutadoForm'].value =='undefined'? false : this.anexoFormulario.controls['portadorLocalConmutadoForm'].value;
    seccion2.portadorLocalNoConmutado = this.anexoFormulario.controls['portadorLocalNoConmutadoForm'].value =='undefined'? false : this.anexoFormulario.controls['portadorLocalNoConmutadoForm'].value;
    seccion2.servicioComunicacionesPersonalesPCS = this.anexoFormulario.controls['servicioComunicacionesPersonalesPCSForm'].value =='undefined'? false : this.anexoFormulario.controls['servicioComunicacionesPersonalesPCSForm'].value;
    seccion2.servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizado = this.anexoFormulario.controls['servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizadoForm'].value=='undefined'? false : this.anexoFormulario.controls['servicioMovilCanalesMultiplesSeleccionAutomaticaTrocalizadoForm'].value;
    seccion2.telefoniaMovilAbonados = this.anexoFormulario.controls['telefoniaMovilAbonadosForm'].value=='undefined'?false : this.anexoFormulario.controls['telefoniaMovilAbonadosForm'].value ;
    seccion2.telefoniaMovilTelefonosPublicos = this.anexoFormulario.controls['telefoniaMovilTelefonosPublicosForm'].value=='undefined'? false:this.anexoFormulario.controls['telefoniaMovilTelefonosPublicosForm'].value;
    seccion2.telefoníaFijaAbonados = this.anexoFormulario.controls['telefoníaFijaAbonadosForm'].value=='undefined'? false : this.anexoFormulario.controls['telefoníaFijaAbonadosForm'].value;
    seccion2.telefoníaFijaTelefonosPublicos = this.anexoFormulario.controls['telefoníaFijaTelefonosPublicosForm'].value=='undefined'?false : this.anexoFormulario.controls['telefoníaFijaTelefonosPublicosForm'].value ;



    dataGuardar.metaData.seccion2 = seccion2;
    //-------------------------------------    
    let seccion3: A001_A27_Seccion3 = new A001_A27_Seccion3();
    seccion3.proyeccion = this.relacionProyeccion.proyeccion;
    seccion3.moneda=this.anexoFormulario.controls['MonedaForm'].value;

    dataGuardar.metaData.seccion3 = seccion3;
    //-------------------------------------    


    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
            .subscribe(
              data => {
                this.funcionesMtcService.ocultarCargando();
                this.idAnexo = data.id;
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
                this.idAnexo = data.id;
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

  eliminar(item: number) {
    this.relacionProyeccion.proyeccion.splice(item, 1);
  }
 
  // editar(item : number) {

  //   this.relacionProyeccion.proyeccion.filter(item1 => item1. == item)
  //   if (this.indexEditTabla !== -1)
  //     return;

  //   this.indexEditTabla = index;

  //   this.anexoFormulario.controls['anioForm'].setValue(this.listaAnioInversion.filter(item1 => item1.anio == item.Anio)[0].id);
  //   this.anexoFormulario.controls['cantidadForm'].setValue(item.Cantidad);
    
    
  // }
 
  listaAnioInversion: AnioInversionModel[] = [
    { id: "1", anio: 'Primer Año' },
    { id: "2", anio: 'Segundo Año' },
    { id: "3", anio: 'Tercer Año' },
    { id: "4", anio: 'Cuarto Año' },
    { id: "5", anio: 'Quinto Año' }
  ];

  /**Sección 3 */
  //relacionConductores : A001_A27_Seccion3= []; 
  relacionProyeccion: A001_A27_Seccion3 = new A001_A27_Seccion3();
  proyeccionitem: Proyeccion = new Proyeccion();
  Seccion3cantidad: number = 0;
  Seccion3Soles: boolean = false;
  Seccion3Dolares: boolean = false;
  Seccion3anio: string = '';
  correcto: boolean = true;
  validacionSeccion3() {
  
    this.cargaTablaSeccion3();
  }



  cargaTablaSeccion3() {


    if (this.correcto) {

      if ( this.anexoFormulario.get('anioForm').value)
      {
        this.proyeccionitem.Anio = this.listaAnioInversion.filter(item => item.id == this.anexoFormulario.get('anioForm').value)[0].anio;

      }
      else
      {

        this.funcionesMtcService.mensajeError(`Seleccione un año valido`);
        return;
      }
     
     
        this.proyeccionitem.Dolares = this.Seccion3Dolares;
        this.proyeccionitem.Soles = this.Seccion3Soles;
     
      

      this.proyeccionitem.Cantidad =0;
      this.proyeccionitem.Cantidad = this.anexoFormulario.controls['cantidadForm'].value

          if (this.proyeccionitem.Cantidad==0)
          {
           
            this.funcionesMtcService.mensajeError(`Ingrese la cantidad de la Proyección`);
            return;
          }
        let cantidadregistro: number;
        cantidadregistro=0;
        cantidadregistro= this.relacionProyeccion.proyeccion.filter(item=>item.Anio==this.proyeccionitem.Anio).length;
          if (cantidadregistro>0)
          {
           
            this.funcionesMtcService.mensajeError(`El año que desea agregar ya existe, cambie por otro año`);
          
          }
          else{
          
            this.relacionProyeccion.proyeccion.push(this.proyeccionitem);
            this.proyeccionitem = new Proyeccion();
          }
     
    } else {
      
      this.funcionesMtcService.mensajeError(`debe completar los campos`);

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  recuperarDatosSunat() {

if(this.ruc!="")
{
  this.funcionesMtcService.mostrarCargando();

  this.sunatService.getDatosPrincipales(this.ruc).subscribe(
    respuesta => {

      this.funcionesMtcService.ocultarCargando();

      const datos = respuesta;

      console.log(JSON.stringify(datos, null, 10));

      //console.log(JSON.stringify(datos, null, 10));


      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(datos.razonSocial);
      // this.anexoFormulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);
      // this.anexoFormulario.controls['distritoForm'].setValue(datos.nombreDistrito);
      // this.anexoFormulario.controls['provinciaForm'].setValue(datos.nombreProvincia);
      // this.anexoFormulario.controls['departamentoForm'].setValue(datos.nombreDepartamento);
      // this.anexoFormulario.controls['numeroDocumentoForm'].setValue(datos.representanteLegal[0].nroDocumento);
      this.anexoFormulario.controls['correoElectronicoForm'].setValue(datos.correo);
      this.anexoFormulario.controls['telefonoForm'].setValue(datos.telefono);
      this.anexoFormulario.controls['celularForm'].setValue(datos.celular);
      this.anexoFormulario.controls['rucForm'].setValue(this.ruc);
      // this.anexoFormulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);


    },
    error => {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Error al consultar el Servicio de Sunat');
    }
  );

}

}
    
}
