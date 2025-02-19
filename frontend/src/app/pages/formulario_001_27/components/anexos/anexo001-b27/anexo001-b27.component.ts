import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbDateStruct, NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_B17Request } from 'src/app/core/models/Anexos/Anexo001_B17/Anexo001_B17Request';
import { Anexo001_B17Response } from 'src/app/core/models/Anexos/Anexo001_B17/Anexo001_B17Response';
import { A001_B17_Seccion3 } from 'src/app/core/models/Anexos/Anexo001_B17/Secciones';
import { Anexo001_B27Request } from 'src/app/core/models/Anexos/Anexo001_B27/Anexo001_B27Request';
import { Anexo001_B27Response } from 'src/app/core/models/Anexos/Anexo001_B27/Anexo001_B27Response';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo001B17Service } from 'src/app/core/services/anexos/anexo001-b17.service';
import { Anexo001B27Service } from 'src/app/core/services/anexos/anexo001-b27.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';

import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';

@Component({
  selector: 'app-anexo001-b27',
  templateUrl: './anexo001-b27.component.html',
  styleUrls: ['./anexo001-b27.component.css']
})
export class Anexo001B27Component implements OnInit {

  @Input() public dataInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO


  active = 1;
  disabled: boolean = true;
  fileToUpload: File;
  idForm: number = 0;
  FilaAfectada: number;
  //ruc:string;
  
  //Datos Generales
  tipoDocumentoLogin: string;
  nroDocumentoLogin: String;
  nombresLogin: string;
  tipoPersonaLogin: string;
  ruc: string;
  datos: any = {};
  indexEditTabla: number = -1;
  disabledAcordion: number = 2;

  listaPaises: PaisResponse[] = [];
  listaPasoFrontera: SelectionModel[] = [];


  visibleButtonCarf: boolean = false;

  listaFlotaVehicular: A001_B17_Seccion3[] = [];

  filePdfPolizaSeleccionado: any = null;
  filePdfPolizaPathName: string = null;

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  @ViewChild('acc') acc: NgbAccordionDirective ;


