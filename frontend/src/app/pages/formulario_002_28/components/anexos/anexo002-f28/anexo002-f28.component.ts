import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { Anexo002_F28Request } from '../../../../../core/models/Anexos/Anexo002_F28/Anexo002_F28Request';
import { FuncionesMtcService } from '../../../../../core/services/funciones-mtc.service';
import { Anexo002F28Service } from '../../../../../core/services/anexos/anexo002-f28.service';
import { A002_F28_Seccion1, A002_F28_Seccion2, Miembro } from '../../../../../core/models/Anexos/Anexo002_F28/Secciones';
import { NgbModal, NgbActiveModal, NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { VistaPdfComponent } from '../../../../../shared/components/vista-pdf/vista-pdf.component';
import { FormularioTramiteService } from '../../../../../core/services/tramite/formulario-tramite.service';
import { Anexo002_F28Response } from 'src/app/core/models/Anexos/Anexo002_F28/Anexo002_F28Response';
import { VisorPdfArchivosService } from '../../../../../core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from '../../../../../core/services/tramite/anexo-tramite.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';

@Component({
  selector: 'app-anexo002-f28',
  templateUrl: './anexo002-f28.component.html',
  styleUrls: ['./anexo002-f28.component.css']
})
export class Anexo002F28Component implements OnInit {  
  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)

  public idAnexo: number;
  public formAnexo: UntypedFormGroup;
  public nroDocumento: string;
  tipoDocumento:string  = "";

  public filePdfCvSeleccionado: any;
  filePdfAdjuntoPathName: string = null;
  public documentos: any[]=[];

  cargadosDoc: number = 0;

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  public suscritos: any[];
  public recordIndexToEdit: number;
  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];
  listaCargos: any[] = [
    { id: "1", cargo: 'SOCIO' },
    { id: "2", cargo: 'REPRESENTANTE LEGAL' },
    { id: "3", cargo: 'GERENTE' },
    { id: "4", cargo: 'ASOCIADO' },
    { id: "5", cargo: 'DIRECTOR' },
    { id: "6", cargo: 'TITULAR' },
    { id: "7", cargo: 'ACCIONISTA' },
    { id: "8", cargo: 'MIEMBRO DE LA JUNTA' },
    { id: "9", cargo: 'APODERADO' }
  ];

  fechaAnexo: string = "";
  reqAnexo: number;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  constructor(
    private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private anexoService: Anexo002F28Service,
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


    this.filePdfCvSeleccionado = null;
    this.recordIndexToEdit = -1;
  }

  ngOnInit(): void {
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
    this.recuperarInformacion();
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

  }

  private createForm(): void{
    this.formAnexo = this.fb.group({
      s1_nroDocumento: ['', [ Validators.required ]],
      s1_denominacion: ['', [ Validators.required ]],
      s1_representanteLegal: ['', [ Validators.required ]],
      s2_djModificada: [false],
      s2_modifSocios: [false],
      s2_modifRepresentanteLegal: [false],
      s2_modifGerentes: [false],
      s2_modifAsociados: [false],
      s2_modifDirectores: [false],
      s2_modifTitular: [false],
      s2_modifAccionistas: [false],
      s2_modifMiembrosJunta: [false],
      s2_modifApoderados: [false],
      s2_tipoDocumento: [''],
      s2_numeroDocumento: [''],
      s2_nombresApellidos: [''],
      s2_nacionalidad: [''],
      s2_condicionCargo: [''],
      s2_porcentajeCapital: [''],
      s2_lugar: ['', [ Validators.required ]],
      s2_fecha: ['', [ Validators.required ]],
    });
  }

  recuperarInformacion(){

    //si existe el documento pero no esta completo
    if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
        this.heredarInformacionFormulario();
        //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
        this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataAnexo: Anexo002_F28Response) => {
            const metaData: any = JSON.parse(dataAnexo.metaData);

            this.idAnexo = dataAnexo.anexoId;

            let i = 0;
            for (i = 0; i < metaData.seccion2.miembros.length; i++) {
              this.suscritos.push({
                tipoDocumento: metaData.seccion2.miembros[i].tipoDocumento,
                numeroDocumento: metaData.seccion2.miembros[i].numeroDocumento,
                nombresApellidos: metaData.seccion2.miembros[i].nombresApellidos,
                nacionalidad: metaData.seccion2.miembros[i].nacionalidad,
                condicionCargo: metaData.seccion2.miembros[i].condicionCargo,
                porcentajeCapital: metaData.seccion2.miembros[i].porcentajeCapital
              });
            }
  
            this.tipoDocumento = metaData.seccion1.tipoDocumento;
            this.formAnexo.get("s1_nroDocumento").setValue(`${metaData?.seccion1?.nroDocumento}`);
            this.formAnexo.get("s1_denominacion").setValue(`${metaData?.seccion1?.denominacion}`);
            this.formAnexo.get("s1_representanteLegal").setValue(metaData.seccion1.representanteLegal);
            
            this.formAnexo.get("s2_djModificada").setValue(metaData.seccion2.djModificada);
            this.formAnexo.get("s2_modifSocios").setValue(metaData.seccion2.modifSocios);
            this.formAnexo.get("s2_modifRepresentanteLegal").setValue(metaData.seccion2.modifRepresentanteLegal);
            this.formAnexo.get("s2_modifGerentes").setValue(metaData.seccion2.modifGerentes);
            this.formAnexo.get("s2_modifAsociados").setValue(metaData.seccion2.modifAsociados);
            this.formAnexo.get("s2_modifDirectores").setValue(metaData.seccion2.modifDirectores);
            this.formAnexo.get("s2_modifTitular").setValue(metaData.seccion2.modifTitular);
            this.formAnexo.get("s2_modifAccionistas").setValue(metaData.seccion2.modifAccionistas);
            this.formAnexo.get("s2_modifMiembrosJunta").setValue(metaData.seccion2.modifMiembrosJunta);
            this.formAnexo.get("s2_modifApoderados").setValue(metaData.seccion2.modifApoderados);
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
        (dataAnexo: Anexo002_F28Response) => {
          const metaData: any = JSON.parse(dataAnexo.metaData);

          this.idAnexo = dataAnexo.anexoId;

          console.log(JSON.stringify(dataAnexo, null, 10));
          console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

          let i = 0;
          for (i = 0; i < metaData.seccion2.miembros.length; i++) {
            this.suscritos.push({
              tipoDocumento: metaData.seccion2.miembros[i].tipoDocumento,
              numeroDocumento: metaData.seccion2.miembros[i].numeroDocumento,
              nombresApellidos: metaData.seccion2.miembros[i].nombresApellidos,
              nacionalidad: metaData.seccion2.miembros[i].nacionalidad,
              condicionCargo: metaData.seccion2.miembros[i].condicionCargo,
              porcentajeCapital: metaData.seccion2.miembros[i].porcentajeCapital
            });
          }

          this.tipoDocumento = metaData.seccion1.tipoDocumento;
          this.formAnexo.get("s1_nroDocumento").setValue(`${metaData?.seccion1?.nroDocumento}`);
          this.formAnexo.get("s1_denominacion").setValue(`${metaData?.seccion1?.denominacion}`);
          this.formAnexo.get("s1_representanteLegal").setValue(metaData.seccion1.representanteLegal);
          
          this.formAnexo.get("s2_djModificada").setValue(metaData.seccion2.djModificada);
          this.formAnexo.get("s2_modifSocios").setValue(metaData.seccion2.modifSocios);
          this.formAnexo.get("s2_modifRepresentanteLegal").setValue(metaData.seccion2.modifRepresentanteLegal);
          this.formAnexo.get("s2_modifGerentes").setValue(metaData.seccion2.modifGerentes);
          this.formAnexo.get("s2_modifAsociados").setValue(metaData.seccion2.modifAsociados);
          this.formAnexo.get("s2_modifDirectores").setValue(metaData.seccion2.modifDirectores);
          this.formAnexo.get("s2_modifTitular").setValue(metaData.seccion2.modifTitular);
          this.formAnexo.get("s2_modifAccionistas").setValue(metaData.seccion2.modifAccionistas);
          this.formAnexo.get("s2_modifMiembrosJunta").setValue(metaData.seccion2.modifMiembrosJunta);
          this.formAnexo.get("s2_modifApoderados").setValue(metaData.seccion2.modifApoderados);
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
        this.formAnexo.controls['s1_denominacion'].setValue(`${metaDataForm?.seccion1?.razonSocial}`);
        this.tipoDocumento = metaDataForm.seccion1.tipoDocRepresentante === '1' ? 'DNI' : 'C.E.';
        this.formAnexo.controls['s1_nroDocumento'].setValue(`${metaDataForm?.seccion1?.nroDocRepresentante}`);
        this.formAnexo.controls['s1_representanteLegal'].setValue(metaDataForm?.seccion1?.representanteLegal);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para conectarnos con el servicio y recuperar datos.');
      }
    );

  }

  changeTipoDocumento() {
    this.formAnexo.controls['s2_numeroDocumento'].setValue('');
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
    const idTipoDocumento = this.formAnexo.get('s2_tipoDocumento').value.trim();
    const numeroDocumento = this.formAnexo.get('s2_numeroDocumento').value.trim();
    const nombresApellidos = this.formAnexo.get('s2_nombresApellidos').value.trim();
    const nacionalidad = this.formAnexo.get('s2_nacionalidad').value.trim();
    const condicionCargo = this.formAnexo.get('s2_condicionCargo').value.trim();
    const porcentajeCapital = this.formAnexo.get('s2_porcentajeCapital').value;
    if (
      numeroDocumento   === '' ||
      nombresApellidos  === '' ||
      nacionalidad      === '' ||
      condicionCargo    === '' ||
      porcentajeCapital === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    const indexFound = this.suscritos.findIndex( item => item.numeroDocumento === numeroDocumento);

    if ( indexFound !== -1 ) {
      if ( indexFound !== this.recordIndexToEdit ) {
        return this.funcionesMtcService.mensajeError('El miembro ya se encuentra registrado');
      }
    }

    let documento: string= this.listaTiposDocumentos.filter(item => item.id == idTipoDocumento)[0].documento;
    const tipoDocumento: TipoDocumentoModel = { id: idTipoDocumento, documento }
    
    if (this.recordIndexToEdit === -1) {
      this.suscritos.push({
        tipoDocumento: tipoDocumento,
        numeroDocumento,
        nombresApellidos,
        nacionalidad,
        condicionCargo,
        porcentajeCapital
      });
    } else {
      this.suscritos[this.recordIndexToEdit].tipoDocumento = tipoDocumento;
      this.suscritos[this.recordIndexToEdit].numeroDocumento = numeroDocumento;
      this.suscritos[this.recordIndexToEdit].nombresApellidos = nombresApellidos;
      this.suscritos[this.recordIndexToEdit].nacionalidad = nacionalidad;
      this.suscritos[this.recordIndexToEdit].condicionCargo = condicionCargo;
      this.suscritos[this.recordIndexToEdit].porcentajeCapital = porcentajeCapital;
    }

    this.clearSuscritoData();
  }

  public editSuscrito( suscrito: any, i: number ){
    if (this.recordIndexToEdit !== -1){
      return;
    }

    this.recordIndexToEdit = i;

    this.formAnexo.controls.s2_tipoDocumento.setValue(suscrito.tipoDocumento.id);
    this.formAnexo.controls.s2_numeroDocumento.setValue(suscrito.numeroDocumento);
    this.formAnexo.controls.s2_nombresApellidos.setValue(suscrito.nombresApellidos);
    this.formAnexo.controls.s2_nacionalidad.setValue(suscrito.nacionalidad);
    this.formAnexo.controls.s2_condicionCargo.setValue(suscrito.condicionCargo);
    this.formAnexo.controls.s2_porcentajeCapital.setValue(suscrito.porcentajeCapital);
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
    this.formAnexo.controls.s2_tipoDocumento.setValue(null);
    this.formAnexo.controls.s2_numeroDocumento.setValue('');
    this.formAnexo.controls.s2_nombresApellidos.setValue('');
    this.formAnexo.controls.s2_nacionalidad.setValue('');
    this.formAnexo.controls.s2_condicionCargo.setValue('');
    this.formAnexo.controls.s2_porcentajeCapital.setValue('');
  }


  save(){
    const dataGuardar: Anexo002_F28Request = new Anexo002_F28Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "F";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;

    let seccion1: A002_F28_Seccion1 = new A002_F28_Seccion1();
    seccion1.tipoDocumento = this.tipoDocumento;
    seccion1.nroDocumento = this.formAnexo.controls['s1_nroDocumento'].value;
    seccion1.denominacion = this.formAnexo.controls['s1_denominacion'].value;
    seccion1.representanteLegal = this.formAnexo.controls['s1_representanteLegal'].value;
    dataGuardar.metaData.seccion1 = seccion1;

    const listaMiembros: Miembro[] = this.suscritos.map(suscrito => {
      return {
        tipoDocumento: suscrito.tipoDocumento,
        numeroDocumento: suscrito.numeroDocumento,
        nombresApellidos: suscrito.nombresApellidos,
        nacionalidad: suscrito.nacionalidad,
        condicionCargo: suscrito.condicionCargo,
        porcentajeCapital: suscrito.porcentajeCapital
      } as Miembro
    });
    
    let seccion2: A002_F28_Seccion2 = new A002_F28_Seccion2();
    seccion2.djNoModificada = !this.formAnexo.controls['s2_djModificada'].value
    seccion2.djModificada = this.formAnexo.controls['s2_djModificada'].value
    seccion2.modifSocios = this.formAnexo.controls['s2_modifSocios'].value
    seccion2.modifRepresentanteLegal = this.formAnexo.controls['s2_modifRepresentanteLegal'].value
    seccion2.modifGerentes = this.formAnexo.controls['s2_modifGerentes'].value
    seccion2.modifAsociados = this.formAnexo.controls['s2_modifAsociados'].value
    seccion2.modifDirectores = this.formAnexo.controls['s2_modifDirectores'].value
    seccion2.modifTitular = this.formAnexo.controls['s2_modifTitular'].value
    seccion2.modifAccionistas = this.formAnexo.controls['s2_modifAccionistas'].value
    seccion2.modifMiembrosJunta = this.formAnexo.controls['s2_modifMiembrosJunta'].value
    seccion2.modifApoderados = this.formAnexo.controls['s2_modifApoderados'].value
    seccion2.miembros = listaMiembros;
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
    const tipoDocumento = this.formAnexo.controls['s2_tipoDocumento'].value.trim();
    const numeroDocumento = this.formAnexo.controls['s2_numeroDocumento'].value.trim();

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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-F/28";
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
