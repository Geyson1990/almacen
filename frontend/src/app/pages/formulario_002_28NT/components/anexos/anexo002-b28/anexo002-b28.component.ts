import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo002_B28Request } from '../../../../../core/models/Anexos/Anexo002_B28/Anexo002_B28Request';
import { Anexo002_B28Response } from 'src/app/core/models/Anexos/Anexo002_B28/Anexo002_B28Response';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002B28Service } from '../../../../../core/services/anexos/anexo002-b28.service';
import { A002_B28_Seccion1, A002_B28_Seccion2, Socio } from '../../../../../core/models/Anexos/Anexo002_B28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { toHexString } from 'pdf-lib';


@Component({
  selector: 'app-anexo002-b28',
  templateUrl: './anexo002-b28.component.html',
  styleUrls: ['./anexo002-b28.component.css']
})
export class Anexo002B28Component implements OnInit, AfterViewInit {  
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
  solicitante: string;
  tipoDocumentoSolicitante: string;

  
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
 
  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private ubigeoService: UbigeoService,
    private anexoService: Anexo002B28Service,
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
    });
  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      Seccion1:this.fb.group({
          PersonaJuridica : this.fb.group({
            pj_tipodocumento: [{value: '', disabled: true}, [Validators.required]],
            pj_numerodocumento:[{value: '',disabled: true}, [Validators.required]],
            pj_ruc          : [{value: '', disabled: true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(11)]],
            pj_razonsocial  : [{value: '', disabled: true}, [Validators.maxLength(150)]],
            pj_nombres      : [{value: '', disabled: true}, [Validators.required, Validators.maxLength(50)]],
        }),
      }),
      s2_tipoDocumentoSocio: [''],
      s2_numeroDocumentoSocio: [''],
      s2_nombresApellidos: [''],
      s2_nacionalidad:[''],
      s2_cargo: [''],
      s2_capital: [''],
      declaracion:[true]
    });
  }

   // GET FORM formularioFG

   get f_Seccion1(): UntypedFormGroup { return this.formAnexo.get('Seccion1') as UntypedFormGroup; }
   get f_s1_PersonaJuridica(): UntypedFormGroup { return this.f_Seccion1.get('PersonaJuridica') as UntypedFormGroup; }
   get f_s1_pj_tipoDocumento():AbstractControl { return this.f_s1_PersonaJuridica.get(['pj_tipodocumento']); }
   get f_s1_pj_numeroDocumento():AbstractControl {return this.f_s1_PersonaJuridica.get(['pj_numerodocumento']);}
   get f_s1_pj_Ruc(): AbstractControl { return this.f_s1_PersonaJuridica.get(['pj_ruc']); }
   get f_s1_pj_RazonSocial(): AbstractControl { return this.f_s1_PersonaJuridica.get(['pj_razonsocial']); }
   get f_s1_pj_Nombres(): AbstractControl { return this.f_s1_PersonaJuridica.get(['pj_nombres']); }
   
   get f_declaracion():AbstractControl {return this.formAnexo.get(['declaracion']);}
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
        this.tipoDocumentoSolicitante = metaDataForm.seccion8.tipoDocumentoSolicitante;
        this.solicitante = metaDataForm.seccion8.nombreSolicitante;
        this.dniPersona = metaDataForm.seccion8.numeroDocumentoSolicitante;

        this.f_s1_pj_tipoDocumento.setValue(metaDataForm.seccion6.numeroDocumento);
        this.f_s1_pj_Ruc.setValue(metaDataForm.seccion6.ruc);
        this.f_s1_pj_Nombres.setValue(metaDataForm.seccion6.RepresentanteLegal.nombres +' '+ metaDataForm.seccion6.RepresentanteLegal.apellidoPaterno + ' ' + metaDataForm.seccion6.RepresentanteLegal.apellidoMaterno);
        this.f_s1_pj_numeroDocumento.setValue(metaDataForm.seccion6.RepresentanteLegal.numeroDocumento);
        this.f_s1_pj_RazonSocial.setValue(metaDataForm.seccion6.razonSocial);

        

        switch(this.tipoDocumento){
          case "01":  this.f_s1_pj_tipoDocumento.setValue("DNI");
                      break;

          case "04":  this.f_s1_pj_tipoDocumento.setValue("CARNET DE EXTRANJERIA");
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
        const dataAnexo = await this.anexoTramiteService.get<Anexo002_B28Response>(this.dataInput.tramiteReqId).toPromise();
        this.funcionesMtcService.ocultarCargando();

        const metaData: any = JSON.parse(dataAnexo.metaData);
        console.log(metaData);
        this.idAnexo = dataAnexo.anexoId;

        let i = 0;
        for (i = 0; i < metaData.seccion2.socios.length; i++) {
          this.suscritos.push({
            tipoDocumento: metaData.seccion2.socios[i].tipoDocumentoSocio,
            numeroDocumento: metaData.seccion2.socios[i].numeroDocumentoSocio,
            nombresApellidos: metaData.seccion2.socios[i].nombresApellidos,
            nacionalidad: metaData.seccion2.socios[i].nacionalidad,
            cargo: metaData.seccion2.socios[i].cargo,
            capital: metaData.seccion2.socios[i].capital
          });
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
    this.formAnexo.controls['s2_numeroDocumentoSocio'].setValue('');
    this.inputNumeroDocumento();
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

  public addSuscrito(){
    const idTipoDocumento = this.formAnexo.get('s2_tipoDocumentoSocio').value.trim();
    const numeroDocumento = this.formAnexo.get('s2_numeroDocumentoSocio').value.trim();
    //const idParentesco = this.formAnexo.get('s2_parentesco').value;
    const cargo = this.formAnexo.get('s2_cargo').value.trim();
    const nombresApellidos = this.formAnexo.get('s2_nombresApellidos').value.trim();
    const nacionalidad = this.formAnexo.get('s2_nacionalidad').value.trim();
    const capital = this.formAnexo.get('s2_capital').value.trim();
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

    this.formAnexo.controls.s2_tipoDocumentoSocio.setValue(suscrito.tipoDocumento.id);
    this.formAnexo.controls.s2_numeroDocumentoSocio.setValue(suscrito.numeroDocumento);
    this.formAnexo.controls.s2_nombresApellidos.setValue(suscrito.nombresApellidos);
    this.formAnexo.controls.s2_nacionalidad.setValue(suscrito.nacionalidad);
    this.formAnexo.controls.s2_cargo.setValue(suscrito.cargo);
    this.formAnexo.controls.s2_capital.setValue(suscrito.capital);
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
    this.formAnexo.controls.s2_tipoDocumentoSocio.setValue(null);
    this.formAnexo.controls.s2_numeroDocumentoSocio.setValue('');
    this.formAnexo.controls.s2_nombresApellidos.setValue('');
    this.formAnexo.controls.s2_nacionalidad.setValue('');
    this.formAnexo.controls.s2_cargo.setValue('');
    this.formAnexo.controls.s2_capital.setValue('');
    //this.suscritos.sort((a, b) => a.parentesco.id < b.parentesco.id ? -1 : a.parentesco.id > b.parentesco.id ? 1 : 0)
  }

  save(){
    const dataGuardar: Anexo002_B28Request = new Anexo002_B28Request();
    console.log(this.suscritos.length);
    if(this.suscritos.length==0){
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una integrante de la persona jurídica.');
    }
    
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "B";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    let seccion1: A002_B28_Seccion1 = new A002_B28_Seccion1();
    seccion1.tipoDocumento = this.f_s1_pj_tipoDocumento.value;
    seccion1.nroDocumento = this.f_s1_pj_numeroDocumento.value;
    seccion1.nombreApellido = this.f_s1_pj_Nombres.value;
    seccion1.razonSocial = this.f_s1_pj_RazonSocial.value;
      dataGuardar.metaData.seccion1 = seccion1;

    const listaSocios: Socio[] = this.suscritos.map(suscrito => {
      return {
        tipoDocumentoSocio: suscrito.tipoDocumento,
        numeroDocumentoSocio: suscrito.numeroDocumento,
        nombresApellidos: suscrito.nombresApellidos,
        nacionalidad: suscrito.nacionalidad,
        cargo: suscrito.cargo,
        capital: suscrito.capital
      } as Socio
    });
    let seccion2: A002_B28_Seccion2 = new A002_B28_Seccion2();
    seccion2.socios = listaSocios;
    seccion2.solicitante = this.solicitante;
    seccion2.tipoDocumentoSolicitante = "DNI";
    seccion2.numeroDocumentoSolicitante = this.dniPersona;

    dataGuardar.metaData.seccion2 = seccion2;

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

  buscarNumeroDocumento() {
    const tipoDocumento = this.formAnexo.controls['s2_tipoDocumentoSocio'].value.trim();
    const numeroDocumento = this.formAnexo.controls['s2_numeroDocumentoSocio'].value.trim();

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
              this.formAnexo.controls['s2_nombresApellidos'].setValue( datos.apPrimer.trim() + ' ' +datos.apSegundo.trim() + ' ' + datos.prenombres.trim());
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

              this.formAnexo.controls['s2_nombresApellidos'].setValue(datos.primerApellido.trim() + ' ' +datos.segundoApellido.trim() + ' ' + datos.nombres.trim());
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-B/28";
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