  constructor(
   
    public fb:UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private paisService: PaisService,
    private anexoService: Anexo001B27Service,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
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
    domicilioLegalForm: this.fb.control('', [Validators.required]),
    distritoForm: this.fb.control('', [Validators.required]),
    provinciaForm: this.fb.control('', [Validators.required]),
    departamentoForm: this.fb.control('', [Validators.required]),


    //S3

    declaracionPrimeroForm: this.fb.control(''),
    declaracionLugarForm: this.fb.control(''),
    declaracionFechaForm: this.fb.control(''),

    ///************************ */
  });

  fechaDeclaracion: string = "";
  selectedDateFechaDeclaracion: NgbDateStruct = undefined;
  onDateSelectFechaDeclaracion(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaDeclaracion = finalDate;
  }

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
       

        console.log("recupera metadata del formulario::",metaDataForm )

        // this.anexoFormulario.get("declaracionSegundoAsientoForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.Asiento);
        // this.anexoFormulario.get("declaracionSegundoPartidaForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.PoderRegistrado);
                 
        // this.anexoFormulario.get("declaracionSegundoRepresentacionForm").setValue(metaDataForm?.DatosSolicitante?.NombresApellidosRazonSocial);
        // this.anexoFormulario.get("declaracionSegundoRegistrosForm").setValue(metaDataForm?.DatosSolicitante?.RepresentanteLegal?.OficinaRegistral?.Descripcion);
        
       
        if (this.dataInput.movId > 0) {
          //RECUPERAMOS LOS DATOS
          this.funcionesMtcService.mostrarCargando();
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataAnexo: Anexo001_B27Response) => {
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

              this.anexoFormulario.get("declaracionLugarForm").setValue(metaData?.seccion3?.DeclaracionLugar);
              this.anexoFormulario.get("declaracionPrimeroForm").setValue(metaData?.seccion3?.DeclaracionPrimero);
              if( metaData?.seccion3?.DeclaracionFecha.length > 0){

                this.fechaDeclaracion = metaData?.seccion3?.DeclaracionFecha;
                console.log("+==> "+this.fechaDeclaracion);
    
                const fechaDeclara=metaData?.seccion3?.DeclaracionFecha.split("-");
    
                this.selectedDateFechaDeclaracion = {
                  day: parseInt(fechaDeclara[2]),
                  month: parseInt(fechaDeclara[1]),
                  year: parseInt(fechaDeclara[0])
                };
    
                console.log("==> "+this.selectedDateFechaDeclaracion);
    
                this.anexoFormulario.get("declaracionFechaForm").setValue(this.selectedDateFechaDeclaracion);
    
            }else{
    
                this.anexoFormulario.get("declaracionFechaForm").setValue(null);
    
            }
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

    this.uriArchivo = this.dataInput.rutaDocumento; 
     
    this.traerDatos();
    this.recuperarDatosSunat();


  });

    // this.uriArchivo = this.dataInput.rutaDocumento;

   

    // this.traerDatos();
    // this.recuperarDatosSunat();

  }
  tupaId: number;
  codigoTupa: String;
  descripcionTupa: String;
  tramiteReqId: number = 0;
  traerDatos() {

    this.nroDocumentoLogin = this.seguridadService.getNumDoc();    //nro de documento usuario login
    this.nombresLogin = this.seguridadService.getUserName();       //nombre de usuario login

    this.tipoDocumentoLogin = this.seguridadService.getNameId();   //tipo de documento usuario login
    this.ruc = this.seguridadService.getCompanyCode();
    console.log('RUC obtenido token' + this.ruc);
    if (this.seguridadService.getNameId() === '00001') {
      this.tipoPersonaLogin = 'PERSONA NATURAL';
      this.datos.tipo_solicitante = 'PN';
      // this.formulario.controls['tipoPersonaForm'].setValue('PERSONA NATURAL');

      this.anexoFormulario.controls['tipoDocumentoForm'].setValue("01");
      this.anexoFormulario.controls['numeroDocumentoForm'].setValue(this.nroDocumentoLogin);
      this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].setValue(this.nombresLogin);


    }
    else if (this.seguridadService.getNameId() === '00002') {
      this.tipoPersonaLogin = 'PERSONA JURIDICA';
      this.datos.tipo_solicitante = 'PJ';

      // this.formulario.controls['tipoPersonaForm'].setValue('PERSONA JURIDICA');

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

    // console.log("Temas de dato::", this.tupaId);
    // if (this.tupaId === 1001) {
    //   this.datos.check_dstt033 = 1;
    //   //this.formulario.controls['s3_servicioCodigo'].setValue('DGPPC-001');
    //   this.anexoFormulario.get("s3_servicioCodigo").setValue('DGPPC-001');
    // }
    //else if (this.codigoTupa === 'DSTT-037') {
    //   this.datos.check_dstt037 = 1;
    //   this.formulario.controls['check_dstt037'].setValue(1);
    // } else if (this.codigoTupa === 'DSTT-038') {
    //   this.datos.check_dstt038 = 1;
    //   this.formulario.controls['check_dstt038'].setValue(1);
    // }
    //-------------------------


  }

  tipoDocumento: TipoDocumentoModel;

  // listaTiposDocumentos: TipoDocumentoModel[] = [
  //   { id: "01", documento: 'DNI' },
  //   { id: "02", documento: 'Carnet de Extranjería' },
  //   { id: "03", documento: 'Carnet de Identidad' },
  //   { id: "04", documento: 'RUC' },
  //   { id: "05", documento: 'Cédula de indentidad' },
  //   { id: "06", documento: 'Carnet de Identidad' },
  //   { id: "07", documento: 'OTROS' }
  // ];

  // toggleAccordian(props: NgbPanelChangeEvent): void {

  //   if (this.dataInput.tipoSolicitud.codigo === 4) {//
  //     if (props.panelId === 'anexo001-b17-seccion-1') {
  //       this.acc.collapse('anexo001-b17-seccion-2');
  //       this.actualizarValidatorSeccion1y2(true);

  //     } else if (props.panelId === 'anexo001-b17-seccion-2') {
  //       this.acc.collapse('anexo001-b17-seccion-1');
  //       this.actualizarValidatorSeccion1y2(false);

  //     }
  //   }
  // }


  // paisesOperarValidator() {
  //   return (formArray: FormArray) => {
  //     let valid: boolean = false;
  //     formArray.value.forEach((item) => {
  //       if (item.checked === true)
  //         valid = item.checked;
  //     });
  //     return valid ? null : { error: "Sin checked" };
  //   };
  // }

  // changeDestinoViaje(value) {
  //   if (value !== '29') {
  //     this.filePdfPolizaSeleccionado = null;
  //     this.filePdfPolizaPathName = null;
  //   }
  // }

  // onChangePermiso(seccion1: string, seccion2: string, valor: number) {
  //   this.acc.collapse(seccion2);
  //   this.disabledAcordion = valor;

  //   // const s1_paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'];
  //   // const s2_tipoCargaTransportarIda = this.anexoFormulario.controls['s2_tipoCargaTransportarIda'];
  //   // const s2_tipoCargaTransportarRegreso = this.anexoFormulario.controls['s2_tipoCargaTransportarRegreso'];
  //   // const s2_periodoViajeOsacional = this.anexoFormulario.controls['s2_periodoViajeOsacional'];
  //   // const s2_pasoFronteraIda = this.anexoFormulario.controls['s2_pasoFronteraIda'];
  //   // const s2_pasoFronteraRegreso = this.anexoFormulario.controls['s2_pasoFronteraRegreso'];
  //   // const s2_cantidadViajes = this.anexoFormulario.controls['s2_cantidadViajes'];
  //   // const s2_vehiculosOfertados = this.anexoFormulario.controls['s2_vehiculosOfertados'];

  //   if (seccion1 === 'anexo001-b17-seccion-1') {
  //     //seccion1 activa:

  //     document.querySelector('button[aria-controls=anexo001-b17-seccion-1]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
  //     document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');

  //     // s2_tipoCargaTransportarIda.setValidators(null);
  //     // s2_tipoCargaTransportarRegreso.setValidators(null);
  //     // s2_periodoViajeOsacional.setValidators(null);
  //     // s2_pasoFronteraIda.setValidators(null);
  //     // s2_pasoFronteraRegreso.setValidators(null);
  //     // s2_cantidadViajes.setValidators(null);
  //     // s2_vehiculosOfertados.setValidators(null);

  //     // s1_paisesOperar.setValidators(this.paisesOperarValidator());

  //     this.actualizarValidatorSeccion1y2(true);
  //   } else {
  //     //seccion2 activa:

  //     document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
  //     document.querySelector('button[aria-controls=anexo001-b17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');

  //     this.actualizarValidatorSeccion1y2(false);

  //     // s1_paisesOperar.setValidators(null);

  //     // s2_tipoCargaTransportarIda.setValidators([Validators.required]);
  //     // s2_tipoCargaTransportarRegreso.setValidators([Validators.required]);
  //     // s2_periodoViajeOsacional.setValidators([Validators.required]);
  //     // s2_pasoFronteraIda.setValidators([Validators.required]);
  //     // s2_pasoFronteraRegreso.setValidators([Validators.required]);
  //     // s2_cantidadViajes.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
  //     // s2_vehiculosOfertados.setValidators([Validators.required]);
  //   }

  //   // s1_paisesOperar.updateValueAndValidity();
  //   // s2_tipoCargaTransportarIda.updateValueAndValidity();
  //   // s2_tipoCargaTransportarRegreso.updateValueAndValidity();
  //   // s2_periodoViajeOsacional.updateValueAndValidity();
  //   // s2_pasoFronteraIda.updateValueAndValidity();
  //   // s2_pasoFronteraRegreso.updateValueAndValidity();
  //   // s2_cantidadViajes.updateValueAndValidity();
  //   // s2_vehiculosOfertados.updateValueAndValidity();

  //   setTimeout(() => {
  //     this.acc.expand(seccion1);
  //   }, 200);
  // }

  // actualizarValidatorSeccion1y2(seccion1: boolean) {
  //   const s1_paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'];
  //   const s2_tipoCargaTransportarIda = this.anexoFormulario.controls['s2_tipoCargaTransportarIda'];
  //   const s2_tipoCargaTransportarRegreso = this.anexoFormulario.controls['s2_tipoCargaTransportarRegreso'];
  //   const s2_periodoViajeOsacional = this.anexoFormulario.controls['s2_periodoViajeOsacional'];
  //   const s2_pasoFronteraIda = this.anexoFormulario.controls['s2_pasoFronteraIda'];
  //   const s2_pasoFronteraRegreso = this.anexoFormulario.controls['s2_pasoFronteraRegreso'];
  //   const s2_cantidadViajes = this.anexoFormulario.controls['s2_cantidadViajes'];
  //   const s2_vehiculosOfertados = this.anexoFormulario.controls['s2_vehiculosOfertados'];

  //   if (seccion1 === true) {
  //     s2_tipoCargaTransportarIda.setValidators(null);
  //     s2_tipoCargaTransportarRegreso.setValidators(null);
  //     s2_periodoViajeOsacional.setValidators(null);
  //     s2_pasoFronteraIda.setValidators(null);
  //     s2_pasoFronteraRegreso.setValidators(null);
  //     s2_cantidadViajes.setValidators(null);
  //     s2_vehiculosOfertados.setValidators(null);

  //     s1_paisesOperar.setValidators(this.paisesOperarValidator());
  //   } else {
  //     s1_paisesOperar.setValidators(null);

  //     s2_tipoCargaTransportarIda.setValidators([Validators.required]);
  //     s2_tipoCargaTransportarRegreso.setValidators([Validators.required]);
  //     s2_periodoViajeOsacional.setValidators([Validators.required]);
  //     s2_pasoFronteraIda.setValidators([Validators.required]);
  //     s2_pasoFronteraRegreso.setValidators([Validators.required]);
  //     s2_cantidadViajes.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
  //     s2_vehiculosOfertados.setValidators([Validators.required]);
  //   }

  //   s1_paisesOperar.updateValueAndValidity();
  //   s2_tipoCargaTransportarIda.updateValueAndValidity();
  //   s2_tipoCargaTransportarRegreso.updateValueAndValidity();
  //   s2_periodoViajeOsacional.updateValueAndValidity();
  //   s2_pasoFronteraIda.updateValueAndValidity();
  //   s2_pasoFronteraRegreso.updateValueAndValidity();
  //   s2_cantidadViajes.updateValueAndValidity();
  //   s2_vehiculosOfertados.updateValueAndValidity();
  // }

  // onChangeInputPoliza(event) {
  //   if (event.target.files.length === 0)
  //     return

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfPolizaSeleccionado = event.target.files[0];
  //   event.target.value = "";
  //   this.filePdfPolizaPathName = null;
  // }


  // vistaPreviaPdfPoliza() {
  //   if (this.filePdfPolizaPathName) {
  //     this.funcionesMtcService.mostrarCargando();
  //     this.visorPdfArchivosService.get(this.filePdfPolizaPathName).subscribe(
  //       (file: Blob) => {
  //         this.funcionesMtcService.ocultarCargando();

  //         this.filePdfPolizaSeleccionado = file;
  //         this.filePdfPolizaPathName = null;

  //         this.visualizarDialogoPdfPoliza();
  //       },
  //       error => {
  //         this.funcionesMtcService
  //           .ocultarCargando()
  //           .mensajeError('Problemas para descargar Pdf');
  //       }
  //     );
  //   } else {
  //     this.visualizarDialogoPdfPoliza();
  //   }
  // };

  // visualizarDialogoPdfPoliza() {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(this.filePdfPolizaSeleccionado);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = "Vista Previa - Póliza de Seguro";
  // }

  // onChangeInputCaf(event) {
  //   if (event.target.files.length === 0)
  //     return

  //   if (event.target.files[0].type !== 'application/pdf') {
  //     event.target.value = "";
  //     return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
  //   }

  //   this.filePdfCafSeleccionado = event.target.files[0];
  //   event.target.value = "";
  // }

  // vistaPreviaCaf() {

  //   if (this.filePdfCafPathName) {
  //     this.funcionesMtcService.mostrarCargando();
  //     this.visorPdfArchivosService.get(this.filePdfCafPathName).subscribe(
  //       (file: Blob) => {
  //         this.funcionesMtcService.ocultarCargando();

  //         this.filePdfCafSeleccionado = <File>file;
  //         this.filePdfCafPathName = null;

  //         this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexoFormulario.get("placaRodajeForm").value);
  //       },
  //       error => {
  //         this.funcionesMtcService
  //           .ocultarCargando()
  //           .mensajeError('Problemas para descargar Pdf');
  //       }
  //     );
  //   } else {
  //     this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexoFormulario.get("placaRodajeForm").value);
  //   }

  // }

  // onChangeCaf(event: boolean) {
  //   this.visibleButtonCarf = event;

  //   if (this.visibleButtonCarf === true) {
  //     this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
  //       this.visibleButtonCarf = false;
  //       //this.cafForm = false;
  //       this.anexoFormulario.controls['cafForm'].setValue(false);
  //     });
  //   } else {
  //     this.filePdfCafSeleccionado = null;
  //     this.filePdfCafPathName = null;
  //   }
  // }

  // soloNumeros(event) {
  //   event.target.value = event.target.value.replace(/[^0-9]/g, '');
  // }

  // formInvalid(control: string) {
  //   return this.anexoFormulario.get(control).invalid &&
  //     (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
  // }

  // recuperarPaises() {

  //   this.funcionesMtcService.mostrarCargando();

  //   this.paisService.get<PaisResponse[]>('ARG,BOL,BRA,CHL,PRY,URY')
  //     .subscribe(
  //       data => {
  //         this.funcionesMtcService.ocultarCargando();

  //         data.map((item, index) => {
  //           item.text = item.text.capitalize();
  //           this.listaPaises.push(item);
  //           (this.anexoFormulario.get('s1_paisesOperar') as FormArray).push(this.fb.group({ checked: false, ...item }));
  //         });

  //         if (this.dataInput.rutaDocumento) {
  //           //RECUPERAMOS LOS DATOS
  //           this.funcionesMtcService.mostrarCargando();

  //           this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
  //             (dataAnexo: Anexo001_B17Response) => {
  //               this.funcionesMtcService.ocultarCargando();

  //               const metaData: any = JSON.parse(dataAnexo.metaData);

  //               this.idAnexo = dataAnexo.anexoId;

  //               let i = 0;

  //               //PERMISO ORIGINARIO

  //               //recorremos los paises:
  //               metaData.seccion1.paisesJson = {}

  //               for (i; i < metaData.seccion1.paisesOperar.length; i++) {
  //                 metaData.seccion1.paisesJson[metaData.seccion1.paisesOperar[i].value] = metaData.seccion1.paisesOperar[i];
  //               }

  //               i = 0;
  //               for (let control of this.anexoFormulario.controls["s1_paisesOperar"].value) {
  //                 if (metaData.seccion1.paisesJson[control.value]) {
  //                   this.anexoFormulario.get("s1_paisesOperar")["controls"][i]['controls']['checked'].setValue(metaData.seccion1.paisesJson[control.value].checked);
  //                 }
  //                 i++;
  //               }

  //               //PERMISO OCASIONAL
  //               this.anexoFormulario.get("s2_tipoCargaTransportarIda").setValue(metaData.seccion2.tipoCargaTransportarIda || '');
  //               this.anexoFormulario.get("s2_tipoCargaTransportarRegreso").setValue(metaData.seccion2.tipoCargaTransportarRegreso || '');
  //               this.anexoFormulario.get("s2_destinoViaje").setValue(metaData.seccion2.destinoViaje.value || '');
  //               this.anexoFormulario.get("s2_periodoViajeOsacional").setValue(metaData.seccion2.periodoViajeOcasional || '');
  //               this.anexoFormulario.get("s2_pasoFronteraIda").setValue(metaData.seccion2.pasosFronteraIda.value || '');
  //               this.anexoFormulario.get("s2_pasoFronteraRegreso").setValue(metaData.seccion2.pasosFronteraRegresa.value || '');
  //               this.anexoFormulario.get("s2_cantidadViajes").setValue(metaData.seccion2.cantidadViajes || '');
  //               this.anexoFormulario.get("s2_vehiculosOfertados").setValue(metaData.seccion2.vehiculosOfertados || '');

  //               this.filePdfPolizaPathName = metaData.seccion2.pathName || null;

  //               for (i = 0; i < metaData.seccion3.length; i++) {
  //                 this.listaFlotaVehicular.push({
  //                   placaRodaje: metaData.seccion3[i].placaRodaje,
  //                   soat: metaData.seccion3[i].soat,
  //                   citv: metaData.seccion3[i].citv,
  //                   caf: metaData.seccion3[i].caf == true || metaData.seccion3[i].caf === 'true' ? true : false,
  //                   pathName: metaData.seccion3[i].pathName,
  //                   file: null
  //                 });
  //               }
  //             },
  //             error => {
  //               // this.errorAlCargarData = true;
  //               this.funcionesMtcService
  //                 .ocultarCargando()
  //               //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
  //             });
  //         }
  //       },
  //       error => {
  //         this.errorAlCargarData = true;
  //         this.funcionesMtcService
  //           .ocultarCargando()
  //           .mensajeError('Problemas para cargar paises');
  //       }
  //     );
  // }

  // changePlacaRodaje() {
  //   this.anexoFormulario.controls['soatForm'].setValue('');
  //   this.anexoFormulario.controls['citvForm'].setValue('');
  // }

  // buscarPlacaRodaje() {
  //   const placaRodaje = this.anexoFormulario.controls['placaRodajeForm'].value.trim();
  //   if (placaRodaje.length !== 6)
  //     return;

  //   this.changePlacaRodaje();

  //   this.funcionesMtcService.mostrarCargando();

  //   this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
  //     respuesta => {
  //       this.funcionesMtcService.ocultarCargando();

  //       if (this.dataInput.validacionesPlaca === 1) {
  //         if (respuesta.soat.estado === '')
  //           return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
  //         if (respuesta.soat.estado !== 'VIGENTE')
  //           return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
  //         if (respuesta.citv.estado !== 'VIGENTE')
  //           return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
  //         if (respuesta.citv.tipoId != '23')
  //           return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
  //       }

  //       this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '(FALANTE)');
  //       this.anexoFormulario.controls['citvForm'].setValue(respuesta.citv.numero || '(FALANTE)');
  //     },
  //     error => {
  //       this.funcionesMtcService
  //         .ocultarCargando()
  //         .mensajeError('Error al consultar al servicio');
  //     }
  //   );
  // }

  // cancelarFlotaVehicular() {
  //   this.indexEditTabla = -1;

  //   this.anexoFormulario.controls['placaRodajeForm'].setValue('');
  //   this.anexoFormulario.controls['soatForm'].setValue('');
  //   this.anexoFormulario.controls['citvForm'].setValue('');
  //   this.anexoFormulario.controls['cafForm'].setValue(false);

  //   this.filePdfCafSeleccionado = null;
  //   this.filePdfCafPathName = null;

  //   this.visibleButtonCarf = false;
  // }

  // agregarFlotaVehicular() {

  //   if (
  //     this.anexoFormulario.controls['placaRodajeForm'].value.trim() === '' ||
  //     this.anexoFormulario.controls['soatForm'].value.trim() === '' ||
  //     this.anexoFormulario.controls['citvForm'].value.trim() === ''
  //   ) {
  //     return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
  //   }

  //   if (this.anexoFormulario.controls['cafForm'].value === true && this.filePdfCafSeleccionado === null)
  //     return this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');

  //   const placaRodaje = this.anexoFormulario.controls['placaRodajeForm'].value.trim().toUpperCase();
  //   const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

  //   //Validamos que la placa de rodaje no esté incluida en la grilla
  //   if (indexFind !== -1) {
  //     if (indexFind !== this.indexEditTabla)
  //       return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
  //   }


  //   if (this.indexEditTabla === -1) {
  //     this.listaFlotaVehicular.push({
  //       placaRodaje: placaRodaje,
  //       soat: this.anexoFormulario.controls['soatForm'].value,
  //       citv: this.anexoFormulario.controls['citvForm'].value,
  //       caf: this.anexoFormulario.controls['cafForm'].value,
  //       file: this.filePdfCafSeleccionado
  //     });
  //   } else {
  //     this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
  //     this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
  //     this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
  //     this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
  //     this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
  //   }

  //   this.cancelarFlotaVehicular();
  // }


  // modificarFlotaVehicular(item: A001_B17_Seccion3, index) {
  //   debugger;
  //   if (this.indexEditTabla !== -1)
  //     return;

  //   this.indexEditTabla = index;

  //   this.anexoFormulario.controls['placaRodajeForm'].setValue(item.placaRodaje);
  //   this.anexoFormulario.controls['soatForm'].setValue(item.soat);
  //   this.anexoFormulario.controls['citvForm'].setValue(item.citv);

  //   this.anexoFormulario.controls['cafForm'].setValue(item.caf);
  //   this.visibleButtonCarf = item.caf;

  //   this.filePdfCafSeleccionado = item.file;
  //   this.filePdfCafPathName = item.pathName;
  // }

  // eliminarFlotaVehicular(item: A001_B17_Seccion3, index) {
  //   if (this.indexEditTabla === -1) {

  //     this.funcionesMtcService
  //       .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
  //       .then(() => {
  //         this.listaFlotaVehicular.splice(index, 1);
  //       });
  //   }
  // }

  // verPdfCafGrilla(item: A001_B17_Seccion3) {
  //   if (this.indexEditTabla !== -1)
  //     return;

  //   if (item.pathName !== null) {
  //     this.funcionesMtcService.mostrarCargando();
  //     this.visorPdfArchivosService.get(item.pathName).subscribe(
  //       (file: Blob) => {
  //         this.funcionesMtcService.ocultarCargando();

  //         item.file = <File>file;
  //         item.pathName = null;

  //         this.visualizarGrillaPdf(item.file, item.placaRodaje);
  //       },
  //       error => {
  //         this.funcionesMtcService
  //           .ocultarCargando()
  //           .mensajeError('Problemas para descargar Pdf');
  //       }
  //     );
  //   } else {
  //     this.visualizarGrillaPdf(item.file, item.placaRodaje);
  //   }

  //   // const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   // const urlPdf = URL.createObjectURL(item.file);
  //   // modalRef.componentInstance.pdfUrl = urlPdf;
  //   // modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
  // }

  // visualizarGrillaPdf(file: File, placaRodaje: string) {
  //   const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  //   const urlPdf = URL.createObjectURL(file);
  //   modalRef.componentInstance.pdfUrl = urlPdf;
  //   modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + placaRodaje;
  // }

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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-B/27";

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "02", documento: 'Carnet de Extranjería' },
    { id: "03", documento: 'Pasaporte' },
    { id: "04", documento: 'RUC' }
  ];

  guardarAnexo() {

    

    let dataGuardar: Anexo001_B27Request = new Anexo001_B27Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    


    //-------------------------------------    
    //SECCION 1:
    dataGuardar.metaData.seccion1.telefono = this.anexoFormulario.controls['telefonoForm'].value;
    dataGuardar.metaData.seccion1.tipoDocumento.documento = this.listaTiposDocumentos.filter(item => item.id == this.anexoFormulario.get('tipoDocumentoForm').value)[0].documento;
    dataGuardar.metaData.seccion1.tipoDocumento.id = this.anexoFormulario.controls['tipoDocumentoForm'].value;
    dataGuardar.metaData.seccion1.ruc = this.anexoFormulario.controls['rucForm'].value;
    dataGuardar.metaData.seccion1.celular = this.anexoFormulario.controls['celularForm'].value.trim();
    dataGuardar.metaData.seccion1.correoElectronico = this.anexoFormulario.controls['correoElectronicoForm'].value.trim();
    dataGuardar.metaData.seccion1.numeroDocumento = this.anexoFormulario.controls['numeroDocumentoForm'].value;
    dataGuardar.metaData.seccion1.nombresApellidosRazonSocial = this.anexoFormulario.controls['nombresApellidosRazonSocialForm'].value.trim();
    //-------------------------------------
    //SECCION 2:
    dataGuardar.metaData.seccion2.departamento = this.anexoFormulario.controls['departamentoForm'].value;
    dataGuardar.metaData.seccion2.provincia = this.anexoFormulario.controls['provinciaForm'].value;
    dataGuardar.metaData.seccion2.distrito = this.anexoFormulario.controls['distritoForm'].value;
    dataGuardar.metaData.seccion2.domicilioLegal = this.anexoFormulario.controls['domicilioLegalForm'].value;

    //-------------------------------------    
    //SECCION 3:

    dataGuardar.metaData.seccion3.declaracionLugar = this.anexoFormulario.controls['declaracionLugarForm'].value;
    dataGuardar.metaData.seccion3.declaracionFecha = this.anexoFormulario.controls['declaracionFechaForm'].value;
    dataGuardar.metaData.seccion3.declaracionPrimero = this.anexoFormulario.controls['declaracionPrimeroForm'].value;


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



  // public findInvalidControls() {
  //   const invalid = [];
  //   const controls = this.anexoFormulario.controls;

  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //       invalid.push(name);
  //     }
  //   }
  //   return invalid;

  // }

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
          this.anexoFormulario.controls['domicilioLegalForm'].setValue(datos.domicilioLegal);
          this.anexoFormulario.controls['distritoForm'].setValue(datos.nombreDistrito);
          this.anexoFormulario.controls['provinciaForm'].setValue(datos.nombreProvincia);
          this.anexoFormulario.controls['departamentoForm'].setValue(datos.nombreDepartamento);
          // this.anexoFormulario.controls['numeroDocumentoRepresentanteForm'].setValue(datos.representanteLegal[0].nroDocumento);
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
  idAnexoMovimiento=0
  recuperarInformacion(){

    //si existe el documento
    if (this.dataInput.rutaDocumento) {
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo001_B27Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexoMovimiento = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          // this.anexo.get("ambitoOperacion").setValue(metaData.seccion1.ambitoOperacion);
          // this.anexo.get("dia").setValue(metaData.seccion1.dia);
          // this.anexo.get("mes").setValue(metaData.seccion1.mes);
          // this.anexo.get("anio").setValue(metaData.seccion1.anio);

          // let i = 0;

          // for (i = 0; i < metaData.seccion2.vehiculos.length; i++) {
          //   this.listaFlotaVehicular.push({
          //     placaRodaje: metaData.seccion2.vehiculos[i].placaRodaje,
          //     soat: metaData.seccion2.vehiculos[i].soat,
          //     citv: metaData.seccion2.vehiculos[i].citv,
          //     caf: metaData.seccion2.vehiculos[i].caf === true || metaData.seccion2.vehiculos[i].caf === 'true' ? true : false,
          //     cao: metaData.seccion2.vehiculos[i].cao === true || metaData.seccion2.vehiculos[i].cao === 'true' ? true : false,
          //     pathNameCaf: metaData.seccion2.vehiculos[i].pathNameCaf,
          //     pathNameCao: metaData.seccion2.vehiculos[i].pathNameCao,
          //     fileCaf: null,
          //     fileCao: null
          //   });
          // }

          // this.filePdfCroquisPathName=metaData.seccion2.pathName;
          // this.filePdfCroquisSeleccionado=null;

          // i = 0;

          // for (i = 0; i < metaData.seccion3.conductores.length; i++) {
          //   this.listaConductores.push({
          //     nroDni: metaData.seccion3.conductores[i].nroDni,
          //     nombresApellidos: metaData.seccion3.conductores[i].nombresApellidos,
          //     ape_Paterno:  metaData.seccion3.conductores[i].ape_Paterno,
          //     ape_Materno:  metaData.seccion3.conductores[i].ape_Materno,
          //     nombres:  metaData.seccion3.conductores[i].nombres,
          //     edad:  metaData.seccion3.conductores[i].edad,
          //     nroLicencia:  metaData.seccion3.conductores[i].nroLicencia,
          //     categoria:  metaData.seccion3.conductores[i].categoria
          //   });
          // }



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

}
