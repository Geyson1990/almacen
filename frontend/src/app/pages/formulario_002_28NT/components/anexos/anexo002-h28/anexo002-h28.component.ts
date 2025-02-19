import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_H28Request } from '../../../../../core/models/Anexos/Anexo002_H28/Anexo002_H28Request';
import { Anexo002_H28Response } from 'src/app/core/models/Anexos/Anexo002_H28/Anexo002_H28Response';
import { OficinaRegistralService } from '../../../../../core/services/servicios/oficinaregistral.service';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002H28Service } from '../../../../../core/services/anexos/anexo002-h28.service';
import { Seccion1, Seccion2, Seccion3, Seccion4, Miembro} from '../../../../../core/models/Anexos/Anexo002_H28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';


@Component({
  selector: 'app-anexo002-h28',
  templateUrl: './anexo002-h28.component.html',
  styleUrls: ['./anexo002-h28.component.css']
})
export class Anexo002H28Component implements OnInit, AfterViewInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  @ViewChild('ubigeoCmpPersonaNatural') ubigeoPersonaNaturalComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepresentanteLegal') ubigeoRepresentanteLegalComponent: UbigeoComponent;

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
  solicitante: string;
  tipoDocumentoSolicitante: string;
  numeroDocumentoSolicitante: string;
  nombreSolicitante: string;

  tipoAdquiriente:string = "pn";
  
  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];

  idDep: number;
  idProv: number;

  public suscritos: any[];
  public recordIndexToEdit: number;
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "01", documento: 'DNI' },
    { id: "04", documento: 'Carné de Extranjería' }
  ];
  oficinasRegistral: any = [];
  representanteLegal: RepresentanteLegal[] = [];
 
  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
    private anexoService: Anexo002H28Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
    private reniecService: ReniecService,
    private sunatService: SunatService,
    private extranjeriaService: ExtranjeriaService,
    private seguridadService: SeguridadService,
    private _oficinaRegistral: OficinaRegistralService,
  ) {
    this.suscritos = [];
    this.idAnexo = 0;
    this.recordIndexToEdit = -1;
    this.tipoAdquiriente = "pn";

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
    
    await this.datosSolicitante(this.dataInput.tramiteReqRefId);

    setTimeout(async () => {
      await this.cargarDatos();
      this.actualizarValidaciones(this.tipoAdquiriente);
    });
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      s1_tipoDocumentoSocio: [''],
      s1_numeroDocumentoSocio: [''],
      s1_nombresApellidos: [''],
      s1_nacionalidad:[''],
      s1_cargo: [''],
      s1_capital: [''],
      Seccion2:this.fb.group({
          resolucion :  ['', [Validators.required]],
          frecuencia :  ['', [Validators.required]],
          localidad  :   ['', [Validators.required]],
          departamento:  ['', [Validators.required]],
      }),
      Seccion3:this.fb.group({
        tipoAdquiriente: [{value:'pn', disabled:false}, [Validators.required]],
        PersonaNatural : this.fb.group({
          pn_tipoDocumento :  ['', [Validators.required]],
          pn_numeroDocumento:  ['', [Validators.required]],
          pn_nombres      : ['', [Validators.required, Validators.maxLength(50)]],
          pn_domicilio    : ['', [Validators.required, Validators.maxLength(50)]],
          pn_distrito     : ['', [Validators.required]],
          pn_provincia    : ['', [Validators.required]],
          pn_departamento : ['', [Validators.required]],
          pn_telefono     : ['', [Validators.required, Validators.maxLength(9)]],
          pn_celular      : ['', [Validators.required, exactLengthValidator([9])]],
          pn_correo       : ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]]
        }),
        PersonaJuridica: this.fb.group({
          pj_ruc                     :['', [Validators.required, Validators.maxLength(11)]],
          pj_razonSocial             :[{value:'', disabled:true}, [Validators.required, Validators.maxLength(80)]],
          pj_domicilio               :[{value:'', disabled:true}, [Validators.required, Validators.maxLength(150)]],
          pj_distrito                :[{value:'', disabled:true}, [Validators.required, Validators.maxLength(20)]],
          pj_provincia               :[{value:'', disabled:true}, [Validators.required, Validators.maxLength(20)]],
          pj_departamento            :[{value:'', disabled:true}, [Validators.required, Validators.maxLength(20)]],
        }),
        RepresentanteLegal: this.fb.group({
          rl_tipoDocumento   : ['', [Validators.required, Validators.maxLength(10)]],
          rl_numeroDocumento : ['', [Validators.required, Validators.maxLength(11)]],
          rl_nombre     : ['', [Validators.required, Validators.maxLength(30)]],
          rl_apePaterno : ['', [Validators.required, Validators.maxLength(30)]],
          rl_apeMaterno : ['', [Validators.required, Validators.maxLength(30)]],
          rl_telefono   : ['', [Validators.required, Validators.maxLength(20)]],
          rl_celular    : ['', [Validators.required, Validators.maxLength(9)]],
          rl_correo     : ['', [Validators.required, Validators.maxLength(50)]],
          rl_oficina    : ['', [Validators.required, Validators.maxLength(20)]],
          rl_partida    : ['', [Validators.required, Validators.maxLength(9)]],
          rl_asiento    : ['', [Validators.required, Validators.maxLength(9)]],
          rl_objeto     : ['', [Validators.required, Validators.maxLength(9)]],
        })
      }),
      declaracion:[true]
    });
  }

   // GET FORM formularioFG

  get f_Seccion2(): UntypedFormGroup { return this.formAnexo.get('Seccion2') as UntypedFormGroup; }
  get f_s2_resolucion():AbstractControl { return this.f_Seccion2.get(['resolucion']); }
  get f_s2_frecuencia():AbstractControl { return this.f_Seccion2.get(['frecuencia']); }
  get f_s2_localidad():AbstractControl { return this.f_Seccion2.get(['localidad']); }
  get f_s2_departamento():AbstractControl { return this.f_Seccion2.get(['departamento']); }
  
  get f_Seccion3(): UntypedFormGroup { return this.formAnexo.get('Seccion3') as UntypedFormGroup; }
  get f_s3_TipoAdquiriente(): AbstractControl { return this.f_Seccion3.get(['tipoAdquiriente']); }
  get f_s3_PersonaNatural(): UntypedFormGroup { return this.f_Seccion3.get('PersonaNatural') as UntypedFormGroup; }
  get f_s3_pn_TipoDocumento(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_tipoDocumento']); }
  get f_s3_pn_NumeroDocumento(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_numeroDocumento']); }
  get f_s3_pn_Nombres(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_nombres']); }
  get f_s3_pn_Domicilio(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_domicilio']); }
  get f_s3_pn_Distrito(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_distrito']); }
  get f_s3_pn_Provincia(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_provincia']); }
  get f_s3_pn_Departamento(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_departamento']); }
  get f_s3_pn_Telefono(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_telefono']); }
  get f_s3_pn_Celular(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_celular']); }
  get f_s3_pn_Correo(): AbstractControl { return this.f_s3_PersonaNatural.get(['pn_correo']); }
  get f_s3_PersonaJuridica(): UntypedFormGroup { return this.f_Seccion3.get('PersonaJuridica') as UntypedFormGroup; }
  get f_s3_pj_Ruc(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_ruc']); }
  get f_s3_pj_RazonSocial(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_razonSocial']); }
  get f_s3_pj_Domicilio(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_domicilio']); }
  get f_s3_pj_Departamento(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_departamento']); }
  get f_s3_pj_Provincia(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_provincia']); }
  get f_s3_pj_Distrito(): AbstractControl { return this.f_s3_PersonaJuridica.get(['pj_distrito']); }
  get f_s3_RepresentanteLegal(): UntypedFormGroup { return this.f_Seccion3.get('RepresentanteLegal') as UntypedFormGroup; }
  get f_s3_rl_TipoDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_tipoDocumento']); }
  get f_s3_rl_NumeroDocumento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_numeroDocumento']); }
  get f_s3_rl_Nombre(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_nombre']); }
  get f_s3_rl_ApePaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apePaterno']); }
  get f_s3_rl_ApeMaterno(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_apeMaterno']); }
  get f_s3_rl_Telefono(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_telefono']); }
  get f_s3_rl_Celular(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_celular']); }
  get f_s3_rl_Correo(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_correo']); }
  get f_s3_rl_Oficina(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_oficina']); }
  get f_s3_rl_Partida(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_partida']); }
  get f_s3_rl_Asiento(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_asiento']); }
  get f_s3_rl_Objeto(): AbstractControl { return this.f_s3_RepresentanteLegal.get(['rl_objeto']); }

  get f_declaracion():AbstractControl {return this.formAnexo.get(['declaracion']);}
  // FIN GET FORM formularioFG

  async cargarOficinaRegistral(): Promise<void> {
    try {
      const dataOficinaRegistral = await this._oficinaRegistral.oficinaRegistral().toPromise();
      this.oficinasRegistral = dataOficinaRegistral;
      this.funcionesMtcService.ocultarCargando();
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
    }
  }

  async datosSolicitante(FormularioId: number): Promise<void> {
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        this.tipoDocumentoSolicitante = metaDataForm.seccion8.tipoDocumentoSolicitante;
        this.numeroDocumentoSolicitante = metaDataForm.seccion8.numeroDocumentoSolicitante;
        this.nombreSolicitante = metaDataForm.seccion8.nombreSolicitante;

        this.f_s2_frecuencia.setValue(metaDataForm.seccion1.modalidad);
        this.f_s2_localidad.setValue(metaDataForm.seccion3.localidad);
        this.f_s2_departamento.setValue(metaDataForm.seccion6.departamento);
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
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_H28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        let i = 0;
        for (i = 0; i < metaData.seccion1.socios.length; i++) {
          this.suscritos.push({
            tipoDocumento: metaData.seccion1.socios[i].tipoDocumento,
            numeroDocumento: metaData.seccion1.socios[i].numeroDocumento,
            nombresApellidos: metaData.seccion1.socios[i].nombresApellidos,
            nacionalidad: metaData.seccion1.socios[i].nacionalidad,
            cargo: metaData.seccion1.socios[i].condicionCargo,
            capital: metaData.seccion1.socios[i].porcentajeCapital
          });
        }

        this.f_s2_resolucion.setValue(metaData.seccion2.resolucion);
        this.f_s2_frecuencia.setValue(metaData.seccion2.frecuencia);
        this.f_s3_TipoAdquiriente.setValue(metaData.seccion3.tipoSolicitante);
        this.tipoAdquiriente=this.f_s3_TipoAdquiriente.value;
        //this.f_s2_localidad.setValue(metaData.seccion2.localidad);
        //this.f_s2_departamento.setValue(metaData.seccion2.departamento);

        if(metaData.seccion3.tipoSolicitante=="pn"){
          this.f_s3_pn_TipoDocumento.setValue(metaData.seccion3.tipoDocumento);
          this.f_s3_pn_NumeroDocumento.setValue(metaData.seccion3.numeroDocumento);
          this.f_s3_pn_Nombres.setValue(metaData.seccion3.nombresApellidos);
          this.f_s3_pn_Domicilio.setValue(metaData.seccion3.domicilioLegal);
          
          this.f_s3_pn_Departamento.setValue(metaData.seccion3.pn_departamento.id);
          this.f_s3_pn_Provincia.setValue(metaData.seccion3.pn_provincia.id);
          this.f_s3_pn_Distrito.setValue(metaData.seccion3.pn_distrito.id);
          this.f_s3_pn_Telefono.setValue(metaData.seccion3.telefono);
          this.f_s3_pn_Celular.setValue(metaData.seccion3.celular);
          this.f_s3_pn_Correo.setValue(metaData.seccion3.email);
        }
        if(metaData.seccion3.tipoSolicitante=="pj"){
          await this.cargarOficinaRegistral();
          this.f_s3_pj_RazonSocial.setValue(metaData.seccion3.razonSocial);
          this.f_s3_pj_Ruc.setValue(metaData.seccion3.ruc);
          this.f_s3_pj_Departamento.setValue(metaData.seccion3.departamento);
          this.f_s3_pj_Provincia.setValue(metaData.seccion3.provincia);
          this.f_s3_pj_Distrito.setValue(metaData.seccion3.distrito);
          this.f_s3_pj_Domicilio.setValue(metaData.seccion3.domicilioLegal);
          this.f_s3_rl_Nombre.setValue(metaData.seccion3.representanteLegal.nombres);
          this.f_s3_rl_ApePaterno.setValue(metaData.seccion3.representanteLegal.apellidoPaterno);
          this.f_s3_rl_ApeMaterno.setValue(metaData.seccion3.representanteLegal.apellidoMaterno);
          this.f_s3_rl_Telefono.setValue(metaData.seccion3.telefono);
          this.f_s3_rl_Celular.setValue(metaData.seccion3.celular);
          this.f_s3_rl_Correo.setValue(metaData.seccion3.email);
          this.f_s3_rl_TipoDocumento.setValue(metaData.seccion3.representanteLegal.tipoDocumento.id);
          this.f_s3_rl_NumeroDocumento.setValue(metaData.seccion3.representanteLegal.numeroDocumento);
          this.f_s3_rl_Oficina.setValue(metaData.seccion3.representanteLegal.oficinaRegistral.id);
          this.f_s3_rl_Partida.setValue(metaData.seccion3.representanteLegal.partida);
          this.f_s3_rl_Asiento.setValue(metaData.seccion3.representanteLegal.asiento);
          this.f_s3_rl_Objeto.setValue(metaData.seccion3.representanteLegal.objetoSocial);
        }

      } catch (error) {
        console.error('Error cargarDatos: ', error);
        // this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando();
        //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
      }
    }
  }

  changeTipoDocumento() {
    this.formAnexo.controls['s1_numeroDocumentoSocio'].setValue('');
    this.inputNumeroDocumento();
  }

  onChangeTipoAdquiriente(event){
    console.log(this.f_s3_TipoAdquiriente.value);
    if(this.f_s3_TipoAdquiriente.value=="pn"){
      this.tipoAdquiriente = "pn";
      
    }else{
      this.tipoAdquiriente = "pj";
      this.cargarOficinaRegistral();
    }
    this.actualizarValidaciones(this.tipoAdquiriente);
  }

  actualizarValidaciones(tipoAdquiriente: string){
    switch(tipoAdquiriente){
      case "pn": this.f_s3_pn_Telefono.clearValidators();
                 this.f_s3_pn_Telefono.updateValueAndValidity();

                 this.f_s3_pj_Ruc.clearValidators();
                 this.f_s3_pj_RazonSocial.clearValidators();
                 this.f_s3_pj_Departamento.clearValidators();
                 this.f_s3_pj_Provincia.clearValidators();
                 this.f_s3_pj_Distrito.clearValidators();
                 this.f_s3_pj_Domicilio.clearValidators();

                 this.f_s3_rl_TipoDocumento.clearValidators();
                 this.f_s3_rl_NumeroDocumento.clearValidators();
                 this.f_s3_rl_ApeMaterno.clearValidators();
                 this.f_s3_rl_ApePaterno.clearValidators();
                 this.f_s3_rl_Nombre.clearValidators();
                 this.f_s3_rl_Celular.clearValidators();
                 this.f_s3_rl_Telefono.clearValidators();
                 this.f_s3_rl_Correo.clearValidators();
                 this.f_s3_rl_Oficina.clearValidators();
                 this.f_s3_rl_Partida.clearValidators();
                 this.f_s3_rl_Asiento.clearValidators();
                 this.f_s3_rl_Objeto.clearValidators();

                 this.f_s3_pj_Ruc.updateValueAndValidity();
                 this.f_s3_pj_RazonSocial.updateValueAndValidity();
                 this.f_s3_pj_Departamento.updateValueAndValidity();
                 this.f_s3_pj_Provincia.updateValueAndValidity();
                 this.f_s3_pj_Distrito.updateValueAndValidity();
                 this.f_s3_pj_Domicilio.updateValueAndValidity();

                 this.f_s3_rl_TipoDocumento.updateValueAndValidity();
                 this.f_s3_rl_NumeroDocumento.updateValueAndValidity();
                 this.f_s3_rl_ApeMaterno.updateValueAndValidity();
                 this.f_s3_rl_ApePaterno.updateValueAndValidity();
                 this.f_s3_rl_Nombre.updateValueAndValidity();
                 this.f_s3_rl_Celular.updateValueAndValidity();
                 this.f_s3_rl_Telefono.updateValueAndValidity();
                 this.f_s3_rl_Correo.updateValueAndValidity();
                 this.f_s3_rl_Oficina.updateValueAndValidity();
                 this.f_s3_rl_Partida.updateValueAndValidity();
                 this.f_s3_rl_Asiento.updateValueAndValidity();
                 this.f_s3_rl_Objeto.updateValueAndValidity();
                 break;

      case "pj": this.f_s3_pn_TipoDocumento.clearValidators();
                 this.f_s3_pn_NumeroDocumento.clearValidators();
                 this.f_s3_pn_Nombres.clearValidators();
                 this.f_s3_pn_Departamento.clearValidators();
                 this.f_s3_pn_Provincia.clearValidators();
                 this.f_s3_pn_Distrito.clearValidators();
                 this.f_s3_pn_Domicilio.clearValidators();
                 this.f_s3_pn_Telefono.clearValidators();
                 this.f_s3_pn_Celular.clearValidators();
                 this.f_s3_pn_Correo.clearValidators();

                 this.f_s3_pn_TipoDocumento.updateValueAndValidity();
                 this.f_s3_pn_NumeroDocumento.updateValueAndValidity();
                 this.f_s3_pn_Nombres.updateValueAndValidity();
                 this.f_s3_pn_Departamento.updateValueAndValidity();
                 this.f_s3_pn_Provincia.updateValueAndValidity();
                 this.f_s3_pn_Distrito.updateValueAndValidity();
                 this.f_s3_pn_Domicilio.updateValueAndValidity();
                 this.f_s3_pn_Telefono.updateValueAndValidity();
                 this.f_s3_pn_Celular.updateValueAndValidity();
                 this.f_s3_pn_Correo.updateValueAndValidity();
                 break;
    }
  }

  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
  
    this.formAnexo.controls['s1_nombresApellidos'].setValue('');
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    this.fechaAnexo = finalDate;
   }

  public addSuscrito(){
    const idTipoDocumento = this.formAnexo.get('s1_tipoDocumentoSocio').value.trim();
    const numeroDocumento = this.formAnexo.get('s1_numeroDocumentoSocio').value.trim();
    //const idParentesco = this.formAnexo.get('s2_parentesco').value;
    const cargo = this.formAnexo.get('s1_cargo').value.trim();
    const nombresApellidos = this.formAnexo.get('s1_nombresApellidos').value.trim();
    const nacionalidad = this.formAnexo.get('s1_nacionalidad').value.trim();
    const capital = this.formAnexo.get('s1_capital').value.trim();
    if (
      numeroDocumento === '' ||
      nombresApellidos === '' ||
      cargo === '' ||
      nacionalidad === '' ||
      capital === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    const indexFound = this.suscritos.findIndex( item => item.numeroDocumento === numeroDocumento);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEdit ) {
        return this.funcionesMtcService.mensajeError('La persona ya se encuentra registrado.');
      }
    }

    let documento: string= this.listaTiposDocumentos.filter(item => item.id == idTipoDocumento)[0].documento;
    const tipoDocumento: TipoDocumentoModel = { id: idTipoDocumento, documento }

    /*const id: number = idTipoDocumento;
    let descripcion: string= this.listaParentesco.filter(item => item.id == idParentesco)[0].descripcion;
    const parentesco: Parentesco = { id, descripcion }*/

    if (this.recordIndexToEdit === -1) {
      this.suscritos.push({
        tipoDocumento: tipoDocumento,
        numeroDocumento,
        nombresApellidos,
        nacionalidad,
        cargo,
        capital
      });
    } else {
      this.suscritos[this.recordIndexToEdit].tipoDocumento = tipoDocumento;
      this.suscritos[this.recordIndexToEdit].numeroDocumento = numeroDocumento;
      this.suscritos[this.recordIndexToEdit].nombresApellidos = nombresApellidos;
      this.suscritos[this.recordIndexToEdit].nacionalidad = nacionalidad;
      this.suscritos[this.recordIndexToEdit].cargo = cargo;
      this.suscritos[this.recordIndexToEdit].capital = capital;
    }

    this.clearSuscritoData();
  }

  public editSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.s1_tipoDocumentoSocio.setValue(suscrito.tipoDocumento.id);
    this.formAnexo.controls.s1_numeroDocumentoSocio.setValue(suscrito.numeroDocumento);
    this.formAnexo.controls.s1_nombresApellidos.setValue(suscrito.nombresApellidos);
    this.formAnexo.controls.s1_nacionalidad.setValue(suscrito.nacionalidad);
    this.formAnexo.controls.s1_cargo.setValue(suscrito.cargo);
    this.formAnexo.controls.s1_capital.setValue(suscrito.capital);
  }
  
  public deleteSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit === -1) {
      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.suscritos.splice(i, 1);
        });
    }
  }

  private clearSuscritoData(){
    this.recordIndexToEdit = -1;
    this.formAnexo.controls.s1_tipoDocumentoSocio.setValue(null);
    this.formAnexo.controls.s1_numeroDocumentoSocio.setValue('');
    this.formAnexo.controls.s1_nombresApellidos.setValue('');
    this.formAnexo.controls.s1_nacionalidad.setValue('');
    this.formAnexo.controls.s1_cargo.setValue('');
    this.formAnexo.controls.s1_capital.setValue('');
    //this.suscritos.sort((a, b) => a.parentesco.id < b.parentesco.id ? -1 : a.parentesco.id > b.parentesco.id ? 1 : 0)
  }

  save(){
    const dataGuardar: Anexo002_H28Request = new Anexo002_H28Request();
    
    if(this.suscritos.length==0){
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una integrante de la persona jurídica.');
    }

    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    let seccion1: Seccion1 = new Seccion1();
    const listaSocios: Miembro[] = this.suscritos.map(suscrito => {
      return {
        tipoDocumento: suscrito.tipoDocumento,
        numeroDocumento: suscrito.numeroDocumento,
        nombresApellidos: suscrito.nombresApellidos,
        nacionalidad: suscrito.nacionalidad,
        condicionCargo: suscrito.cargo,
        porcentajeCapital: suscrito.capital
      } as Miembro
    });
    seccion1.socios = listaSocios;
    dataGuardar.metaData.seccion1 = seccion1;

    let seccion2: Seccion2 = new Seccion2();
    seccion2.resolucion = this.f_s2_resolucion.value;
    seccion2.frecuencia = this.f_s2_frecuencia.value
    seccion2.localidad = this.f_s2_localidad.value
    seccion2.departamento = this.f_s2_departamento.value
    dataGuardar.metaData.seccion2 = seccion2;

    let seccion3: Seccion3 = new Seccion3();
    seccion3.tipoSolicitante = this.f_s3_TipoAdquiriente.value;
    seccion3.tipoDocumento = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_TipoDocumento.value : "");
    seccion3.numeroDocumento = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_NumeroDocumento.value : "");
    seccion3.nombresApellidos = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_Nombres.value : "");
    seccion3.ruc = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_pj_Ruc.value : "");
    seccion3.razonSocial = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_pj_RazonSocial.value : "");
    seccion3.domicilioLegal = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_pj_Domicilio.value : this.f_s3_pn_Domicilio.value);
    seccion3.pn_departamento.id = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_Departamento.value : "");
    seccion3.pn_departamento.descripcion = (this.f_s3_TipoAdquiriente.value=="pn" ? this.ubigeoPersonaNaturalComponent.getDepartamentoText() : "");
    seccion3.pn_provincia.id = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_Provincia.value : "");
    seccion3.pn_provincia.descripcion = (this.f_s3_TipoAdquiriente.value=="pn" ? this.ubigeoPersonaNaturalComponent.getProvinciaText() : "");
    seccion3.pn_distrito.id = (this.f_s3_TipoAdquiriente.value=="pn" ? this.f_s3_pn_Distrito.value : "");
    seccion3.pn_distrito.descripcion = (this.f_s3_TipoAdquiriente.value=="pn" ? this.ubigeoPersonaNaturalComponent.getDistritoText() : "");
    seccion3.departamento = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_pj_Departamento.value : "");
    seccion3.provincia = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_pj_Provincia.value : "");
    seccion3.distrito = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_pj_Distrito.value : "");
    seccion3.telefono = (this.f_s3_TipoAdquiriente.value == "pn" ? this.f_s3_pn_Telefono.value : this.f_s3_rl_Telefono.value);
    seccion3.celular = (this.f_s3_TipoAdquiriente.value == "pn" ? this.f_s3_pn_Celular.value : this.f_s3_rl_Celular.value);
    seccion3.email = (this.f_s3_TipoAdquiriente.value == "pn" ? this.f_s3_pn_Correo.value : this.f_s3_rl_Correo.value);
    seccion3.representanteLegal.tipoDocumento.id = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_TipoDocumento.value : "");
    seccion3.representanteLegal.tipoDocumento.documento = (this.f_s3_TipoAdquiriente.value == "pj" ? this.listaTiposDocumentos.filter(item => item.id == this.f_s3_rl_TipoDocumento.value)[0].documento:"");
    seccion3.representanteLegal.numeroDocumento = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_NumeroDocumento.value : "");
    seccion3.representanteLegal.nombres = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_Nombre.value : "");
    seccion3.representanteLegal.apellidoPaterno = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_ApePaterno.value : "");
    seccion3.representanteLegal.apellidoMaterno = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_ApeMaterno.value : "");
    //seccion3.representanteLegal.domicilioLegal =  (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_pj_Domicilio.value : "");
    seccion3.representanteLegal.oficinaRegistral.id = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_Oficina.value : "");
    seccion3.representanteLegal.oficinaRegistral.descripcion = (this.f_s3_TipoAdquiriente.value == "pj" ? this.oficinasRegistral.filter(item => item.value == this.f_s3_rl_Oficina.value)[0].text:"");
    //seccion3.representanteLegal.domicilioLegal = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_pj_Domicilio.value : "");
    seccion3.representanteLegal.partida = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_Partida.value : "");
    seccion3.representanteLegal.asiento = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_Asiento.value : "");
    seccion3.representanteLegal.objetoSocial = (this.f_s3_TipoAdquiriente.value == "pj" ? this.f_s3_rl_Objeto.value : "");
    /*seccion3.representanteLegal.departamento.id = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_rl_Departamento.value : "");
    seccion3.representanteLegal.departamento.descripcion = (this.f_s3_TipoAdquiriente.value=="pj" ? this.ubigeoRepresentanteLegalComponent.getDepartamentoText() : "");
    seccion3.representanteLegal.provincia.id = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_rl_Provincia.value : "");
    seccion3.representanteLegal.provincia.descripcion = (this.f_s3_TipoAdquiriente.value=="pj" ? this.ubigeoRepresentanteLegalComponent.getProvinciaText() : "");
    seccion3.representanteLegal.distrito.id = (this.f_s3_TipoAdquiriente.value=="pj" ? this.f_s3_rl_Distrito.value : "");
    seccion3.representanteLegal.distrito.descripcion = (this.f_s3_TipoAdquiriente.value=="pj" ? this.ubigeoRepresentanteLegalComponent.getDistritoText() : "");
    */
    dataGuardar.metaData.seccion3 = seccion3;

    let seccion4: Seccion4 = new Seccion4();
    seccion4.fecha = '';
    seccion4.declaracion = this.f_declaracion.value;
    seccion4.tipoDocumentoSolicitante = this.tipoDocumentoSolicitante;
    seccion4.numeroDocumentoSolicitante = this.numeroDocumentoSolicitante;
    seccion4.nombreSolicitante = this.nombreSolicitante;
    dataGuardar.metaData.seccion4 = seccion4;

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

  buscarNumeroRucPJ(){
    const numeroDocumento = this.f_s3_pj_Ruc.value.trim();
    const tipoRuc = numeroDocumento.substr(0,2);
    if (tipoRuc == "10")
      return this.funcionesMtcService.mensajeError('El RUC debe ser de una persona jurídica.');

    if (numeroDocumento.length !== 11)
      return this.funcionesMtcService.mensajeError('El RUC debe tener 11 caracteres');

    this.funcionesMtcService.mostrarCargando();
    this.sunatService.getDatosPrincipales(numeroDocumento).subscribe(
      respuesta => {
          this.funcionesMtcService.ocultarCargando();
          const datos = respuesta;
          
          this.f_s3_pj_RazonSocial.setValue(datos.razonSocial.trim());
          this.f_s3_pj_Domicilio.setValue(datos.domicilioLegal.trim());
          this.f_s3_pj_Departamento.setValue(datos.nombreDepartamento.trim());
          this.f_s3_pj_Provincia.setValue(datos.nombreProvincia.trim());
          this.f_s3_pj_Distrito.setValue(datos.nombreDistrito.trim());

          this.representanteLegal = datos.representanteLegal;
          },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar el Servicio Reniec');
      }
    );
  }

  buscarNumeroDocumentoPN() {
    const tipoDocumento = this.f_s3_pn_TipoDocumento.value.trim();
    const numeroDocumento = this.f_s3_pn_NumeroDocumento.value.trim();

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
              //string[] ubigeo = 
              if (datos.prenombres === '')
                return this.funcionesMtcService.mensajeError(respuesta.reniecConsultDniResponse.listaConsulta.deResultado);
              this.f_s3_pn_Nombres.setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
              this.f_s3_pn_Domicilio.setValue(datos.direccion);
              const ubigeo = datos.ubigeo.split('/');
              /*
              this.f_s3_pn_Departamento.setValue(ubigeo[0]);
              this.f_s3_pn_Provincia.setValue(ubigeo[1]);
              this.f_s3_pn_Distrito.setValue(ubigeo[2]);*/
              this.ubigeoPersonaNaturalComponent?.setUbigeoByText(
                ubigeo[0].trim(),
                ubigeo[1].trim(),
                ubigeo[2].trim());
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

              this.f_s3_pn_Nombres.setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio de extranjeria');
          }
        );
    }
  }

  buscarNumeroDocumento() {
    const tipoDocumento = this.formAnexo.controls['s1_tipoDocumentoSocio'].value.trim();
    const numeroDocumento = this.formAnexo.controls['s1_numeroDocumentoSocio'].value.trim();

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
              this.formAnexo.controls['s1_nombresApellidos'].setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
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

              this.formAnexo.controls['s1_nombresApellidos'].setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Error al consultar al servicio de extranjeria');
          }
        );
    }
  }

  async buscarNumeroDocumentoRepLeg(event): Promise<void> {
    const tipoDocumento: string = this.f_s3_rl_TipoDocumento.value.trim();
    const numeroDocumento: string = this.f_s3_rl_NumeroDocumento.value.trim();

    const resultado = this.representanteLegal?.find(
      representante => (
        '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
        representante.nroDocumento.trim() === numeroDocumento
    );

    if (resultado) {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {// DNI
        try {
          const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
          }

          const { prenombres, apPrimer, apSegundo, direccion, ubigeo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          const [departamento, provincia, distrito] = ubigeo.split('/');
          
          this.f_s3_rl_Nombre.setValue(prenombres);
          this.f_s3_rl_ApePaterno.setValue(apPrimer);
          this.f_s3_rl_ApeMaterno.setValue(apSegundo);
          //this.f_s3_rl_Domicilio.setValue(direccion);

          //await this.ubigeoRepresentanteLegalComponent?.setUbigeoByText(departamento,provincia,distrito);
        }
        catch (e) {
          console.error(e);
          //this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Reniec);
        }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        try {
          const { CarnetExtranjeria } = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
          const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

          this.funcionesMtcService.ocultarCargando();

          if (numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en MIGRACIONES');
          }

          this.f_s3_rl_Nombre.setValue(nombres);
          this.f_s3_rl_ApePaterno.setValue(primerApellido);
          this.f_s3_rl_ApeMaterno.setValue(segundoApellido);
         
        }
        catch (e) {
          console.error(e);
          this.funcionesMtcService.ocultarCargando().mensajeError('Número de documento no registrado en MIGRACIONES');
        }
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado.');
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-H/28";
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
