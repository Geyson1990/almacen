import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_E28Request } from '../../../../../core/models/Anexos/Anexo002_E28/Anexo002_E28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002E28Service } from '../../../../../core/services/anexos/anexo002-e28.service';
import { Seccion1, Seccion2, Seccion3, Seccion4, Seccion5 } from '../../../../../core/models/Anexos/Anexo002_E28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_E28Response } from 'src/app/core/models/Anexos/Anexo002_E28/Anexo002_E28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';


@Component({
  selector: 'app-anexo002-e28',
  templateUrl: './anexo002-e28.component.html',
  styleUrls: ['./anexo002-e28.component.css']
})
export class Anexo002E28Component implements OnInit, AfterViewInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

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
  
  public suscritos: any[];
  public recordIndexToEdit: number;
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
    private anexoService: Anexo002E28Service,
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
    this.recordIndexToEdit = -1;
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
        servicio:[{value:'',disabled:true},[Validators.required]],
      }),
      Seccion3:this.fb.group({
        localidad:[{value:'',disabled:true},[Validators.required]],
      }),
      Seccion4:this.fb.group({
        finalidad             : [{value:'',disabled:true},[Validators.required]],
        franjaEducativaComercial : ['',[Validators.required]],
        franjaEducativaComunitaria :['',[Validators.required]],
      }),
      Seccion5:this.fb.group({
        porcentajeA: ['',[Validators.required]],
        porcentajeB: ['',[Validators.required]],
        porcentajeC: ['',[Validators.required]],
        totalPorcentaje: [{value:'',disabled:true},[Validators.required]],
      }),
      Seccion6:this.fb.group({
        declaracion:[true],
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
   get f_s2_servicio(): AbstractControl {return this.f_Seccion2.get(['servicio']);}
   get f_Seccion3(): UntypedFormGroup { return this.formAnexo.get('Seccion3') as UntypedFormGroup; }
   get f_s3_localidad(): AbstractControl {return this.f_Seccion3.get(['localidad']);}
   get f_Seccion4(): UntypedFormGroup { return this.formAnexo.get('Seccion4') as UntypedFormGroup; }
   get f_s4_finalidad(): AbstractControl {return this.f_Seccion4.get(['finalidad']);}
   get f_s4_franjaEducativaComercial():AbstractControl {return this.f_Seccion4.get(['franjaEducativaComercial']);}
   get f_s4_franjaEducativaComunitaria():AbstractControl {return this.f_Seccion4.get(['franjaEducativaComunitaria']);}
   get f_Seccion5(): UntypedFormGroup { return this.formAnexo.get('Seccion5') as UntypedFormGroup; }
   get f_s5_porcentajeA():AbstractControl {return this.f_Seccion5.get(['porcentajeA']);}
   get f_s5_porcentajeB():AbstractControl {return this.f_Seccion5.get(['porcentajeB']);}
   get f_s5_porcentajeC():AbstractControl {return this.f_Seccion5.get(['porcentajeC']);}
   get f_s5_totalPorcentaje():AbstractControl {return this.f_Seccion5.get(['totalPorcentaje']);}
   get f_Seccion6(): UntypedFormGroup { return this.formAnexo.get('Seccion6') as UntypedFormGroup; }
   get f_s6_declaracion():AbstractControl {return this.f_Seccion6.get(['declaracion']);}
   get f_s6_tipoDocumentoSolicitante():AbstractControl {return this.f_Seccion6.get(['tipoDocumentoSolicitante']);}
   get f_s6_numeroDocumentoSolicitante():AbstractControl {return this.f_Seccion6.get(['numeroDocumentoSolicitante']);}
   get f_s6_nombresSolicitante():AbstractControl {return this.f_Seccion6.get(['nombresSolicitante']);}
   // FIN GET FORM formularioFG

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        //this.tipoDocumento = metaDataForm.seccion1.nroRuc && metaDataForm.seccion1.personaJuridica ? 'RUC' : metaDataForm.seccion1.dni  ? 'DNI' : '';
        this.tipoDocumento = metaDataForm.seccion6.tipoDocumento;
        
        this.f_s3_localidad.setValue(metaDataForm.seccion3.localidad);
        
        switch(metaDataForm.seccion2.modalidad){
          case "fm":
          case "om":
          case "oct":
          case "oci": this.f_s2_servicio.setValue("sonora"); break;
          case "vhf":
          case "uhf": this.f_s2_servicio.setValue("television"); break;
        }
        

        if(metaDataForm.seccion6.razonSocial!=""){
          this.f_s1_solicitante.setValue(metaDataForm.seccion6.razonSocial);
          this.f_s6_tipoDocumentoSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.tipoDocumento =="01"?"DNI":metaDataForm.seccion6.RepresentanteLegal.tipoDocumento=="04"?"CE":"");
          this.f_s6_numeroDocumentoSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.numeroDocumento);
          this.f_s6_nombresSolicitante.setValue(metaDataForm.seccion6.RepresentanteLegal.nombres + ' '+ metaDataForm.seccion6.RepresentanteLegal.apellidoPaterno + ' '+ metaDataForm.seccion6.RepresentanteLegal.apellidoMaterno);
        }else{
          this.f_s1_solicitante.setValue(metaDataForm.seccion6.nombresApellidos);
          this.f_s6_tipoDocumentoSolicitante.setValue(this.tipoDocumento=="01"?"DNI":this.tipoDocumento=="04"?"CE":"");
          this.f_s6_numeroDocumentoSolicitante.setValue(metaDataForm.seccion6.numeroDocumento);
          this.f_s6_nombresSolicitante.setValue(metaDataForm.seccion6.nombresApellidos);
        }

        this.f_s4_finalidad.setValue(metaDataForm.seccion4.finalidad);
        switch(metaDataForm.seccion4.finalidad.trim()){
          case "educativa": this.f_s4_franjaEducativaComercial.clearValidators(); 
                            this.f_s4_franjaEducativaComunitaria.clearValidators();
                            this.f_s4_franjaEducativaComercial.disable();
                            this.f_s4_franjaEducativaComunitaria.disable();

                            this.f_s4_franjaEducativaComercial.updateValueAndValidity({ emitEvent: false });
                            this.f_s4_franjaEducativaComunitaria.updateValueAndValidity({ emitEvent: false });
                            break;
          case "comercial": this.f_s4_franjaEducativaComunitaria.clearValidators();
                            this.f_s4_franjaEducativaComunitaria.disable();
                            this.f_s4_franjaEducativaComunitaria.updateValueAndValidity({ emitEvent: false });
                            break;

          case "comunitaria": this.f_s4_franjaEducativaComercial.clearValidators(); 
                              this.f_s4_franjaEducativaComercial.disable();
                              this.f_s4_franjaEducativaComercial.updateValueAndValidity({ emitEvent: false });
                              break;
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
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_E28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        this.f_s1_solicitante.setValue(metaData.seccion1.solicitante);
        this.f_s2_servicio.setValue(metaData.seccion2.servicio);
        this.f_s3_localidad.setValue(metaData.seccion3.localidad);
        this.f_s4_finalidad.setValue(metaData.seccion4.finalidad);
        this.f_s4_franjaEducativaComercial.setValue(metaData.seccion4.franjaEducativaComercial);
        this.f_s4_franjaEducativaComunitaria.setValue(metaData.seccion4.franjaEducativaComunitaria);
        
        this.f_s5_porcentajeA.setValue(metaData.seccion5.porcentajeA);
        this.f_s5_porcentajeB.setValue(metaData.seccion5.porcentajeB);
        this.f_s5_porcentajeC.setValue(metaData.seccion5.porcentajeC);

        this.f_s5_totalPorcentaje.setValue(parseFloat(this.f_s5_porcentajeA.value) + parseFloat(this.f_s5_porcentajeB.value) + parseFloat(this.f_s5_porcentajeC.value));

        this.f_s6_declaracion.setValue(metaData.seccion5.declaracion);
        this.f_s6_tipoDocumentoSolicitante.setValue(metaData.seccion5.tipoDocumentoSolicitante);
        this.f_s6_numeroDocumentoSolicitante.setValue(metaData.seccion5.numeroDocumentoSolicitante);
        this.f_s6_nombresSolicitante.setValue(metaData.seccion5.nombresSolicitante);

      } catch (error) {
        console.error('Error cargarDatos: ', error);
        // this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }else{
        console.log(this.f_s4_finalidad.value.trim());
        switch(this.f_s4_finalidad.value.trim()){
          case "educativa": this.f_s4_franjaEducativaComercial.clearValidators(); 
                            this.f_s4_franjaEducativaComunitaria.clearValidators();
                            
                            this.formAnexo.updateValueAndValidity({ emitEvent: false });
                            break;
          case "comercial": this.f_s4_franjaEducativaComunitaria.clearValidators();
                            this.formAnexo.updateValueAndValidity({ emitEvent: false });
                            break;

          case "comunitaria": this.f_s4_franjaEducativaComercial.clearValidators(); 
                              this.formAnexo.updateValueAndValidity({ emitEvent: false });
                              break;
        }
    }
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
  
    this.formAnexo.controls['s2_nombresApellidos'].setValue('');
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaAnexo = finalDate;
  }

  onChangeTotal(){
    let porcentajeA: number =0;
    let porcentajeB: number =0;
    let porcentajeC: number=0;
    console.log(this.f_s5_porcentajeB.value);
    let total: number;
    if(this.f_s5_porcentajeA.value!=null && this.f_s5_porcentajeA.value!='')
    porcentajeA = parseFloat(this.f_s5_porcentajeA.value);

    if(this.f_s5_porcentajeB.value!=null && this.f_s5_porcentajeB.value!= '')
    porcentajeB = parseFloat(this.f_s5_porcentajeB.value);

    if(this.f_s5_porcentajeC.value!=null && this.f_s5_porcentajeC.value!= '')
    porcentajeC = parseFloat(this.f_s5_porcentajeC.value);

    total = porcentajeA + porcentajeB + porcentajeC;
    this.f_s5_totalPorcentaje.setValue(total.toString());
  }

  save(){
    const dataGuardar: Anexo002_E28Request = new Anexo002_E28Request();
    if (parseFloat(this.f_s5_totalPorcentaje.value) < 100)
      return this.funcionesMtcService.mensajeError('El porcentaje total del TIPO DE PROGRAMACION debe sumar 100%');
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    let seccion1: Seccion1 = new Seccion1();
    seccion1.solicitante = this.f_s1_solicitante.value;

    let seccion2: Seccion2 = new Seccion2();
    seccion2.servicio = this.f_s2_servicio.value;

    let seccion3: Seccion3 = new Seccion3();
    seccion3.localidad = this.f_s3_localidad.value;

    let seccion4: Seccion4 = new Seccion4();
    seccion4.finalidad = this.f_s4_finalidad.value;
    seccion4.franjaEducativaComercial = this.f_s4_franjaEducativaComercial.value;
    seccion4.franjaEducativaComunitaria = this.f_s4_franjaEducativaComunitaria.value;

    let seccion5: Seccion5 = new Seccion5();
    seccion5.declaracion = this.f_s6_declaracion.value;
    seccion5.porcentajeA = this.f_s5_porcentajeA.value;
    seccion5.porcentajeB = this.f_s5_porcentajeB.value;
    seccion5.porcentajeC = this.f_s5_porcentajeC.value;
    
    seccion5.tipoDocumentoSolicitante = this.f_s6_tipoDocumentoSolicitante.value;
    seccion5.numeroDocumentoSolicitante = this.f_s6_numeroDocumentoSolicitante.value;
    seccion5.nombresSolicitante = this.f_s6_nombresSolicitante.value;

    dataGuardar.metaData.seccion1 = seccion1;
    dataGuardar.metaData.seccion2 = seccion2;
    dataGuardar.metaData.seccion3 = seccion3;
    dataGuardar.metaData.seccion4 = seccion4;
    dataGuardar.metaData.seccion5 = seccion5;

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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-E/28";
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
