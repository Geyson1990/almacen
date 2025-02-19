import { Component, OnInit, Input, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_A28Request } from '../../../../../core/models/Anexos/Anexo002_A28NT/Anexo002_A28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002A28Service } from '../../../../../core/services/anexos/anexo002-a28.service';
import { AnexoSolicitado, MetaData } from '../../../../../core/models/Anexos/Anexo002_A28NT/MetaData';
import { Familiar, Parentesco } from '../../../../../core/models/Anexos/Anexo002_A28NT/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_A28Response } from 'src/app/core/models/Anexos/Anexo002_A28NT/Anexo002_A28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-anexo002-a28',
  templateUrl: './anexo002-a28.component.html',
  styleUrls: ['./anexo002-a28.component.css']
})
export class Anexo002A28Component implements OnInit, AfterViewInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpPersonaNatural') ubigeoPersonaNaturalComponent: UbigeoComponent;

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

  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];

  idDep: number;
  idProv: number;

  disableBtnBuscar = false;

  public suscritos: any[][];
  public recordIndexToEdit: number; 
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carné de Extranjería' }
  ];
  listaParentesco: Parentesco[] = [
    { id: 1, descripcion: 'PADRE' },
    { id: 2, descripcion: 'MADRE' },
    { id: 3, descripcion: 'CONYUGE/CONVIVIENTE' },
    { id: 4, descripcion: 'HIJO (A)' },
    { id: 5, descripcion: 'HERMANO(A)' }
  ];

  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
    private anexoService: Anexo002A28Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
  ) {
    this.suscritos = [];
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
    this.formAnexo = this.fb.group({
      a_AnexosFA : this.fb.array([], [Validators.required])
    })
    //this.createForm();
    

    /*this.f_s1_pn_Departamento.enable({ emitEvent: false });
    this.f_s1_pn_Provincia.enable({ emitEvent: false });
    this.f_s1_pn_Distrito.enable({ emitEvent: false });*/

    
    for (let i = 0; i < this.dataRequisitosInput.length; i++) {

      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }

      /*if(this.dataRequisitosInput[i].codigoFormAnexo=='ANEXO_002_A28'){
        this.anexoTramiteReqId = this.dataRequisitosInput[i].tramiteReqId;
        if(this.dataRequisitosInput[i].movId=== 0){
          const nombreAnexo = this.dataRequisitosInput[i].codigoFormAnexo.split("_");
          this.nombreAnexoDependiente = nombreAnexo[0] + " " + nombreAnexo[1] + "-" + nombreAnexo[2];
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Debe completar el ' + this.nombreAnexoDependiente);
          return;
        }
      }*/
    }
    //this.recuperarInformacion();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

  }

  async ngAfterViewInit(): Promise<void> {
    this.departamentos();
    await this.cargarDatos();
    setTimeout(async () => {

    });
  }

  addAnexoSolicitado(btnSubmit: HTMLButtonElement) : void {
    btnSubmit.disabled = true;

    this.funcionesMtcService
    .mensajeConfirmar('¿Está seguro de agregar una nuevo Anexo 002-A/28?')
    .then(() => {
      this.addAnexoFG();
    });

    btnSubmit.disabled = false;
  }

  private addAnexoFG(): void{
    const newformAnexo = this.fb.group({
      Seccion1:this.fb.group({
          PersonaNatural : this.fb.group({
            pn_tipodocumento: [{value: '', disabled: false}, [Validators.required]],
            pn_numerodocumento:[{value: '',disabled: false}, [Validators.required]],
            pn_nombres      : [{value: '', disabled: true},  [Validators.required, Validators.maxLength(100)]],
            pn_domicilio    : [{value: '', disabled: false}, [Validators.required, Validators.maxLength(100)]],
            pn_departamento : [{value: '', disabled: false}, [Validators.required]],
            pn_provincia    : [{value: '', disabled: false}, [Validators.required]],
            pn_distrito     : [{value: '', disabled: false}, [Validators.required]],
            pn_telefono     : [{value: '', disabled: false}, [Validators.required, Validators.maxLength(9)]],
            pn_celular      : [{value: '', disabled: false}, [Validators.required]],
            pn_correo       : [{value: '', disabled: false}, [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
            pn_peruano      : [true, [Validators.required]],
            pn_nacionalidad : ['', [Validators.required]],
            pn_ocupacion    : ['', [Validators.required]],
            pn_centrolaboral: ['', [Validators.required]],
        }),
      }),
      s2_tipoDocumentoFamiliar: [''],
      s2_numeroDocumentoFamiliar: [''],
      s2_nombresApellidos: [''],
      s2_parentesco: [''],
      s2_ocupacion: [''],
      declaracion:[true]
    });

    this.a_AnexosFA.push(newformAnexo);
  }

   // GET FORM formularioFG
   get a_AnexosFA(): UntypedFormArray {return this.formAnexo.get(['a_AnexosFA']) as UntypedFormArray;}

   f_Seccion1(index:number): UntypedFormGroup { return this.a_AnexosFA.get([index,'Seccion1']) as UntypedFormGroup; }
   f_s1_PersonaNatural(index:number): UntypedFormGroup { return this.f_Seccion1(index).get('PersonaNatural') as UntypedFormGroup; }
   f_s1_tipoDocumento(index:number):UntypedFormControl { return this.f_s1_PersonaNatural(index).get('tipodocumento') as UntypedFormControl; }
   f_s1_numeroDocumento(index:number):UntypedFormControl {return this.f_s1_PersonaNatural(index).get('numerodocumento') as UntypedFormControl;}
   f_s1_pn_tipoDocumento(index:number):UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_tipodocumento') as UntypedFormControl; }
   f_s1_pn_numeroDocumento(index:number):UntypedFormControl {return this.f_s1_PersonaNatural(index).get('pn_numerodocumento') as UntypedFormControl;}
   f_s1_pn_Nombres(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_nombres') as UntypedFormControl; }
   f_s1_pn_Domicilio(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_domicilio') as UntypedFormControl; }
   f_s1_pn_Departamento(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_departamento') as UntypedFormControl; }
   f_s1_pn_Provincia(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_provincia') as UntypedFormControl; }
   f_s1_pn_Distrito(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_distrito') as UntypedFormControl; }
   f_s1_pn_Telefono(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_telefono') as UntypedFormControl; }
   f_s1_pn_Celular(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_celular') as UntypedFormControl; }
   f_s1_pn_Correo(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_correo') as UntypedFormControl; }
   f_s1_pn_Peruano(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_peruano') as UntypedFormControl; }
   f_s1_pn_Nacionalidad(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_nacionalidad') as UntypedFormControl; }
   f_s1_pn_Ocupacion(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_ocupacion') as UntypedFormControl; }
   f_s1_pn_CentroLaboral(index:number): UntypedFormControl { return this.f_s1_PersonaNatural(index).get('pn_centrolaboral') as UntypedFormControl; }
   f_declaracion(index:number):UntypedFormControl {return this.a_AnexosFA.get([index,'declaracion']) as UntypedFormControl;}
   // FIN GET FORM formularioFG

  async datosSolicitante(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        this.tipoDocumento = metaDataForm.seccion6.tipoDocumento;
        
        if(metaDataForm.seccion6.tipoSolicitante=="PJ"){
          this.f_s1_pn_numeroDocumento(0).setValue(metaDataForm.seccion6.RepresentanteLegal.numeroDocumento);
          this.f_s1_pn_Nombres(0).setValue(metaDataForm.seccion6.RepresentanteLegal.nombres + ' ' + metaDataForm.seccion6.RepresentanteLegal.apellidoPaterno + ' ' + metaDataForm.seccion6.RepresentanteLegal.apellidoMaterno );
          this.f_s1_pn_Domicilio(0).setValue(metaDataForm.seccion6.RepresentanteLegal.domicilioLegal);
          this.f_s1_pn_Departamento(0).setValue(metaDataForm.seccion6.pn_departamento.id);
          this.f_s1_pn_Provincia(0).setValue(metaDataForm.seccion6.pn_provincia.id);
          this.f_s1_pn_Distrito(0).setValue(metaDataForm.seccion6.pn_distrito.id);
          this.f_s1_pn_Telefono(0).setValue(metaDataForm.seccion6.telefono);
          this.f_s1_pn_Celular(0).setValue(metaDataForm.seccion6.celular);
          this.f_s1_pn_Correo(0).setValue(metaDataForm.seccion6.email);
        }else{
          this.f_s1_pn_numeroDocumento(0).setValue(metaDataForm.seccion6.numeroDocumento);
          this.f_s1_pn_Nombres(0).setValue(metaDataForm.seccion6.nombresApellidos);
          this.f_s1_pn_Domicilio(0).setValue(metaDataForm.seccion6.domicilioLegal);
          this.f_s1_pn_Provincia(0).setValue(metaDataForm.seccion6.pn_provincia.id);
          this.f_s1_pn_Distrito(0).setValue(metaDataForm.seccion6.pn_distrito.id);
          this.f_s1_pn_Departamento(0).setValue(metaDataForm.seccion6.pn_departamento.id);
          this.f_s1_pn_Telefono(0).setValue(metaDataForm.seccion6.telefono);
          this.f_s1_pn_Celular(0).setValue(metaDataForm.seccion6.celular);
          this.f_s1_pn_Correo(0).setValue(metaDataForm.seccion6.email);
        }
        this.f_s1_pn_numeroDocumento(0).disable();
        this.f_s1_pn_Nombres(0).disable();
        this.f_s1_pn_Domicilio(0).disable();
        /*this.f_s1_pn_Departamento(0).disable();
        this.f_s1_pn_Provincia(0).disable();
        this.f_s1_pn_Distrito(0).disable();*/
        this.f_s1_pn_Telefono(0).disable();
        this.f_s1_pn_Celular(0).disable();
        this.f_s1_pn_Correo(0).disable();

        switch(this.tipoDocumento){
          case "01":  this.f_s1_pn_tipoDocumento(0).setValue(this.tipoDocumento);
                      this.f_s1_pn_tipoDocumento(0).disable();

                      this.f_s1_pn_Peruano(0).setValue(true);
                      this.f_s1_pn_Nacionalidad(0).setValue('');
                      this.f_s1_pn_Nacionalidad(0).disable();
                      this.f_s1_pn_Nacionalidad(0).clearValidators();
                      this.f_s1_pn_Nacionalidad(0).updateValueAndValidity();
                     
                      this.f_s1_pn_Telefono(0).clearValidators();
                      this.f_s1_pn_Telefono(0).updateValueAndValidity();

                      break;

          case "04":  this.f_s1_pn_tipoDocumento(0).setValue(this.tipoDocumento);
                      this.f_s1_pn_tipoDocumento(0).disable();

                      this.f_s1_pn_Peruano(0).setValue(false);
                      this.f_s1_pn_Peruano(0).disable();
                      this.f_s1_pn_Peruano(0).clearValidators();
                      this.f_s1_pn_Peruano(0).updateValueAndValidity();
                      this.f_s1_pn_Nacionalidad(0).enable();
                      this.f_s1_pn_Nacionalidad(0).setValidators([Validators.required]);
                      this.f_s1_pn_Nacionalidad(0).updateValueAndValidity();

                      this.f_s1_pn_Telefono(0).clearValidators();
                      this.f_s1_pn_Telefono(0).updateValueAndValidity();

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
    this.funcionesMtcService.mostrarCargando();
    if (this.dataInput.movId > 0) {
      // RECUPERAMOS LOS DATOS
      try {
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_A28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const { anexosSolicitados } = JSON.parse(dataAnexo.metaData) as MetaData;  //metaData: any 
        console.log(anexosSolicitados);
        
        if (!anexosSolicitados) {
          this.funcionesMtcService.mensajeError('Ha ocurrido un error al intentar obtener el anexo, por favor intentelo nuevamente o contactese con nosotros');
          return;
        }

        this.idAnexo = dataAnexo.anexoId;

        for (let i = 0; i < anexosSolicitados.length; i++){
          this.addAnexoFG();
          
          const{
            seccion1,
            seccion2
          } = anexosSolicitados[i]
          
          this.f_s1_pn_tipoDocumento(i).setValue(seccion1.tipoDocumento);
          this.f_s1_pn_numeroDocumento(i).setValue(seccion1.nroDocumento);
          this.f_s1_pn_Nombres(i).setValue(seccion1.nombreApellido);
          this.f_s1_pn_Domicilio(i).setValue(seccion1.domicilioLegal);
          this.f_s1_pn_Departamento(i).setValue(seccion1.departamento.id);
          this.f_s1_pn_Provincia(i).setValue(seccion1.provincia.id);
          this.f_s1_pn_Distrito(i).setValue(seccion1.distrito.id);
          this.f_s1_pn_Telefono(i).setValue(seccion1.telefono);
          this.f_s1_pn_Celular(i).setValue(seccion1.celular);
          this.f_s1_pn_Correo(i).setValue(seccion1.correo);
          this.f_s1_pn_Ocupacion(i).setValue(seccion1.ocupacion);
          this.f_s1_pn_CentroLaboral(i).setValue(seccion1.centroLaboral);
          this.f_s1_pn_Nacionalidad(i).setValue(seccion1.nacionalidad);

          let j = 0;
          if(seccion2.familiares != undefined){
            for (j = 0; j < seccion2.familiares.length; j++) {
              if(this.suscritos[i]==undefined){
                this.suscritos[i] = [];
              }
              
              this.suscritos[i].push({
                tipoDocumento: seccion2.familiares[j].tipoDocumentoFamiliar,
                numeroDocumento: seccion2.familiares[j].numeroDocumentoFamiliar,
                nombresApellidos: seccion2.familiares[j].nombresApellidos,
                parentesco: seccion2.familiares[j].parentesco,
                ocupacion: seccion2.familiares[j].ocupacion
              });
            }
          }
        }
      } catch (error) {
        console.error('Error cargarDatos: ', error);
        // this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }
    else{
      this.addAnexoFG();
      await this.datosSolicitante();
    }
    this.funcionesMtcService.ocultarCargando();
  }

  changeTipoDocumento(index:number) {
    this.a_AnexosFA.get([index,'s2_numeroDocumentoFamiliar']).setValue('');
    this.inputNumeroDocumento(index);
  }

  inputNumeroDocumento(index: number, event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    
    this.a_AnexosFA.get([index,'s2_nombresApellidos']).setValue('');
    //this.formAnexo.controls['s2_nombresApellidos'].setValue('');
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaAnexo = finalDate;
   }

  public addSuscrito(index: number){
    const idTipoDocumento = this.a_AnexosFA.get([index,'s2_tipoDocumentoFamiliar']).value.trim();
    const numeroDocumento = this.a_AnexosFA.get([index,'s2_numeroDocumentoFamiliar']).value.trim();
    const idParentesco = this.a_AnexosFA.get([index,'s2_parentesco']).value;
    const nombresApellidos = this.a_AnexosFA.get([index,'s2_nombresApellidos']).value.trim();
    const ocupacion = this.a_AnexosFA.get([index,'s2_ocupacion']).value.trim();
    if (
      numeroDocumento === '' ||
      nombresApellidos === '' ||
      idParentesco === '' ||
      ocupacion === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    
    if(this.suscritos.length>0){
      if(this.suscritos[index]!=undefined){
        const indexFound = this.suscritos[index].findIndex( item => item.numeroDocumento === numeroDocumento);

        if ( indexFound !== -1 ) {
          if ( indexFound !== this.recordIndexToEdit ) {
            return this.funcionesMtcService.mensajeError('El pariente ya se encuentra registrado');
          }
        }
      }
    }

    let documento: string= this.listaTiposDocumentos.filter(item => item.id == idTipoDocumento)[0].documento;
    const tipoDocumento: TipoDocumentoModel = { id: idTipoDocumento, documento }

    const id: number = idParentesco;
    let descripcion: string= this.listaParentesco.filter(item => item.id == idParentesco)[0].descripcion;
    const parentesco: Parentesco = { id, descripcion }

    if (this.recordIndexToEdit === -1) {
      if(this.suscritos[index]==undefined){
        this.suscritos[index] = [];
      }
      this.suscritos[index].push({
        tipoDocumento: tipoDocumento,
        numeroDocumento,
        parentesco,
        nombresApellidos,
        ocupacion
      });

    } else {
      this.suscritos[index][this.recordIndexToEdit].tipoDocumento = tipoDocumento;
      this.suscritos[index][this.recordIndexToEdit].numeroDocumento = numeroDocumento;
      this.suscritos[index][this.recordIndexToEdit].nombresApellidos = nombresApellidos;
      this.suscritos[index][this.recordIndexToEdit].parentesco = parentesco;
      this.suscritos[index][this.recordIndexToEdit].ocupacion = ocupacion;
    }

    this.clearSuscritoData(index);
  }

  public editSuscrito( suscrito: any, index: number, j:number ){
    
    /*if (this.recordIndexToEdit !== -1){
      return;
    }*/

    this.recordIndexToEdit = j;
    console.log(this.recordIndexToEdit);

    this.a_AnexosFA.get([index,'s2_tipoDocumentoFamiliar']).setValue(suscrito.tipoDocumento.id);
    this.a_AnexosFA.get([index,'s2_numeroDocumentoFamiliar']).setValue(suscrito.numeroDocumento);
    this.a_AnexosFA.get([index,'s2_parentesco']).setValue(suscrito.parentesco.id);
    this.a_AnexosFA.get([index,'s2_nombresApellidos']).setValue(suscrito.nombresApellidos);
    this.a_AnexosFA.get([index,'s2_ocupacion']).setValue(suscrito.ocupacion);
  }
  
  public deleteSuscrito( suscrito: any, index: number, j:number ){
    if (this.recordIndexToEdit === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.suscritos[index].splice(j, 1);
        });
    }
  }

  private clearSuscritoData(index:number){
    this.recordIndexToEdit = -1;
    this.a_AnexosFA.get([index,'s2_tipoDocumentoFamiliar']).setValue(null);
    this.a_AnexosFA.get([index,'s2_numeroDocumentoFamiliar']).setValue('');
    this.a_AnexosFA.get([index,'s2_nombresApellidos']).setValue('');
    this.a_AnexosFA.get([index,'s2_parentesco']).setValue(null);
    this.a_AnexosFA.get([index,'s2_ocupacion']).setValue('');
    if(this.suscritos[index]!=undefined){
      this.suscritos[index].sort((a, b) => a.parentesco.id < b.parentesco.id ? -1 : a.parentesco.id > b.parentesco.id ? 1 : 0);
    }
  }

  save(){
    const dataGuardar: Anexo002_A28Request = new Anexo002_A28Request();
    if(this.suscritos.length == 0){
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos un familiar.'); 
    }

    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    const { anexosSolicitados } = dataGuardar.metaData;
    if (!this.a_AnexosFA.controls) {
      this.funcionesMtcService.mensajeError('Debe solicitar al menos un enlace');
      return;
    }

    for (let i = 0; i < this.a_AnexosFA.controls.length; i++) {
      anexosSolicitados[i] = new AnexoSolicitado();
      const { seccion1, seccion2 } = anexosSolicitados[i];

      //let seccion1: A002_A28_Seccion1 = new A002_A28_Seccion1();
      seccion1.tipoDocumento = this.f_s1_pn_tipoDocumento(i).value;
      seccion1.nroDocumento = this.f_s1_pn_numeroDocumento(i).value;
      seccion1.nombreApellido = this.f_s1_pn_Nombres(i).value;
      seccion1.peruano = this.f_s1_pn_Peruano(i).value;
      seccion1.nacionalidad = this.f_s1_pn_Nacionalidad(i).value;
      seccion1.domicilioLegal = this.f_s1_pn_Domicilio(i).value;
      seccion1.distrito.id = this.f_s1_pn_Distrito(i).value;
      seccion1.distrito.descripcion = this.ubigeoPersonaNaturalComponent.getDistritoText();
      seccion1.provincia.id = this.f_s1_pn_Provincia(i).value;
      seccion1.provincia.descripcion = this.ubigeoPersonaNaturalComponent.getProvinciaText();
      seccion1.departamento.id = this.f_s1_pn_Departamento(i).value;
      seccion1.departamento.descripcion = this.ubigeoPersonaNaturalComponent.getDepartamentoText();
      seccion1.telefono = this.f_s1_pn_Telefono(i).value;
      seccion1.celular = this.f_s1_pn_Celular(i).value;
      seccion1.correo = this.f_s1_pn_Correo(i).value;
      seccion1.ocupacion = this.f_s1_pn_Ocupacion(i).value;
      seccion1.centroLaboral = this.f_s1_pn_CentroLaboral(i).value;
      //dataGuardar.metaData.seccion1 = seccion1;

      const listafamiliares: Familiar[] = this.suscritos[i].map(suscrito => {
        return {
          tipoDocumentoFamiliar: suscrito.tipoDocumento,
          numeroDocumentoFamiliar: suscrito.numeroDocumento,
          nombresApellidos: suscrito.nombresApellidos,
          parentesco: suscrito.parentesco,
          ocupacion: suscrito.ocupacion
        } as Familiar
      });
      //let seccion2: A002_A28_Seccion2 = new A002_A28_Seccion2();
      seccion2.familiares = listafamiliares;
      /*seccion2.lugar = this.formAnexo.controls['s2_lugar'].value;
      seccion2.fecha = this.fechaAnexo;*/
      //dataGuardar.metaData.seccion2 = seccion2;

    }
    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log(JSON.stringify(dataGuardar));

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

  buscarNumeroDocumento(index:number) {
    const tipoDocumento = this.a_AnexosFA.get([index,'s2_tipoDocumentoFamiliar']).value.trim(); //this.formAnexo[i].controls['s2_tipoDocumentoFamiliar'].value.trim();
    const numeroDocumento = this.a_AnexosFA.get([index,'s2_numeroDocumentoFamiliar']).value.trim(); //s2_numeroDocumentoFamiliar

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');

    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();
    if (tipoDocumento === '01') {//DNI
        this.reniecService.getDni(numeroDocumento).subscribe(
          respuesta => {
              this.funcionesMtcService.ocultarCargando();
              const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
              if (datos.prenombres === '')
                return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);
                this.a_AnexosFA.get([index,'s2_nombresApellidos']).setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
            },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar el Servicio Reniec');
          }
        );

    } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe(
          respuesta => {
            this.funcionesMtcService.ocultarCargando();
            const datos = respuesta.CarnetExtranjeria;
            if (datos.numRespuesta !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

              this.a_AnexosFA.get([index,'s2_nombresApellidos']).setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio de extranjeria');
          }
        );
    }
  }

  buscarNumeroDocumentoNuevoAnexo(index:number) {
    const tipoDocumento = this.f_s1_pn_tipoDocumento(index).value.trim(); 
    const numeroDocumento = this.f_s1_pn_numeroDocumento(index).value.trim(); 

    this.f_s1_pn_Telefono(index).clearValidators();
    this.f_s1_pn_Telefono(index).updateValueAndValidity();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');

    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();
    if (tipoDocumento === '01') {//DNI
        this.reniecService.getDni(numeroDocumento).subscribe(
          respuesta => {
              this.funcionesMtcService.ocultarCargando();
              const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
              if (datos.prenombres === '')
                return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);
                this.f_s1_pn_Nombres(index).setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
                this.f_s1_pn_Domicilio(index).setValue(datos.direccion.trim());
                const ubigeo = datos.ubigeo.split('/');
                this.f_s1_pn_Departamento(index).setValue(ubigeo[0]);
                this.f_s1_pn_Provincia(index).setValue(ubigeo[1]);
                this.f_s1_pn_Distrito(index).setValue(ubigeo[2]);
                this.f_s1_pn_Peruano(index).setValue(true);
                this.f_s1_pn_Nacionalidad(index).setValue('');
                this.f_s1_pn_Nacionalidad(index).disable();
                this.f_s1_pn_Nacionalidad(index).clearValidators();
                this.f_s1_pn_Nacionalidad(index).updateValueAndValidity();
            },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar el Servicio Reniec');
          }
        );

    } else if (tipoDocumento === '04') {//CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe(
          respuesta => {
            this.funcionesMtcService.ocultarCargando();
            const datos = respuesta.CarnetExtranjeria;
            if (datos.numRespuesta !== '0000')
              return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

              this.f_s1_pn_Nombres(index).setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
              this.f_s1_pn_Peruano(index).setValue(false);
              this.f_s1_pn_Peruano(index).disable();
              this.f_s1_pn_Nacionalidad(index).enable();
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio de extranjeria');
          }
        );
    }
  }

  formInvalid(control: string) {
    return this.formAnexo.get(control).invalid &&
      (this.formAnexo.get(control).dirty || this.formAnexo.get(control).touched);
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-A/28";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  get form() { return this.formAnexo.controls; }

  
  departamentos(){
    this.ubigeoService.departamento().subscribe(

      (dataDepartamento) => {
         console.log(dataDepartamento);
        this.listaDepartamentos = dataDepartamento;
        this.funcionesMtcService.ocultarCargando();
    },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de los departamentos');
        });
  }

  onChangeDistritos(index: number) {
    const idDepartamento: string = this.f_s1_pn_Departamento(index).value.trim();
    const idProvincia: string = this.f_s1_pn_Provincia(index).value.trim();
    this.f_s1_pn_Distrito(index).setValue('');
    if(idDepartamento!=='' && idProvincia!==''){
    this.idDep = parseInt(idDepartamento);
    this.idProv = parseInt(idProvincia);
    this.listDistritos();
   }else{
    this.listaDistritos = [];
   }
  }
  
  onChangeProvincias(index: number) {
    const idDepartamento: string = this.f_s1_pn_Departamento(index).value;
    this.f_s1_pn_Provincia(index).setValue('');
    console.log(idDepartamento);

    if(idDepartamento!==''){
      this.listaProvincias=[];
      this.listaDistritos = [];
      this.idDep = parseInt(idDepartamento)
      console.log(this.idDep);
      this.listaProvincia();

    }else{
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
      }
    );
  }
}
