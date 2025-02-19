import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { UbigeoService } from '../../../../../core/services/maestros/ubigeo.service';
import { UbigeoResponse } from 'src/app/core/models/Maestros/UbigeoResponse';
import { Anexo001_D28Request } from '../../../../../core/models/Anexos/Anexo001_D28/Anexo001_D28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo001D28Service } from '../../../../../core/services/anexos/anexo001-d28.service';
import { A001_D28_Seccion1, A001_D28_Seccion2, Parentesco, Familiar } from '../../../../../core/models/Anexos/Anexo001_D28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo001_D28Response } from 'src/app/core/models/Anexos/Anexo001_D28/Anexo001_D28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';

@Component({
  selector: 'app-anexo001-d28',
  templateUrl: './anexo001-d28.component.html',
  styleUrls: ['./anexo001-d28.component.css']
})
export class Anexo001D28Component implements OnInit {  
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
  
  listaDepartamentos: any = [];
  listaProvincias: any = [];
  listaDistritos: any = [];
  idDep: number;
  idProv: number;

  public suscritos: any[];
  public recordIndexToEdit: number;
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
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
    private anexoService: Anexo001D28Service,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private anexoTramiteService: AnexoTramiteService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService
  ) {
    this.suscritos = [];
    this.idAnexo = 0;
    this.recordIndexToEdit = -1;
  }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.createForm();
    this.departamentos();

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
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      s1_nroDocumento: ['', [ Validators.required ]],
      s1_nombreApellido: ['', [ Validators.required ]],
      s1_nacionalidad: ['', [ Validators.required ]],
      s1_domicilioLegal: ['', [ Validators.required ]],
      s1_distrito:    ['',Validators.required],
      s1_provincia:     ['',Validators.required],
      s1_departamento: ['',Validators.required],
      s1_telefono: [''],
      s1_celular: ['',Validators.required],
      s1_correo: ['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      s1_ocupacion: ['',Validators.required],
      s1_centroLaboral: ['',Validators.required],
      s2_tipoDocumentoFamiliar: [''],
      s2_numeroDocumentoFamiliar: [''],
      s2_nombresApellidos: [''],
      s2_parentesco: [''],
      s2_ocupacion: [''],
      s2_lugar: ['',Validators.required],
      s2_fecha: ['',Validators.required],
    });
  }

  recuperarInformacion(){

    //si existe el documento pero no esta completo
    if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
        this.heredarInformacionFormulario();
        //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
        this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataAnexo: Anexo001_D28Response) => {
            const metaData: any = JSON.parse(dataAnexo.metaData);

            this.idAnexo = dataAnexo.anexoId;

            let i = 0;
            for (i = 0; i < metaData.seccion2.familiares.length; i++) {
              this.suscritos.push({
                tipoDocumento: metaData.seccion2.familiares[i].tipoDocumentoFamiliar,
                numeroDocumento: metaData.seccion2.familiares[i].numeroDocumentoFamiliar,
                nombresApellidos: metaData.seccion2.familiares[i].nombresApellidos,
                parentesco: metaData.seccion2.familiares[i].parentesco,
                ocupacion: metaData.seccion2.familiares[i].ocupacion
              });
            }
  
            this.tipoDocumento = metaData.seccion1.tipoDocumento;
            this.formAnexo.get("s1_nroDocumento").setValue(`${metaData?.seccion1?.nroDocumento}`);
            this.formAnexo.get("s1_nombreApellido").setValue(`${metaData?.seccion1?.nombreApellido}`);
            this.formAnexo.get("s1_nacionalidad").setValue(metaData.seccion1.nacionalidad);
            this.formAnexo.get("s1_domicilioLegal").setValue(metaData.seccion1.domicilioLegal);
            this.formAnexo.get("s1_telefono").setValue(metaData.seccion1.telefono);
            this.formAnexo.get("s1_celular").setValue(metaData.seccion1.celular);
            this.formAnexo.get("s1_correo").setValue(metaData.seccion1.correo);
            this.formAnexo.get("s1_ocupacion").setValue(metaData.seccion1.ocupacion);
            this.formAnexo.get("s1_centroLaboral").setValue(metaData.seccion1.centroLaboral);
            this.formAnexo.get("s1_departamento").setValue(metaData.seccion1.departamento.id);
            this.idDep = metaData.seccion1.departamento.id;
            this.listaProvincia();
            this.formAnexo.get("s1_provincia").setValue(metaData.seccion1.provincia.id);
            this.idProv = metaData.seccion1.provincia.id;
            this.formAnexo.get("s1_distrito").setValue(metaData.seccion1.distrito.id);
            this.listDistritos();
            
            this.formAnexo.get("s2_lugar").setValue(metaData.seccion2.lugar);
            this.formAnexo.get("s2_fecha").setValue({
              year: parseInt(metaData.seccion2.fecha.split('-')[0], 10),
              month: parseInt(metaData.seccion2.fecha.split('-')[1], 10),
              day: parseInt(metaData.seccion2.fecha.split('-')[2], 10)
            });
            this.fechaAnexo = metaData.seccion2.fecha;

          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para recuperar los datos guardados del anexo');
          });
    }
    //si existe el documento y esta completo
    else if (this.dataInput.movId > 0 && this.dataInput.completo === true) {
      //RECUPERAMOS LOS DATOS DEL ANEXO
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo001_D28Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexo = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          let i = 0;
          for (i = 0; i < metaData.seccion2.familiares.length; i++) {
            this.suscritos.push({
              tipoDocumento: metaData.seccion2.familiares[i].tipoDocumentoFamiliar,
              numeroDocumento: metaData.seccion2.familiares[i].numeroDocumentoFamiliar,
              nombresApellidos: metaData.seccion2.familiares[i].nombresApellidos,
              parentesco: metaData.seccion2.familiares[i].parentesco,
              ocupacion: metaData.seccion2.familiares[i].ocupacion
            });
          }

          this.tipoDocumento = metaData.seccion1.tipoDocumento;
          this.formAnexo.get("s1_nroDocumento").setValue(`${metaData?.seccion1?.nroDocumento}`);
          this.formAnexo.get("s1_nombreApellido").setValue(`${metaData?.seccion1?.nombreApellido}`);
          this.formAnexo.get("s1_nacionalidad").setValue(metaData.seccion1.nacionalidad);
          this.formAnexo.get("s1_domicilioLegal").setValue(metaData.seccion1.domicilioLegal);
          this.formAnexo.get("s1_telefono").setValue(metaData.seccion1.telefono);
          this.formAnexo.get("s1_celular").setValue(metaData.seccion1.celular);
          this.formAnexo.get("s1_correo").setValue(metaData.seccion1.correo);
          this.formAnexo.get("s1_ocupacion").setValue(metaData.seccion1.ocupacion);
          this.formAnexo.get("s1_centroLaboral").setValue(metaData.seccion1.centroLaboral);
          this.formAnexo.get("s1_departamento").setValue(metaData.seccion1.departamento.id);
          this.idDep = metaData.seccion1.departamento.id;
          this.listaProvincia();
          this.formAnexo.get("s1_provincia").setValue(metaData.seccion1.provincia.id);
          this.idProv = metaData.seccion1.provincia.id;
          this.formAnexo.get("s1_distrito").setValue(metaData.seccion1.distrito.id);
          this.listDistritos();

          this.formAnexo.get("s2_lugar").setValue(metaData.seccion2.lugar);
          this.formAnexo.get("s2_fecha").setValue({
            year: parseInt(metaData.seccion2.fecha.split('-')[0], 10),
            month: parseInt(metaData.seccion2.fecha.split('-')[1], 10),
            day: parseInt(metaData.seccion2.fecha.split('-')[2], 10)
          });
          this.fechaAnexo = metaData.seccion2.fecha;
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }else{
        //si es un nuevo registro
        this.heredarInformacionFormulario();
    }

  }

  heredarInformacionFormulario(){
    this.funcionesMtcService.mostrarCargando();
    this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
      (dataForm: any) => {

        this.funcionesMtcService.ocultarCargando();
        const metaDataForm: any = JSON.parse(dataForm.metaData);

        console.log(JSON.stringify(metaDataForm));
        //this.tipoDocumento = metaDataForm.seccion1.nroRuc && metaDataForm.seccion1.personaJuridica ? 'RUC' : metaDataForm.seccion1.dni  ? 'DNI' : '';
        this.tipoDocumento = 'DNI';
        this.formAnexo.controls['s1_nroDocumento'].setValue(`${metaDataForm?.seccion1?.dni}`);
        this.formAnexo.controls['s1_nombreApellido'].setValue(`${metaDataForm?.seccion1?.nombres} ${metaDataForm?.seccion1?.apellidoPaterno} ${metaDataForm?.seccion1?.apellidoMaterno}`);
        
        this.formAnexo.controls['s1_domicilioLegal'].setValue(metaDataForm?.seccion1?.domicilioLegal);
        this.formAnexo.controls['s1_departamento'].setValue(metaDataForm?.seccion1?.departamento);
        this.formAnexo.controls['s1_provincia'].setValue(metaDataForm?.seccion1?.provincia);
        this.formAnexo.controls['s1_distrito'].setValue(metaDataForm?.seccion1?.distrito);
        this.formAnexo.controls['s1_telefono'].setValue(metaDataForm?.seccion1?.telefono);
        this.formAnexo.controls['s1_celular'].setValue(metaDataForm?.seccion1?.celular);
        this.formAnexo.controls['s1_correo'].setValue(metaDataForm?.seccion1?.correo);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
      }
    );

  }

  changeTipoDocumento() {
    this.formAnexo.controls['s2_numeroDocumentoFamiliar'].setValue('');
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
    const idTipoDocumento = this.formAnexo.get('s2_tipoDocumentoFamiliar').value.trim();
    const numeroDocumento = this.formAnexo.get('s2_numeroDocumentoFamiliar').value.trim();
    const idParentesco = this.formAnexo.get('s2_parentesco').value;
    const nombresApellidos = this.formAnexo.get('s2_nombresApellidos').value.trim();
    const ocupacion = this.formAnexo.get('s2_ocupacion').value.trim();
    if (
      numeroDocumento === '' ||
      nombresApellidos === '' ||
      idParentesco === '' ||
      ocupacion === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    const indexFound = this.suscritos.findIndex( item => item.numeroDocumento === numeroDocumento);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEdit ) {
        return this.funcionesMtcService.mensajeError('El pariente ya se encuentra registrado');
      }
    }

    let documento: string= this.listaTiposDocumentos.filter(item => item.id == idTipoDocumento)[0].documento;
    const tipoDocumento: TipoDocumentoModel = { id: idTipoDocumento, documento }

    const id: number = idParentesco;
    let descripcion: string= this.listaParentesco.filter(item => item.id == idParentesco)[0].descripcion;
    const parentesco: Parentesco = { id, descripcion }

    if (this.recordIndexToEdit === -1) {
      this.suscritos.push({
        tipoDocumento: tipoDocumento,
        numeroDocumento,
        parentesco,
        nombresApellidos,
        ocupacion
      });
    } else {
      this.suscritos[this.recordIndexToEdit].tipoDocumento = tipoDocumento;
      this.suscritos[this.recordIndexToEdit].numeroDocumento = numeroDocumento;
      this.suscritos[this.recordIndexToEdit].nombresApellidos = nombresApellidos;
      this.suscritos[this.recordIndexToEdit].parentesco = parentesco;
      this.suscritos[this.recordIndexToEdit].ocupacion = ocupacion;
    }

    this.clearSuscritoData();
  }

  public editSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.s2_tipoDocumentoFamiliar.setValue(suscrito.tipoDocumento.id);
    this.formAnexo.controls.s2_numeroDocumentoFamiliar.setValue(suscrito.numeroDocumento);
    this.formAnexo.controls.s2_parentesco.setValue(suscrito.parentesco.id);
    this.formAnexo.controls.s2_nombresApellidos.setValue(suscrito.nombresApellidos);
    this.formAnexo.controls.s2_ocupacion.setValue(suscrito.ocupacion);
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
    this.formAnexo.controls.s2_tipoDocumentoFamiliar.setValue(null);
    this.formAnexo.controls.s2_numeroDocumentoFamiliar.setValue('');
    this.formAnexo.controls.s2_nombresApellidos.setValue('');
    this.formAnexo.controls.s2_parentesco.setValue(null);
    this.formAnexo.controls.s2_ocupacion.setValue('');
    this.suscritos.sort((a, b) => a.parentesco.id < b.parentesco.id ? -1 : a.parentesco.id > b.parentesco.id ? 1 : 0)
  }

  save(){
    const dataGuardar: Anexo001_D28Request = new Anexo001_D28Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    const departamento: UbigeoResponse = new UbigeoResponse();
    departamento.id = this.formAnexo.get('s1_departamento').value;
    departamento.descripcion = this.listaDepartamentos.filter(item => item.value ==  this.formAnexo.get('s1_departamento').value)[0].text;

    const provincia: UbigeoResponse = new UbigeoResponse();
    provincia.id = this.formAnexo.get('s1_provincia').value;
    provincia.descripcion = this.listaProvincias.filter(item => item.value ==  this.formAnexo.get('s1_provincia').value)[0].text;

    const distrito: UbigeoResponse = new UbigeoResponse();
    distrito.id = this.formAnexo.get('s1_distrito').value;
    distrito.descripcion = this.listaDistritos.filter(item => item.value ==  this.formAnexo.get('s1_distrito').value)[0].text;

    let seccion1: A001_D28_Seccion1 = new A001_D28_Seccion1();
    seccion1.tipoDocumento = 'DNI';
    seccion1.nroDocumento = this.formAnexo.controls['s1_nroDocumento'].value;
    seccion1.nombreApellido = this.formAnexo.controls['s1_nombreApellido'].value;
    seccion1.nacionalidad = this.formAnexo.controls['s1_nacionalidad'].value;
    seccion1.domicilioLegal = this.formAnexo.controls['s1_domicilioLegal'].value;
    seccion1.distrito = distrito;
    seccion1.provincia = provincia;
    seccion1.departamento = departamento;
    seccion1.telefono = this.formAnexo.controls['s1_telefono'].value;
    seccion1.celular = this.formAnexo.controls['s1_celular'].value;
    seccion1.correo = this.formAnexo.controls['s1_correo'].value;
    seccion1.ocupacion = this.formAnexo.controls['s1_ocupacion'].value;
    seccion1.centroLaboral = this.formAnexo.controls['s1_centroLaboral'].value;
    dataGuardar.metaData.seccion1 = seccion1;

    const listafamiliares: Familiar[] = this.suscritos.map(suscrito => {
      return {
        tipoDocumentoFamiliar: suscrito.tipoDocumento,
        numeroDocumentoFamiliar: suscrito.numeroDocumento,
        nombresApellidos: suscrito.nombresApellidos,
        parentesco: suscrito.parentesco,
        ocupacion: suscrito.ocupacion
      } as Familiar
    });
    let seccion2: A001_D28_Seccion2 = new A001_D28_Seccion2();
    seccion2.familiares = listafamiliares;
    seccion2.lugar = this.formAnexo.controls['s2_lugar'].value;
    seccion2.fecha = this.fechaAnexo;
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
    const tipoDocumento = this.formAnexo.controls['s2_tipoDocumentoFamiliar'].value.trim();
    const numeroDocumento = this.formAnexo.controls['s2_numeroDocumentoFamiliar'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '1' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

          this.funcionesMtcService.mostrarCargando();
          if (tipoDocumento === '1') {//DNI
              this.reniecService.getDni(numeroDocumento).subscribe(
                respuesta => {
                    this.funcionesMtcService.ocultarCargando();
                    const datos = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
                    console.log(JSON.stringify(datos, null, 10));

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

          } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-D/28";
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

  onChangeDistritos() {
    const idDepartamento: string = this.formAnexo.controls['s1_departamento'].value.trim();
    const idProvincia: string = this.formAnexo.controls['s1_provincia'].value.trim();
    this.formAnexo.controls['s1_distrito'].setValue('');
    if(idDepartamento!=='' && idProvincia!==''){
    this.idDep = parseInt(idDepartamento);
    this.idProv = parseInt(idProvincia);
    this.listDistritos();
   }else{
    this.listaDistritos = [];
   }
  }
  
  onChangeProvincias() {
    const idDepartamento: string = this.formAnexo.controls['s1_departamento'].value;
    this.formAnexo.controls['s1_provincia'].setValue('');
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
