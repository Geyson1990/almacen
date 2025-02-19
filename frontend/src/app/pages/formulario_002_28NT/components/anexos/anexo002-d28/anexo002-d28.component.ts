import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_D28Request } from '../../../../../core/models/Anexos/Anexo002_D28/Anexo002_D28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002D28Service } from '../../../../../core/services/anexos/anexo002-d28.service';
import { Seccion1, Seccion2, Seccion3, Seccion4 } from '../../../../../core/models/Anexos/Anexo002_D28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_D28Response } from 'src/app/core/models/Anexos/Anexo002_D28/Anexo002_D28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';


@Component({
  selector: 'app-anexo002-d28',
  templateUrl: './anexo002-d28.component.html',
  styleUrls: ['./anexo002-d28.component.css']
})
export class Anexo002D28Component implements OnInit, AfterViewInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpEstudio') ubigeoEstudioComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpPlanta')  ubigeoPlantaComponent: UbigeoComponent;

  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;

    codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  anexoTramiteReqId: number = 0;
  tipoDocumento:string  = "";
  tipoSolicitante:string = "";

  tipoPersona: number;
  dniPersona: string;
  ruc: string;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carné de Extranjería' }
  ];


  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
    private anexoService: Anexo002D28Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
  ) {
    
    this.idAnexo = 0;
    
  }

  ngOnInit(): void {
    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoPersona = 1; // persona natural
        this.dniPersona = this.seguridadService.getNumDoc();
        this.tipoSolicitante = 'PN';
        break;

      case '00002':
        this.tipoPersona = 2; // persona juridica
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.tipoSolicitante = 'PJ';
        break;

      case '00003':
        this.tipoPersona = 3;
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        break;

      case '00004':
        this.tipoPersona = 4; // persona extranjera
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = '';
        this.tipoSolicitante = 'PE';
        break;

      case '00005':
        this.tipoPersona = 5; // persona natural con ruc
        this.dniPersona = this.seguridadService.getNumDoc();
        this.ruc = this.seguridadService.getCompanyCode();
        this.tipoSolicitante = 'PNR';
        break;
    }

    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();

    for (let i = 0; i < this.dataRequisitosInput.length; i++) {

      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }
    }
    //this.recuperarInformacion();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

  }

  async ngAfterViewInit(): Promise<void> {
    await this.datosSolicitante(this.dataInput.tramiteReqRefId);

    setTimeout(async () => {
      await this.cargarDatos();
    });
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      Seccion1:this.fb.group({
        solicitante:[{value:'',disabled:true},[Validators.required]],
      }),
      Seccion2:this.fb.group({
        finalidad    : [{value:'',disabled:true},[Validators.required]],
        localidad    : [{value:'',disabled:true},[Validators.required]],
        inversionEstudios : ['',[Validators.required]],
        inversionEnlace   : ['',[Validators.required]],
        inversionPlanta   : ['',[Validators.required]],
        inversionOtro     : ['',[Validators.required]],
        inversionInstalaciones: ['', [Validators.required]],
        total : [{value:'0.00', disabled:true},[Validators.required]],
      }),
      Seccion3:this.fb.group({
        declaracion:[true],
      }),
      Seccion4:this.fb.group({
        tipoDocumentoSolicitante:['',[Validators.required]],
        numeroDocumentoSolicitante:['',[Validators.required]],
        nombresSolicitante   :['',[Validators.required]],
      }),
    });
  }

   // GET FORM formularioFG

   get f_Seccion1(): UntypedFormGroup { return this.formAnexo.get('Seccion1') as UntypedFormGroup; }
   get f_s1_solicitante(): AbstractControl  { return this.f_Seccion1.get(['solicitante']) }
   get f_Seccion2(): UntypedFormGroup { return this.formAnexo.get('Seccion2') as UntypedFormGroup; }
   get f_s2_Finalidad():AbstractControl { return this.f_Seccion2.get(['finalidad']); }
   get f_s2_Localidad():AbstractControl {return this.f_Seccion2.get(['localidad']);}
   get f_s2_InversionEstudios(): AbstractControl { return this.f_Seccion2.get(['inversionEstudios']); }
   get f_s2_InversionEnlace(): AbstractControl { return this.f_Seccion2.get(['inversionEnlace']); }
   get f_s2_InversionPlanta(): AbstractControl { return this.f_Seccion2.get(['inversionPlanta']); }
   get f_s2_InversionOtro(): AbstractControl { return this.f_Seccion2.get(['inversionOtro']); }
   get f_s2_InversionInstalaciones(): AbstractControl { return this.f_Seccion2.get(['inversionInstalaciones']); }
   get f_s2_Total(): AbstractControl { return this.f_Seccion2.get(['total']); }
   get f_Seccion3(): UntypedFormGroup { return this.formAnexo.get('Seccion3') as UntypedFormGroup; }
   get f_s3_declaracion():AbstractControl {return this.f_Seccion3.get(['declaracion']);}
   get f_Seccion4(): UntypedFormGroup { return this.formAnexo.get('Seccion4') as UntypedFormGroup; }
   get f_s4_tipoDocumentoSolicitante():AbstractControl {return this.f_Seccion4.get(['tipoDocumentoSolicitante']);}
   get f_s4_numeroDocumentoSolicitante():AbstractControl {return this.f_Seccion4.get(['numeroDocumentoSolicitante']);}
   get f_s4_nombresSolicitante():AbstractControl {return this.f_Seccion4.get(['nombresSolicitante']);}
   // FIN GET FORM formularioFG

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        
        this.tipoDocumento = metaDataForm.seccion6.tipoDocumento;
        
        this.f_s2_Finalidad.setValue(metaDataForm.seccion2.modalidad);
        this.f_s2_Localidad.setValue(metaDataForm.seccion3.localidad);

        if(metaDataForm.seccion6.razonSocial!=""){
          this.f_s1_solicitante.setValue(metaDataForm.seccion6.razonSocial);
          this.f_s4_tipoDocumentoSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.tipoDocumento =="01"?"DNI":metaDataForm.seccion6.RepresentanteLegal.tipoDocumento=="04"?"CE":"");
          this.f_s4_numeroDocumentoSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.numeroDocumento);
          this.f_s4_nombresSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.nombres + ' '+ metaDataForm.seccion6.RepresentanteLegal.apellidoPaterno + ' '+ metaDataForm.seccion6.RepresentanteLegal.apellidoMaterno);
        }else{
          this.f_s1_solicitante.setValue(metaDataForm.seccion6.nombresApellidos);
          this.f_s4_tipoDocumentoSolicitante.setValue(this.tipoDocumento=="01"?"DNI":this.tipoDocumento=="04"?"CE":"");
          this.f_s4_numeroDocumentoSolicitante.setValue(metaDataForm.seccion6.numeroDocumento);
          this.f_s4_nombresSolicitante.setValue(metaDataForm.seccion6.nombresApellidos);
        }
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );
  }

  async cargarDatos(): Promise<void> {
    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      this.funcionesMtcService.mostrarCargando();

      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_D28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        this.f_s1_solicitante.setValue(metaData.seccion1.solicitante);
        this.f_s2_Finalidad.setValue(metaData.seccion2.finalidad);
        this.f_s2_Localidad.setValue(metaData.seccion2.localidad);
        this.f_s2_InversionEstudios.setValue(metaData.seccion2.inversionEstudios);
        this.f_s2_InversionEnlace.setValue(metaData.seccion2.inversionEnlace);
        this.f_s2_InversionPlanta.setValue(metaData.seccion2.inversionPlanta);
        this.f_s2_InversionOtro.setValue(metaData.seccion2.inversionOtro);
        this.f_s2_InversionInstalaciones.setValue(metaData.seccion2.inversionInstalaciones);
        this.f_s2_Total.setValue(metaData.seccion2.total);
        this.f_s3_declaracion.setValue(metaData.seccion3.declaracion);
        this.f_s4_tipoDocumentoSolicitante.setValue(metaData.seccion4.tipoDocumentoSolicitante);
        this.f_s4_numeroDocumentoSolicitante.setValue(metaData.seccion4.numeroDocumentoSolicitante);
        this.f_s4_nombresSolicitante.setValue(metaData.seccion4.nombresSolicitante);

      } catch (error) {
        console.error('Error cargarDatos: ', error);
        // this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }else{
      this.f_s2_InversionEstudios.setValue("0.00");
      this.f_s2_InversionEnlace.setValue("0.00");
      this.f_s2_InversionPlanta.setValue("0.00");
      this.f_s2_InversionOtro.setValue("0.00");
      this.f_s2_InversionInstalaciones.setValue("0.00");
      this.f_s2_Total.setValue("0.00");
    }
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
  
    //this.formAnexo.controls['s2_nombresApellidos'].setValue('');
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaAnexo = finalDate;
  }

  onChangeTotal(){
    
    let total: number = parseFloat(this.f_s2_InversionEstudios.value) + parseFloat(this.f_s2_InversionEnlace.value) + parseFloat(this.f_s2_InversionPlanta.value) + parseFloat(this.f_s2_InversionOtro.value) + parseFloat(this.f_s2_InversionInstalaciones.value);
    this.f_s2_Total.setValue(total.toString());
  }

  save(){
    console.log("Inversion:" + this.f_s2_InversionEstudios.value);
    if(parseFloat(this.f_s2_InversionEstudios.value) == 0 || parseFloat(this.f_s2_InversionEnlace.value) == 0 || parseFloat(this.f_s2_InversionPlanta.value) == 0 ||
       parseFloat(this.f_s2_InversionOtro.value) == 0 || parseFloat(this.f_s2_InversionInstalaciones.value) == 0 || parseFloat(this.f_s2_Total.value) == 0 ){
        return this.funcionesMtcService.mensajeError('Debe ingresar la inversión proyectada en todos los campos.');
       }
    
    
    const dataGuardar: Anexo002_D28Request = new Anexo002_D28Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;


    let seccion1: Seccion1 = new Seccion1();
    seccion1.solicitante = this.f_s1_solicitante.value;

    let seccion2: Seccion2 = new Seccion2();
    seccion2.finalidad = this.f_s2_Finalidad.value;
    seccion2.localidad = this.f_s2_Localidad.value;
    seccion2.inversionEstudios = this.f_s2_InversionEstudios.value;
    seccion2.inversionEnlace = this.f_s2_InversionEnlace.value;
    seccion2.inversionPlanta = this.f_s2_InversionPlanta.value;
    seccion2.inversionOtro = this.f_s2_InversionOtro.value;
    seccion2.inversionInstalaciones = this.f_s2_InversionInstalaciones.value;
    seccion2.total = this.f_s2_Total.value;
    
    let seccion3: Seccion3 = new Seccion3();
    seccion3.declaracion = this.f_s3_declaracion.value;

    let seccion4: Seccion4 = new Seccion4();
    seccion4.tipoDocumentoSolicitante = this.f_s4_tipoDocumentoSolicitante.value;
    seccion4.numeroDocumentoSolicitante = this.f_s4_numeroDocumentoSolicitante.value;
    seccion4.nombresSolicitante = this.f_s4_nombresSolicitante.value;

    dataGuardar.metaData.seccion1 = seccion1;
    dataGuardar.metaData.seccion2 = seccion2;
    dataGuardar.metaData.seccion3 = seccion3;
    dataGuardar.metaData.seccion4 = seccion4;

    console.log(JSON.stringify(dataGuardar, null, 10));
    console.log(JSON.stringify(dataGuardar));
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          this.anexoService.post<any>(dataGuardarFormData)
          // this.anexoService.post<any>(dataGuardar)
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
                this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
              }
            );
        }
    });
  }

  formInvalid(control: string) : boolean {
    if(this.formAnexo.get(control))
    return this.formAnexo.get(control).invalid  && (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
  }
  
  descargarPdf() {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
    // this.anexoService.readPostFie(this.idAnexo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-C/28";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  get form() { return this.formAnexo.controls; }
}
