import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoadComponentService } from 'src/app/core/services/load-component.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AdjuntarAdicional, ArchivosAdjuntos, EnviarSolicitudModel, EnviarTramiteAdicionalModel, Requisito, TramiteModel } from 'src/app/core/models/Tramite/TramiteModel';
import { truncateString } from 'src/app/helpers/functions';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { SelectItemModel } from 'src/app/core/models/SelectItemModel';
import { ProfesionalService } from '../../../../core/services/profesional/profesional.service';
import { AsignarProfRequest } from 'src/app/core/models/Profesional/AsignarProfRequestModel';
import { CONSTANTES } from '../../../../enums/constants';
import { ReniecService } from '../../../../core/services/servicios/reniec.service';
import { ExtranjeriaService } from '../../../../core/services/servicios/extranjeria.service';
import { exactLengthValidator } from '../../../../helpers/validator';
import { ResponseComunModel } from '../../../../core/models/Tramite/ResponseComunModel';
import { EncuestaService } from 'src/app/core/services/encuesta/encuesta.service';
import { ApiResponse } from 'src/app/core/models/api-response';
import { Documentos } from 'src/app/core/models/Anexos/Anexo003_C17/Secciones';
import { FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { ApiResponseModel } from 'src/app/core/models/Autenticacion/TipoPersonaResponseModel';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { GlobalService } from 'src/app/core/services/mapas/global.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TipoComunicacionModel } from 'src/app/core/models/Tramite/TipoComunicacionModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';

@Component({
  selector: 'app-tramite-iniciado',
  templateUrl: './tramite-iniciado.component.html',
  styleUrls: ['./tramite-iniciado.component.css']
})
export class TramiteIniciadoComponent implements OnInit, AfterViewInit {

  // tupaTramite: {
  //   tupaId: 0,
  //   tupaNombre: '',
  //   tupaCodigo: '',
  //   estado: '',
  //   tipoSolicitud:'',
  //   esGratuito: false,
  //   observaciones: '',
  //   documentoAtendido: '',
  //   requisitos: [];
  // };
  tupaTramite: TramiteModel;

  tramiteId = 0;
  filePdfGuardado: any = null;
  filePdfSeleccionado: any = null;
  filePdfSeleccionadoNombre: any = '';
  tramiteReqIdSeleccionado: number;
  tramiteSelected: {} = null;

  tipoPersona: string;
  numExpediente: string;
  tipoDocumento: string;
  NDocumento: string;
  Nombres: string;
  maximoUpload = 3072;
  urlArchivo = '';
  correlativo = 0;
  orden = 0;
  secuencia = [];

  listadoNotas: any = null;
  listadoDocumentos: any = null;
  notas = 0;
  documentos = 0;
  docDescripcion = '';

  // DEMO
  item: {
    codigoFormAnexo: ''
  };

  asignarProfFG: UntypedFormGroup;
  solicitudesAdicionales: FormGroup;
  listaTipoDoc: SelectItemModel[];
  listaProfesion: SelectItemModel[];

  numDocLength: number;
  idEncuestaConfig: number = null;
  documentosAdjuntos: ArchivosAdjuntos[] = [];
  envioSolicitud: EnviarSolicitudModel;
  data: FormularioSolicitudDIA;
  archivoRequisito: number = 0;
  codigoTupaMisTramites: string = '';
  isVisible: boolean = false;
  estadoSolicitud: string;
  estadoFormulario: string;
  contarMensajes: number;
  isVisibleTramite: boolean = false;
  listaTipoComunicacion: TipoComunicacionModel[] = [];
  listaTipoDocumento: TipoDocumentoModel[] = [];
  tipoComunicacion= 0;
  tipoDocumentoTramite= 0;
  numeroDocumento= '';
  descripcion= '';
  archivosSeleccionados: File[] = [];
  documentosSeleccionados: File[] = [];
  modoVisualizacion: boolean = false;
  esFuncionario: boolean = false;
  denominacionEstado: string;
  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private loadComponentService: LoadComponentService,
    private config: NgbModalConfig,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private seguridadService: SeguridadService,
    private profesionalService: ProfesionalService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private encuestaService: EncuestaService,
    private externoService: ExternoService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private formularioService: FormularioTramiteService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.tupaTramite = new TramiteModel();
    //this.envioSolicitud= new EnviarSolicitudModel();
  }

  ngOnInit(): void {
    this.funcionesMtcService.mostrarCargando();
    // this.codigoTupa = this.activatedRoute.snapshot.paramMap.get('ctupa');
    // console.log(this.codigoTupa);
    this.tramiteId = Number(localStorage.getItem('tramite-id'));
    this.tipoDocumento = this.seguridadService.getNameId();
    this.NDocumento = this.seguridadService.getNumDoc();
    this.Nombres = this.seguridadService.getUserName();
    this.numExpediente = localStorage.getItem('tramite-solicitud');
       
    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);   
    this.estadoFormulario = tramiteObj.estadoFormulario;
    this.contarMensajes = +tramiteObj.contarMensajes;
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
    
    this.asignarProfFG = this.fb.group({
      ap_TipoDocFC: ['', [Validators.required]],
      ap_NumDocFC: ['', [Validators.required]],
      ap_NombresFC: ['', [Validators.required, Validators.maxLength(100)]],
      ap_ApPaternoFC: ['', [Validators.required, Validators.maxLength(100)]],
      ap_ApMaternoFC: ['', [Validators.maxLength(100)]],
      ap_EmailFC: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      ap_ProfesionFC: ['', [Validators.required]],
      ap_NumColegiaFC: ['', [Validators.required, Validators.maxLength(30)]],
    });
    
    this.solicitudesAdicionales = this.fb.group({
      tipoComunicacion: ['0',  [Validators.required, this.tipoComunicacionValidator]],
      tipoDocumentoTramite: ['0',  [Validators.required, this.tipoDocumentoValidator]],
      numeroDocumento: ['', Validators.required],
      descripcion: ['', Validators.required],
      archivos: [null, [Validators.required, this.archivoValidator]],
      
    });
 
    this.route.queryParams.subscribe(params => {
      this.codigoTupaMisTramites = params['codigoTupa'];
      this.denominacionEstado = params['denominacionEstado'];
    });

    this.comboTipoComunicacion();
    this.comboTipoDocumento();

    


    this.modoVisualizacion = this.esFuncionario ? true : (['FINALIZADO', 'APROBADO', 'DESAPROBADO', 'DESISTIDO', 'ABANDONO'].includes(this.denominacionEstado));
    this.habilitarControles();   
  }

  habilitarControles() {
    if (this.viewOnly) {
      if(this.solicitudesAdicionales !== undefined)
        Object.keys(this.solicitudesAdicionales.controls).forEach(controlName => {
          const control = this.solicitudesAdicionales.get(controlName);
          control?.disable();
        });
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    await this.recuperarTramite();
    //await this.poblarProfesion();
    this.poblarTipoDocumento();

    this.onChangeTipoDocumento();
    this.onChangeNroDocumento();
    //this.onChangeProfesion();
    //this.buscarEncuesta();

    this.funcionesMtcService.ocultarCargando();
  }

  buscarEncuesta() {
    const idProced = this.tupaTramite.tupaId
    const destino = 1 // al enviar trámite
    this.encuestaService.buscarPorProcedYDestino(idProced, destino)
      .subscribe((result: any) => {
        console.log("buscarEncuesta() => ", result)
        if (result.success && result.data)
          this.idEncuestaConfig = result.data.idEncuestaConfig
      }, (error) => {
        console.log("Error al buscar encuesta => ", error)
      })
  }

  // GET FORM asignarProfFG
  get ap_TipoDocFC(): UntypedFormControl { return this.asignarProfFG.get('ap_TipoDocFC') as UntypedFormControl; }
  get ap_NumDocFC(): UntypedFormControl { return this.asignarProfFG.get('ap_NumDocFC') as UntypedFormControl; }
  get ap_NombresFC(): UntypedFormControl { return this.asignarProfFG.get('ap_NombresFC') as UntypedFormControl; }
  get ap_ApPaternoFC(): UntypedFormControl { return this.asignarProfFG.get('ap_ApPaternoFC') as UntypedFormControl; }
  get ap_ApMaternoFC(): UntypedFormControl { return this.asignarProfFG.get('ap_ApMaternoFC') as UntypedFormControl; }
  get ap_EmailFC(): UntypedFormControl { return this.asignarProfFG.get('ap_EmailFC') as UntypedFormControl; }
  get ap_ProfesionFC(): UntypedFormControl { return this.asignarProfFG.get('ap_ProfesionFC') as UntypedFormControl; }
  get ap_NumColegiaFC(): UntypedFormControl { return this.asignarProfFG.get('ap_NumColegiaFC') as UntypedFormControl; }
  // FIN GET FORM asignarProfFG

  onChangeTipoDocumento(): void {
    this.ap_TipoDocFC.valueChanges.subscribe((tipoDoc: string) => {
      console.log('tipoDoc valuechanges: ', tipoDoc);

      this.ap_NumDocFC.reset('', { emitEvent: false });
      this.ap_NombresFC.reset('', { emitEvent: false });
      this.ap_ApPaternoFC.reset('', { emitEvent: false });
      this.ap_ApMaternoFC.reset('', { emitEvent: false });

      if (!tipoDoc) {
        this.ap_NumDocFC.disable({ emitEvent: false });
        this.ap_NombresFC.disable({ emitEvent: false });
        this.ap_ApPaternoFC.disable({ emitEvent: false });
        this.ap_ApMaternoFC.disable({ emitEvent: false });
        return;
      }

      this.ap_NumDocFC.enable({ emitEvent: false });
      this.ap_NombresFC.enable({ emitEvent: false });
      this.ap_ApPaternoFC.enable({ emitEvent: false });
      this.ap_ApMaternoFC.enable({ emitEvent: false });

      this.ap_NumDocFC.clearValidators();
      this.ap_ApMaternoFC.clearValidators();
      if (tipoDoc === CONSTANTES.TipoDocPersona.DNI) {
        this.numDocLength = 8;
        this.ap_NumDocFC.setValidators([Validators.required, exactLengthValidator([8])]);
        this.ap_ApMaternoFC.setValidators([Validators.required]);
      }
      else if (tipoDoc === CONSTANTES.TipoDocPersona.CARNET_EXTRANJERIA) {
        this.numDocLength = 9;
        this.ap_NumDocFC.setValidators([Validators.required, exactLengthValidator([9])]);
      }
    });
  }

  onChangeNroDocumento(): void {
    this.ap_NumDocFC.valueChanges.subscribe((numDoc: string) => {
      console.log('ap_NumDocFC valuechanges: ', numDoc);
      this.ap_NombresFC.reset('', { emitEvent: false });
      this.ap_ApPaternoFC.reset('', { emitEvent: false });
      this.ap_ApMaternoFC.reset('', { emitEvent: false });
    });
  }

  onChangeProfesion(): void {
    this.ap_ProfesionFC.valueChanges.subscribe((profesion: string) => {
      console.log('profesion valuechanges: ', profesion);

      const value = this.listaProfesion?.find(r => r.text === 'OTROS')?.value;
      this.ap_NumColegiaFC.reset();
      if (profesion === value) {
        this.ap_NumColegiaFC.disable({ emitEvent: false });
      }
      else {
        this.ap_NumColegiaFC.enable({ emitEvent: false });
      }
    });
  }

  async enviarTramite(btnSubmit: HTMLButtonElement): Promise<void> {



    btnSubmit.disabled = true;

    // Comprobando obligatoriedad de requisitos
    let pagosAdicionales = 0;
    const pagosRealizados = 0;

    /******** RUC EXONERADO (IRTV) *******/
    const rucexo = '20338915471';
    const currentRUC = this.seguridadService.getCompanyCode();
    let exonerado = false;
    if (rucexo === currentRUC) { exonerado = true; }

    /** Comentado temporalmente**/
    // for (const requisito of this.tupaTramite.requisitos) {
    //   // Revisando pagos
    //   pagosAdicionales = pagosAdicionales + Number(requisito.pagosAdicionales);

    //   if (requisito.obligatorio && !requisito.completo && !exonerado) {
    //     this.funcionesMtcService.mensajeError(`Complete el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     btnSubmit.disabled = false;
    //     return;
    //   }

    //   if (requisito.obligatorio && requisito.requiereFirma && !requisito.firmado) {
    //     if (requisito.profAsigId) {
    //       this.funcionesMtcService.mensajeError(`El profesional asignado aún no ha completado la firma electrónica en el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     }
    //     else {
    //       this.funcionesMtcService.mensajeError(`Se requiere la firma de un profesional en el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     }
    //     btnSubmit.disabled = false;
    //     return;
    //   }
    // }

    /** Comentado temporalmente**/

    this.funcionesMtcService.mostrarCargando();
    /**Comentado para avance **/
    // if (!this.tupaTramite.esGratuito && !exonerado) {
    //   // Verificando pago
    //   this.tramiteService.putVerificarPago(this.tramiteId).subscribe(
    //     response => {
    //       console.log(response);
    //       if (response === 1) {
    //         this.funcionesMtcService.ocultarCargando();
    //         this.funcionesMtcService.mensajeError('El voucher de pago ya ha sido utilizado en otra transacción. Contáctese con Atencion al Ciudadano').then(() => {
    //           this.router.navigate(['tramite-iniciado']);
    //           return;
    //         });
    //       }
    //     },
    //     error => {
    //       this.funcionesMtcService.mensajeError('No se pudo comprobar el pago');
    //       this.funcionesMtcService.ocultarCargando();
    //       this.router.navigate(['tramite-iniciado']);
    //       return;
    //     }
    //   );
    // }
    /**Comentado para avance **/

    /**Comentado para avance **/
    // COMPROBANDO SI ESTA OBSERVADO
    // if (this.tupaTramite.estado.toString() === 'OBSERVADO') {
    //   // Enviando trámite
    //   try {
    //     this.funcionesMtcService.mostrarCargando();
    //     const response = await this.tramiteService.putSubsanar<ResponseComunModel<string>>(this.tramiteId).toPromise();
    //     console.log(response);

    //     if (!response.success) {
    //       this.funcionesMtcService.ocultarCargando();
    //       this.funcionesMtcService.mensajeError(response.message)
    //         .then(() => {
    //           this.router.navigate(['/mis-tramites']);
    //         });
    //     }
    //     else {
    //       let mensaje = `La subsanación fue enviada exitosamente.\n `;
    //       if (this.numExpediente.substring(0, 1) === 'T') {
    //         mensaje = mensaje + `Utilice sus credenciales para hacer el seguimiento en https://sdt.mtc.gob.pe/`;
    //       }
    //       this.funcionesMtcService.ocultarCargando();
    //       this.funcionesMtcService.mensajeOk(mensaje)
    //         .then(() => {
    //           this.router.navigate(['/mis-tramites']);
    //         });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
    //     this.funcionesMtcService.ocultarCargando();
    //   }
    // } else {
    /**Comentado para avance **/


    // Enviando trámite
    try {
      //Generar Expediente
      const data = {
        ClienteId: this.seguridadService.getIdCliente() ?? 1,
        AsuntoDocId: 2,
        TipoDocumentoId: 35,
        GestorOficinaId: '0266',
        PersonaCodigo: '011423',
        AsuntoDescripcion: 'DECLARACION ANUAL CONSOLIDADA ',
        NumeroDocumento: null,
        Observacion: 'REMISION DE DAC VIA WEB',
        TupaFlag: '0',
        TupaId: 0,
        TupaConceptoId: 1,
        EstadoPagoFlag: 'C',
        PagoTupa: null,
        ImporteTupa: null,
        CongresoFlag: 'N',
        CopiaInfFlag: 'N',
        AnexoPrincipalCodigo: null,
        RequisitoCompletoFlag: '1',
        UsuarioIngreso: 'WEB',
        CantidadFolio: 0,
        SubsanacionFlag: '0',
        VVFlag: '0',
        WebFlag: '1',
        PrioridadFlag: '0'
      }

      const expediente = await this.externoService.postExpedienteTramite(data).toPromise();

      const envio: EnviarSolicitudModel = {
        IdSolicitud: this.tramiteId,
        Documentos: this.documentosAdjuntos,
        NroExpediente: expediente.data
      };
      // this.envioSolicitud.IdSolicitud = this.tramiteId;
      // this.envioSolicitud.Documentos = this.documentosAdjuntos;

      this.funcionesMtcService.mostrarCargando();
      //const response = await this.tramiteService.putEnviar<ApiResponse<EnviarSolicitudModel>>(this.tramiteId).toPromise();
      const response = await this.tramiteService.putEnviar<ApiResponse<any>>(envio).toPromise();
     

      if (!response.success) {
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError(response.message)
          .then(() => {
            this.router.navigate(['/mis-tramites']);
          });
      }
      else {
 
        this.funcionesMtcService.ocultarCargando();
        const result = response.data;        
        const titulo = `<b>Trámite enviado</b><br>`;
        let html = `Estimado usuario.<br>Su trámite fue enviado exitosamente.<br><b>Nro de solicitud: ${expediente.data}</b>`;
                    
        if (result)
          //html += `<br>Utilice la siguiente clave <b>${'T_T_Clave$Prueba'}</b> para hacer el seguimiento en https://extranet.minem.gob.pe/`;
          html += `<br>Puede realizar el seguimiento en https://extranet.minem.gob.pe/`;
        //html += `<br>Utilice la siguiente clave <b>${result.ClaveAcceso}</b> para hacer el seguimiento en https://extranet.minem.gob.pe/`;

        // if(this.idEncuestaConfig !== null){
        //   html += `<br><br><b class="text-success">¡Queremos seguir mejorando!</b><br><br>Nos gustaría que nos cuentes tu experiencia a través una breve encuesta.<br><b>No tomará más de un minuto.</b>`;

        //   this.funcionesMtcService.ocultarCargando();
        //   this.funcionesMtcService.mensajeOkEncuesta(titulo, null , html, "Ir a Encuesta")
        //     .then(() => {
        //       this.funcionesMtcService.mostrarCargando();
        //       this.encuestaService.generarEncuesta(this.tramiteId, this.idEncuestaConfig)
        //       .subscribe((result: any) => {
        //         this.funcionesMtcService.ocultarCargando();
        //         this.router.navigate(['encuesta/form', result.idEncuesta, result.codigoIdentificador]);
        //       }, (error) => {
        //         this.funcionesMtcService.ocultarCargando();
        //         this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
        //       })
        //     });
        // }else{
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeOkEncuesta(titulo, null, html)
          .then(() => {
            this.router.navigate(['/mis-tramites']);
          });


        // });        
        //}
      }
    } catch (error) {
      console.log(error);
      this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
      this.funcionesMtcService.ocultarCargando();
    }
    //}

    btnSubmit.disabled = false;
  }

  openUrlPago(item: Requisito): void {
    /*********** BUSCANDO DEPENDENCIA *************/
    // const reqParentId = item.tramiteReqRefId;
    // let dependecia = false;
    // let reqOrden = 0;
    // let reqCompletar = '';
    // let pagos = 0;
    // let montoadd = 0;
    // for (const req of this.tupaTramite.requisitos) {
    //   if (req.tramiteReqId === reqParentId) {
    //     pagos = req.pagosAdicionales;
    //     montoadd = req.montoAdicional;
    //     if (req.completo === false) {
    //       dependecia = true;
    //       reqOrden = req.orden;
    //       reqCompletar = req.descripcion;
    //       break;
    //     }
    //   }
    // }
    // if (dependecia) {
    //   this.funcionesMtcService.mensajeError(`Complete el requisito ${reqOrden}: ${truncateString(reqCompletar, 50)}`);
    //   return;
    // }

    /******** RUC EXONERADO (IRTV) *******/
    const rucexo = '20338915471';
    const pagos = 1;
    const montoadd = 1098.99;
    const currentRUC = this.seguridadService.getCompanyCode();
    if (rucexo === currentRUC) {
      this.funcionesMtcService.mensajeError('¡Usted esta exonerado del pago!');
    } else {
      // LLAMADA POR DEFECTO
      localStorage.setItem('tramite-tributo', item.codigoTributo);
      localStorage.setItem('tramite-costo', item.costo.toString());
      localStorage.setItem('tramite-clasificador', item.clasificador); // CLASIFICADOR DE PAGO
      localStorage.setItem('tramite-pagos', pagos.toString()); // VARIABLE PARA LOS PAGOS ADICIONALES (cantidad)
      localStorage.setItem('tramite-montoadd', montoadd.toString()); // VARIABLE PARA LOS PAGOS ADICIONALES (monto)
      localStorage.setItem('tramite-req-id', item.tramiteReqId.toString());
      localStorage.setItem('tramite-req-ref-id', item.tramiteReqRefId?.toString() ?? ''); // IDENTIFICADOR DEL REQUISITO DE REFERENCIA
      this.router.navigate(['pasarela-pago']);
    }
  }

  descargarPlantilla(plantillaUrl): void {
    window.open(plantillaUrl, '_blank');
  }

  irMisTramites(): void {
    this.router.navigate(['/mis-tramites']);
  }

  modalSubirArchivoClose(): void {
    this.archivoRequisito = 0;
    this.filePdfSeleccionadoNombre = "";
    this.modalService.dismissAll();
  }

  openModalAdjuntar(content, item: Requisito): void {
    if (item.requiereFirma && item.profAsigId) {
      this.funcionesMtcService
        .mensajeWarnConfirmar(`Este requisito requiere firma electrónica y deberá volver
        a asignar un profesional para su completado. ¿Está seguro de volver a cargar el archivo?`)
        .then(() => {
          this.filePdfGuardado = item.rutaDocumento;
          this.tramiteReqIdSeleccionado = item.tramiteReqId;
          this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
        });
    }
    else {
      this.filePdfGuardado = item.rutaDocumento;
      this.tramiteReqIdSeleccionado = item.tramiteReqId;
      this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
    }
  }

  openModalAdicional(content, documentos: any[]): void {
    this.docDescripcion = '';
    this.documentosSeleccionados = documentos;
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  openModalAsignarProf(content, { tramiteReqId, profAsignado }: Requisito): void {
    this.asignarProfFG.enable({ emitEvent: false });

    if (profAsignado) {
      console.log('profAsignado: ', profAsignado);

      this.ap_TipoDocFC.setValue(profAsignado.tipoDoc, { emitEvent: false });
      this.ap_NumDocFC.setValue(profAsignado.numDoc, { emitEvent: false });
      this.ap_NombresFC.setValue(profAsignado.nombres, { emitEvent: false });
      this.ap_ApPaternoFC.setValue(profAsignado.apPaterno, { emitEvent: false });
      this.ap_ApMaternoFC.setValue(profAsignado.apMaterno, { emitEvent: false });
      this.ap_EmailFC.setValue(profAsignado.email, { emitEvent: false });
      this.ap_ProfesionFC.setValue(profAsignado.profesionId.toString(), { emitEvent: false });
      this.ap_NumColegiaFC.setValue(profAsignado.numColegia, { emitEvent: false });
    }
    else {
      this.ap_TipoDocFC.reset('');
      this.ap_EmailFC.reset();
      this.ap_ProfesionFC.reset('');
      this.ap_NumColegiaFC.reset();
    }

    this.tramiteReqIdSeleccionado = tramiteReqId;

    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  poblarTipoDocumento(): void {
    this.listaTipoDoc = new Array<SelectItemModel>();
    this.listaTipoDoc.push({
      value: '00002',
      text: 'DNI'
    } as SelectItemModel);
    this.listaTipoDoc.push({
      value: '00003',
      text: 'Carnet Extranjería'
    } as SelectItemModel);
  }

  async poblarProfesion(): Promise<void> {
    try {
      await this.profesionalService.getObtenerProfesiones().subscribe(async (response) => {
        this.listaProfesion = response.data.map((item) => {
          return { value: item.profesionId.toString(), text: item.descripcion } as SelectItemModel;
        });
        console.log('listaProfesion: ', this.listaProfesion);
      });

    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los perfiles profesionales');
    }
  }

  async buscarPersona(): Promise<void> {
    const tipoDoc = this.ap_TipoDocFC.value;
    const numDoc = this.ap_NumDocFC.value;

    this.ap_TipoDocFC.disable({ emitEvent: false });
    this.ap_NumDocFC.disable({ emitEvent: false });

    this.funcionesMtcService.mostrarCargando();

    try {
      const profAsignado = await this.profesionalService.getObtenerProfesional(tipoDoc, numDoc).toPromise();
      console.log('profAsignado: ', profAsignado);
      this.funcionesMtcService.ocultarCargando();
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados y corresponden a la persona ${profAsignado.nombres} ${profAsignado.apPaterno} ${profAsignado.apMaterno}. ¿Está seguro de agregarlo?`)
        .then(() => {
          this.ap_TipoDocFC.setValue(profAsignado.tipoDoc, { emitEvent: false });
          this.ap_NumDocFC.setValue(profAsignado.numDoc, { emitEvent: false });
          this.ap_NombresFC.setValue(profAsignado.nombres, { emitEvent: false });
          this.ap_ApPaternoFC.setValue(profAsignado.apPaterno, { emitEvent: false });
          this.ap_ApMaternoFC.setValue(profAsignado.apMaterno, { emitEvent: false });
          this.ap_EmailFC.setValue(profAsignado.email, { emitEvent: false });
          this.ap_ProfesionFC.setValue(profAsignado.profesionId.toString(), { emitEvent: false });
          this.ap_NumColegiaFC.setValue(profAsignado.numColegia, { emitEvent: false });

          this.ap_TipoDocFC.enable({ emitEvent: false });
          this.ap_NumDocFC.enable({ emitEvent: false });
        })
        .catch(() => {
          this.ap_TipoDocFC.enable({ emitEvent: false });
          this.ap_NumDocFC.enable({ emitEvent: false });
        });
      return;
    } catch (error) {
      console.log('No existe el profesional en la BD');
    }

    if (tipoDoc === CONSTANTES.TipoDocPersona.DNI) {
      try {
        const respuesta = await this.reniecService.getDni(numDoc).toPromise();

        this.funcionesMtcService.ocultarCargando();

        if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
          this.ap_TipoDocFC.enable({ emitEvent: false });
          this.ap_NumDocFC.enable({ emitEvent: false });
          this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
          return;
        }

        const { prenombres, apPrimer, apSegundo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;

        this.funcionesMtcService
          .mensajeConfirmar(`Los datos ingresados fueron validados por RENIEC y corresponden a la persona ${prenombres} ${apPrimer} ${apSegundo}. ¿Está seguro de agregarlo?`)
          .then(() => {
            this.ap_NombresFC.setValue(prenombres);
            this.ap_ApPaternoFC.setValue(apPrimer);
            this.ap_ApMaternoFC.setValue(apSegundo);

            this.ap_TipoDocFC.enable({ emitEvent: false });
            this.ap_NumDocFC.enable({ emitEvent: false });
          })
          .catch(() => {
            this.ap_TipoDocFC.enable({ emitEvent: false });
            this.ap_NumDocFC.enable({ emitEvent: false });
          });
      }
      catch (e) {
        console.error(e);
        this.ap_TipoDocFC.enable({ emitEvent: false });
        this.ap_NumDocFC.enable({ emitEvent: false });
        this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Reniec);
      }
    }
    else if (tipoDoc === CONSTANTES.TipoDocPersona.CARNET_EXTRANJERIA) {
      try {
        const { CarnetExtranjeria } = await this.extranjeriaService.getCE(numDoc).toPromise();
        const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

        this.funcionesMtcService.ocultarCargando();

        if (numRespuesta !== '0000') {
          this.ap_TipoDocFC.enable({ emitEvent: false });
          this.ap_NumDocFC.enable({ emitEvent: false });
          this.funcionesMtcService.mensajeError('Número de documento no registrado en MIGRACIONES');
          return;
        }

        this.funcionesMtcService
          .mensajeConfirmar(`Los datos ingresados fueron validados por MIGRACIONES y corresponden a la persona ${nombres} ${primerApellido} ${segundoApellido}. ¿Está seguro de agregarlo?`)
          .then(() => {
            this.ap_NombresFC.setValue(nombres);
            this.ap_ApPaternoFC.setValue(primerApellido);
            this.ap_ApMaternoFC.setValue(segundoApellido);

            this.ap_TipoDocFC.enable({ emitEvent: false });
            this.ap_NumDocFC.enable({ emitEvent: false });
          })
          .catch(() => {
            this.ap_TipoDocFC.enable({ emitEvent: false });
            this.ap_NumDocFC.enable({ emitEvent: false });
          });
      }
      catch (e) {
        console.error(e);
        this.ap_TipoDocFC.enable({ emitEvent: false });
        this.ap_NumDocFC.enable({ emitEvent: false });
        this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Migraciones);
      }
    }
  }

  async asignarProfesional(btnSubmit: HTMLButtonElement): Promise<void> {
    btnSubmit.disabled = true;

    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de asignar el profesional ingresado para la firma electrónica?')
      .then(async () => {
        const request = {
          tramiteReqId: this.tramiteReqIdSeleccionado,
          profesional: {
            profesionId: this.ap_ProfesionFC.value,
            tipoDoc: this.ap_TipoDocFC.value,
            numDoc: this.ap_NumDocFC.value,
            numColegia: this.ap_NumColegiaFC.value,
            nombres: this.ap_NombresFC.value,
            apPaterno: this.ap_ApPaternoFC.value,
            apMaterno: this.ap_ApMaternoFC.value,
            email: this.ap_EmailFC.value
          }
        } as AsignarProfRequest;

        try {
          const response = await this.profesionalService.postAsignarProfesional(request).toPromise();

          await this.recuperarTramite();

          if (!response.success) {
            btnSubmit.disabled = false;
            this.funcionesMtcService.mensajeError(response.message);
            return;
          }

          this.funcionesMtcService.mensajeOk(response.message).then(() => {
            this.modalService.dismissAll();
          });
        } catch (error) {
          btnSubmit.disabled = false;
          this.funcionesMtcService.mensajeError('Ocurrio un error al intentar asignar el profesional ingresado');
          console.log(error);
        }
      })
      .catch(() => {
        btnSubmit.disabled = false;
      });
  }

  openModalProfAsignado(content, { profAsignado }: Requisito): void {
    if (!profAsignado) {
      this.funcionesMtcService
        .mensajeError('Ocurrio un problema al intentar recuperar la información del profesional asignado, por favor actualice la página');
      return;
    }

    console.log('profAsignado: ', profAsignado);

    this.ap_TipoDocFC.setValue(profAsignado.tipoDoc, { emitEvent: false });
    this.ap_NumDocFC.setValue(profAsignado.numDoc, { emitEvent: false });
    this.ap_NombresFC.setValue(profAsignado.nombres, { emitEvent: false });
    this.ap_ApPaternoFC.setValue(profAsignado.apPaterno, { emitEvent: false });
    this.ap_ApMaternoFC.setValue(profAsignado.apMaterno, { emitEvent: false });
    this.ap_EmailFC.setValue(profAsignado.email, { emitEvent: false });
    this.ap_ProfesionFC.setValue(profAsignado.profesionId.toString(), { emitEvent: false });
    this.ap_NumColegiaFC.setValue(profAsignado.numColegia, { emitEvent: false });

    this.asignarProfFG.disable({ emitEvent: false });

    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  onChangeInputFile(event): void {
    console.log(event);
    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = '';
      this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
      
      return;
    }

    const maxFileSize = 50 * 1024 * 1024; 
    if (event.target.files[0].size > maxFileSize) {
      event.target.value = ''; 
      this.funcionesMtcService.mensajeError('El archivo no puede ser mayor a 50 MB');
    
      return;
    }

    const files: FileList = event.target.files;
     
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];     
        if (!this.archivosSeleccionados.some(existingFile => existingFile.name === file.name)) {        
          this.archivosSeleccionados.push(file);
         
        } else {       
          this.funcionesMtcService.mensajeError('El archivo '+file.name+' ya ha sido agregado.');
          
        }        
      }     
   
      this.archivosSeleccionados = this.archivosSeleccionados;       
      this.solicitudesAdicionales.get('archivos')?.markAsTouched();
      this.solicitudesAdicionales.get('archivos')?.updateValueAndValidity();
      event.target.value = '';       
    }
    
    
    
  }
  
  
  eliminarArchivo(archivo: File): void {
    const index = this.archivosSeleccionados.indexOf(archivo);
    if (index > -1) {
      this.archivosSeleccionados.splice(index, 1);
    }
   
    this.solicitudesAdicionales.get('archivos')?.setValue('');
    this.solicitudesAdicionales.get('archivos')?.updateValueAndValidity();
  }

  obtenerPdf(item): void {

  }

  vistaPreviaPdf() {
    this.funcionesMtcService.mostrarCargando();
    if (this.filePdfGuardado === null && this.filePdfSeleccionado === null) {
      this.funcionesMtcService.ocultarCargando();
      return false;
    }

    this.visorPdfArchivosService.get(this.filePdfGuardado ?? this.filePdfSeleccionado).subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = 'Vista Previa Pdf Adjuntado';
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas al cargar la vista previa');
      }
    );
  }

  convertBase64ToBlob(base64: string): Blob {
    // Eliminar el prefijo si existe (e.g., "data:image/png;base64,")
    // Convertir base64 a un array de bytes
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear un Blob a partir del array de bytes
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Cambia el tipo MIME según el tipo de archivo

    return blob;
  }

  descargarAdjunto(filePathName): void {
    this.funcionesMtcService.mostrarCargando();
    //filePathName = filePathName === '0' ? this.archivoRequisito : filePathName;
    //let razonSocial = '';
    //let numeroDocumento = '';
    //const idCliente = Number(this.seguridadService.getIdCliente());
    const idTramite = Number(localStorage.getItem('tramite-id'));

    let data = { 
      CodMaeSolicitud: idTramite
    };

    this.formularioService.visorPdf(data).subscribe(response => {
      this.funcionesMtcService.ocultarCargando();
      if (response != null) {
        const blob = this.convertBase64ToBlob(response.data.base64Documento);
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
        const urlPdf = URL.createObjectURL(blob);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = 'Vista Previa Plantilla Adjuntada';
      }
    });

    // this.externoService.getDatosTitularRepresentante(idCliente).subscribe(response => {
    //   debugger;
    //   razonSocial = response.Data.DatosTitular.NombreTitular;
    //   numeroDocumento = response.Data.DatosTitular.Ruc;

      
    // });
  }

  adjuntarArchivo(): void {
    this.adjuntarArchivoFile();
  }

  adjuntarArchivoFile(): void {
    if (this.archivosSeleccionados) {
      this.funcionesMtcService.mostrarCargando();
      const formdata = {
        //TramiteId: this.tramiteId,
        //TramiteReqId: this.tramiteReqIdSeleccionado,
        file: this.archivosSeleccionados
      };

      const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(formdata);
      this.tramiteService.postAdjuntar(dataGuardarFormData)
        .subscribe(
          resp => {
            if (resp > 0) {
              this.archivoRequisito = resp;

              let tramiteDocumentario: ArchivosAdjuntos = {
                IdRequisito: this.tramiteReqIdSeleccionado,
                CodigoGenerado: resp,
                NombreDocumento: this.filePdfSeleccionadoNombre
              };
              this.documentosAdjuntos.push(tramiteDocumentario);

              this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el archivo');
            } else {
              this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el archivo');
            }
            this.modalService.dismissAll();
            this.recuperarTramite();
            this.filePdfSeleccionado = null;
          },
          error => {
            this.funcionesMtcService.ocultarCargando()
              .mensajeError('Ocurrió un problema al cargar el archivo. Verifique el tamaño o si está dañado');
          }
        );
    } else {
      this.funcionesMtcService.mensajeError('Seleccione el archivo a adjuntar');
    }
  }
  
 async adjuntarArchivoAdicional(btnSubmit: HTMLButtonElement): Promise<void> {

  if (this.solicitudesAdicionales.valid) {
        /*
    if (this.docDescripcion === '') {
      this.funcionesMtcService.mensajeError('Ingrese la descripción del archivo');
      return;
    }
  */
    if (this.archivosSeleccionados && this.archivosSeleccionados.length > 0) {
      this.funcionesMtcService.mostrarCargando();  
      let archivosAdjuntadosExitosamente = 0;     
      const procesarArchivos = async () => {
        for (let archivo of this.archivosSeleccionados) {
          try {
            const formdata = {           
              Descripcion: this.docDescripcion,
              file: archivo
            };         
            
            const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(formdata);          
           
            const resp = await this.tramiteService.postAdjuntar(dataGuardarFormData).toPromise();
  
            if (resp > 0) {
              
              let tramiteDocumentario: AdjuntarAdicional = {
                IdTramite: this.tramiteId,
                NombreArchivo: archivo.name,  
                NumeroDocumentoRespuesta: resp,
                TipoTramite: this.solicitudesAdicionales.get('tipoComunicacion').value,
                TipoDocumento: this.solicitudesAdicionales.get('tipoDocumentoTramite').value, 
                NumeroDocumento: this.solicitudesAdicionales.get('numeroDocumento').value,
                Descripcion: this.solicitudesAdicionales.get('descripcion').value
              };  
              debugger;            
              await this.tramiteService.postAdjuntarAdicional(tramiteDocumentario).toPromise();
              archivosAdjuntadosExitosamente++;
            } else {
              throw new Error('No se pudo grabar el archivo');
            }
          } catch (error) {
             
            this.funcionesMtcService.mensajeError('Ocurrió un problema al adjuntar el archivo: ' + error.message);
          }
        } 
        
        this.funcionesMtcService.ocultarCargando(); 
        
        if (archivosAdjuntadosExitosamente > 0) {
          //this.funcionesMtcService.mensajeOk(`${archivosAdjuntadosExitosamente} archivo(s) fueron grabados con éxito`);
        } else {
          this.funcionesMtcService.mensajeError('No se pudo grabar ningún archivo');
        }  
        
        this.modalService.dismissAll();
        this.recuperarTramite();
        this.archivosSeleccionados = [];  
        this.filePdfSeleccionado = null;  
      
      };  
      
      procesarArchivos();
      this.enviarTramiteSolicitudes(btnSubmit);
    } else {
      this.funcionesMtcService.mensajeError('Seleccione al menos un archivo para adjuntar');
    }
  }else{
    this.markAllFieldsAsTouched();  
  }
  
  }

  adjuntarArchivoURL(): void {
    console.log('Listo guardar URL Archivo --validar URL');
    this.funcionesMtcService.mostrarCargando();
    const formdata = {
      tramiteid: this.tramiteId,
      tramitereqid: this.tramiteReqIdSeleccionado,
      urladjunto: this.urlArchivo
    };
    console.log(formdata);
    // const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(formdata);

    this.tramiteService.putAdjuntarReq(formdata)
      .subscribe(
        resp => {
          console.log(resp);
          if (resp === 1) {
            this.funcionesMtcService.mensajeOk('Se grabó correctamente la URL');
          } else {
            this.funcionesMtcService.mensajeError('No se grabó la URL');
          }
          this.modalService.dismissAll();
          this.recuperarTramite();
          this.urlArchivo = '';
        },
        error => {
          this.funcionesMtcService.mensajeError('Ocurrio un problema al grabar URL');
        },
        () => this.funcionesMtcService.ocultarCargando()
      );
  }

  async recuperarTramite(): Promise<void> {
 
    this.tupaTramite = new TramiteModel();
    const codigoTupa: string = this.codigoTupaMisTramites === undefined ? JSON.parse(localStorage.getItem('tramite-selected')).codigo : this.codigoTupaMisTramites;
    const IdTramite = Number(localStorage.getItem('tramite-id'));

    try {
      await this.tramiteService.getTramite<ApiResponse<TramiteModel>>(IdTramite, codigoTupa).subscribe(
        async (respuesta: ApiResponse<TramiteModel>) => {
          if (respuesta.success) {
            //console.log('getTramite: ', resp);
            // Parse cada requisito para pasarlo a HTML con salto de linea
            for (let i = 0; i < respuesta.data.requisitos.length; i++) {
              const element = respuesta.data.requisitos[i];

              element.xOrden = element.orden;
              if (i > 0) {
                const ordenAnterior = respuesta.data.requisitos[i - 1].orden;
                if (element.orden === ordenAnterior) {
                  element.xOrden = '';
                }
              }

              /* Pasamos el Tipo de Solicitud seleccionado a los requisitos */
              element.tipoSolicitudTupaCod = (respuesta.data.tipoSolicitud != null ? respuesta.data.tipoSolicitud.codigo : '');
              element.tipoSolicitudTupaDesc = (respuesta.data.tipoSolicitud != null ? respuesta.data.tipoSolicitud.descripcion : '');
              /*  */
              element.descripcion = element.descripcion.replace('\n', '<br/>');
            };

            let existeFormulario = respuesta.data.requisitos.filter(x => x.tieneFormAnexo);
            if (existeFormulario.length > 0) {
              this.tramiteService.getJsonData().subscribe(data => {
                data.IdSolicitud = this.tramiteId;
                this.data = data;
                localStorage.setItem('form-dia', JSON.stringify(data));
              });
            }

            localStorage.setItem('tupa-codigo', respuesta.data.tupaCodigo);
            localStorage.setItem('tupa-nombre', respuesta.data.tupaNombre);
            localStorage.setItem('estudio-id', respuesta.data?.idEstudio?.toString() || "0");   

            this.tupaTramite = respuesta.data;

            //await this.recuperarNotasTramite();
            await this.recuperarTramiteDocs();

            const tramite = localStorage.getItem('tramite-selected');
            const tramiteObj = JSON.parse(tramite);
              tramiteObj.estadoSolicitud = respuesta.data.estado;  
              localStorage.setItem('tramite-selected', JSON.stringify(tramiteObj));        
            


          }
        }
      );

    } catch (error) {
      console.log(error);
    }
  }

  goToBack($myParam: string = ''): void {
    const navigationDetails: string[] = ['/']; // mi ruta
    if ($myParam.length) {
      navigationDetails.push($myParam);
    }

    this.router.navigate(navigationDetails);
  }

  async abrirFormularioAnexo(item: Requisito): Promise<void> {
    this.router.navigate(['formularios-tupa']);
    /*********** BUSCANDO DEPENDENCIA *************/
    // const reqParentId = item.tramiteReqRefId;
    // let dependecia = false;
    // let reqOrden = 0;
    // let reqCompletar = '';
    // for (const req of this.tupaTramite.requisitos) {
    //   if (req.tramiteReqId === reqParentId && req.completo === false) {
    //     dependecia = true;
    //     reqOrden = req.orden;
    //     reqCompletar = req.descripcion;
    //     break;
    //   }
    // }
    // if (dependecia) {
    //   this.funcionesMtcService.mensajeError(`Complete el requisito ${reqOrden}: ${truncateString(reqCompletar, 50)}`);
    //   return;
    // }

    // const componente = await this.loadComponentService.getComponent(item.codigoFormAnexo.trim());

    // if (item.requiereFirma && item.profAsigId) {
    //   this.funcionesMtcService
    //     .mensajeWarnConfirmar(`Este requisito requiere firma electrónica y deberá volver
    //     a asignar un profesional para su completado. ¿Está seguro de modificar el formulario electrónico?`)
    //     .then(() => {
    //       const modalRef = this.modalService.open(componente, { size: 'lg', scrollable: true, windowClass: 'customModal' });
    //       modalRef.componentInstance.dataInput = item;
    //       modalRef.componentInstance.dataRequisitosInput = this.tupaTramite.requisitos;
    //       modalRef.componentInstance.dataTipoSolicitud = this.tupaTramite.tipoSolicitud;
    //       console.log('TIPO SOLICITUD ENVIADO: ', this.tupaTramite.tipoSolicitud?.codigo);

    //       modalRef.result.then(result => {
    //         if (result === true) {
    //           this.recuperarTramite();
    //         }
    //       });
    //     });
    // }
    // else {
    //   const modalRef = this.modalService.open(componente, { size: 'lg', scrollable: true, windowClass: 'customModal' });
    //   modalRef.componentInstance.dataInput = item;
    //   modalRef.componentInstance.dataRequisitosInput = this.tupaTramite.requisitos;
    //   modalRef.componentInstance.dataTipoSolicitud = this.tupaTramite.tipoSolicitud;
    //   console.log('TIPO SOLICITUD ENVIADO: ', this.tupaTramite.tipoSolicitud?.codigo);

    //   modalRef.result.then(result => {
    //     if (result === true) {
    //       this.recuperarTramite();
    //     }
    //   });
    // }
  }

  // xOrden(orden: number): string | number {
  //   if (this.orden !== orden) {
  //     this.orden = orden;
  //     this.secuencia.push(orden);

  //     const result = this.secuencia.filter((item, index) => {
  //       return this.secuencia.indexOf(item) === index;
  //     });
  //     this.secuencia = result;
  //     return result.indexOf(orden) + 1;
  //   } else {
  //     if (orden === 1 && this.secuencia.length === 1) {
  //       return '1';
  //     } else {
  //       return '';
  //     }
  //   }
  // }

  eliminarDocumento(tramiteReqId: number, idFile: string): void {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el documento adjunto? \n`)
      .then(() => {
        console.log('Eliminar documento de requerimiento: ' + tramiteReqId);
        this.archivoRequisito = 0;
        this.modalService.dismissAll();
        this.funcionesMtcService.ocultarCargando();


        // this.funcionesMtcService.mostrarCargando();
        // this.tramiteService.putEliminarDoc(tramiteReqId, idFile)
        //   .subscribe(
        //     resp => {
        //       if (resp === 1) {
        //         this.recuperarTramite();
        //         // this.funcionesMtcService.mensajeOk("Se anuló el expediente "+item.numExpdiente);
        //       } else {
        //         this.funcionesMtcService.mensajeError('No se eliminó el documento adjunto');
        //       }
        //       this.modalService.dismissAll();
        //     },
        //     error => {
        //       this.funcionesMtcService.mensajeError('Ocurrió un problema tratar de eliminar el documento adjunto');
        //     },
        //     () => this.funcionesMtcService.ocultarCargando()
        //   );

      });
  }

  eliminarDocAdicional(docId: number): void {
    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de eliminar el documento adjunto? \n`)
      .then(() => {
        this.funcionesMtcService.mostrarCargando();
        this.tramiteService.putEliminarDocAdicional(docId)
          .subscribe(
            resp => {
              if (resp.data > 0) {
                this.recuperarTramite();
              } else {
                this.funcionesMtcService.mensajeError('No se eliminó el documento adjunto');
              }
              this.modalService.dismissAll();
            },
            error => {
              this.funcionesMtcService.mensajeError('Ocurrió un problema tratar de eliminar el documento adjunto');
            },
            () => this.funcionesMtcService.ocultarCargando()
          );

      });
  }

  async recuperarNotasTramite(): Promise<void> {
    this.tramiteService.getObtenerNotas(this.tupaTramite.tupaId).subscribe((resp: any) => {
      //console.log(JSON.stringify(resp, null, 10));
      this.listadoNotas = resp.data;
      this.notas = resp.data.length;
    });
  }

  async recuperarTramiteDocs(): Promise<void> {
    this.tramiteService.getObtenerDocumentos(this.tramiteId).subscribe((resp: any) => {
      //console.log(JSON.stringify(resp, null, 10));
      console.log('resp.data::',resp.data);
      if (resp.success) {
        this.listadoDocumentos = resp.data;
        this.documentos = resp.data.length;
      }
    });
  }

  verDocumentoPdf(documento): void {
    this.visorPdfArchivosService.get(documento)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = 'Vista de la atención del Expediente [ ' + this.numExpediente + ' ]';
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  verDocumentoPdfURL(url): void {
    this.visorPdfArchivosService.getFromURL(url)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = 'Vista previa';
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  close() {
    //this.router.navigate(['tramite-iniciar']);
    this.goBack();
  }

  goBack(): void {
    const lastPage = this.globalService.getLastPage(); // Obtiene la última página visitada
    if (lastPage) {
      this.router.navigate([lastPage]); // Navega a la última página registrada
    } else {
      this.router.navigate(['/']); // Si no hay registro, navega al inicio
    }
  }

  toggleVisibilityTramite(){
    this.isVisibleTramite = !this.isVisibleTramite;
  }

  comboTipoComunicacion() {
    this.tramiteService.getObtenerTipoComunicacion().subscribe((resp: any) => {
      if (resp.success) {
        this.listaTipoComunicacion = resp.data; 
        console.log('this.listaTipoComunicacion::', this.listaTipoComunicacion);
      }
    });

  }

  comboTipoDocumento() {
    this.tramiteService.getObtenerTipoDocumento().subscribe((resp: any) => {
      if (resp.success) {
        this.listaTipoDocumento = resp.data; 
        console.log('this.listaTipoDocumento::', this.listaTipoDocumento);
      }
    });

  }

  validarAlfanumerico(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    const regex = /^[a-zA-Z0-9\sN°-]*$/;  
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault(); 
    }
  }

  async enviarTramiteSolicitudes(btnSubmit: HTMLButtonElement): Promise<void> {
    btnSubmit.disabled = true;
    // Comprobando obligatoriedad de requisitos
    let pagosAdicionales = 0;
    const pagosRealizados = 0;

    /******** RUC EXONERADO (IRTV) *******/
    const rucexo = '20338915471';
    const currentRUC = this.seguridadService.getCompanyCode();
    let exonerado = false;
    if (rucexo === currentRUC) { exonerado = true; }

    /** Comentado temporalmente**/
    // for (const requisito of this.tupaTramite.requisitos) {
    //   // Revisando pagos
    //   pagosAdicionales = pagosAdicionales + Number(requisito.pagosAdicionales);

    //   if (requisito.obligatorio && !requisito.completo && !exonerado) {
    //     this.funcionesMtcService.mensajeError(`Complete el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     btnSubmit.disabled = false;
    //     return;
    //   }

    //   if (requisito.obligatorio && requisito.requiereFirma && !requisito.firmado) {
    //     if (requisito.profAsigId) {
    //       this.funcionesMtcService.mensajeError(`El profesional asignado aún no ha completado la firma electrónica en el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     }
    //     else {
    //       this.funcionesMtcService.mensajeError(`Se requiere la firma de un profesional en el requisito ${requisito.orden}: ${truncateString(requisito.descripcion, 50)}`);
    //     }
    //     btnSubmit.disabled = false;
    //     return;
    //   }
    // }

    /** Comentado temporalmente**/

    this.funcionesMtcService.mostrarCargando();
    /**Comentado para avance **/
    // if (!this.tupaTramite.esGratuito && !exonerado) {
    //   // Verificando pago
    //   this.tramiteService.putVerificarPago(this.tramiteId).subscribe(
    //     response => {
    //       console.log(response);
    //       if (response === 1) {
    //         this.funcionesMtcService.ocultarCargando();
    //         this.funcionesMtcService.mensajeError('El voucher de pago ya ha sido utilizado en otra transacción. Contáctese con Atencion al Ciudadano').then(() => {
    //           this.router.navigate(['tramite-iniciado']);
    //           return;
    //         });
    //       }
    //     },
    //     error => {
    //       this.funcionesMtcService.mensajeError('No se pudo comprobar el pago');
    //       this.funcionesMtcService.ocultarCargando();
    //       this.router.navigate(['tramite-iniciado']);
    //       return;
    //     }
    //   );
    // }
    /**Comentado para avance **/

    /**Comentado para avance **/
    // COMPROBANDO SI ESTA OBSERVADO
    // if (this.tupaTramite.estado.toString() === 'OBSERVADO') {
    //   // Enviando trámite
    //   try {
    //     this.funcionesMtcService.mostrarCargando();
    //     const response = await this.tramiteService.putSubsanar<ResponseComunModel<string>>(this.tramiteId).toPromise();
    //     console.log(response);

    //     if (!response.success) {
    //       this.funcionesMtcService.ocultarCargando();
    //       this.funcionesMtcService.mensajeError(response.message)
    //         .then(() => {
    //           this.router.navigate(['/mis-tramites']);
    //         });
    //     }
    //     else {
    //       let mensaje = `La subsanación fue enviada exitosamente.\n `;
    //       if (this.numExpediente.substring(0, 1) === 'T') {
    //         mensaje = mensaje + `Utilice sus credenciales para hacer el seguimiento en https://sdt.mtc.gob.pe/`;
    //       }
    //       this.funcionesMtcService.ocultarCargando();
    //       this.funcionesMtcService.mensajeOk(mensaje)
    //         .then(() => {
    //           this.router.navigate(['/mis-tramites']);
    //         });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
    //     this.funcionesMtcService.ocultarCargando();
    //   }
    // } else {
    /**Comentado para avance **/


    // Enviando trámite
    try {
      //Generar Expediente
      const data = {
        ClienteId: this.seguridadService.getIdCliente() ?? 1,
        AsuntoDocId: 2,
        TipoDocumentoId: 35,
        GestorOficinaId: '0266',
        PersonaCodigo: '011423',
        AsuntoDescripcion: 'DECLARACION ANUAL CONSOLIDADA ',
        NumeroDocumento: null,
        Observacion: 'REMISION DE DAC VIA WEB',
        TupaFlag: '0',
        TupaId: 0,
        TupaConceptoId: 1,
        EstadoPagoFlag: 'C',
        PagoTupa: null,
        ImporteTupa: null,
        CongresoFlag: 'N',
        CopiaInfFlag: 'N',
        AnexoPrincipalCodigo: null,
        RequisitoCompletoFlag: '1',
        UsuarioIngreso: 'WEB',
        CantidadFolio: 0,
        SubsanacionFlag: '0',
        VVFlag: '0',
        WebFlag: '1',
        PrioridadFlag: '0'
      }

      const expediente = await this.externoService.postExpedienteTramite(data).toPromise();

      

      const envio: EnviarTramiteAdicionalModel = {
        IdSolicitud: this.tramiteId,
        Documentos: this.documentosAdjuntos,
        NroExpediente: expediente.data,
        TipoComunicacion: this.solicitudesAdicionales.get('tipoComunicacion').value,
      };
      // this.envioSolicitud.IdSolicitud = this.tramiteId;
      // this.envioSolicitud.Documentos = this.documentosAdjuntos;

      this.funcionesMtcService.mostrarCargando();
      //const response = await this.tramiteService.putEnviar<ApiResponse<EnviarSolicitudModel>>(this.tramiteId).toPromise();
      const response = await this.tramiteService.putEnviarSolicitudes<ApiResponse<any>>(envio).toPromise();
      console.log("response", response);


      
      //this.solicitudesAdicionales.get('tipoComunicacion').setValue(0);
      //this.solicitudesAdicionales.get('tipoDocumentoTramite').setValue(0);
      //this.solicitudesAdicionales.get('numeroDocumento').setValue('');
      //this.solicitudesAdicionales.get('descripcion').setValue('');

      
      if (!response.success) {
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError(response.message)
          .then(() => {
            this.router.navigate(['/mis-tramites']);
          });
      }
      else {
 
        this.funcionesMtcService.ocultarCargando();
        const result = response.data;        
        const titulo = `<b>Trámite enviado</b><br>`;
        let html = `Estimado usuario.<br>Su trámite fue enviado exitosamente.<br><b>Nro de solicitud: ${expediente.data}</b>`;
                    
        if (result)
          //html += `<br>Utilice la siguiente clave <b>${'T_T_Clave$Prueba'}</b> para hacer el seguimiento en https://extranet.minem.gob.pe/`;
          html += `<br>Puede realizar el seguimiento en https://extranet.minem.gob.pe/`;
        //html += `<br>Utilice la siguiente clave <b>${result.ClaveAcceso}</b> para hacer el seguimiento en https://extranet.minem.gob.pe/`;

        // if(this.idEncuestaConfig !== null){
        //   html += `<br><br><b class="text-success">¡Queremos seguir mejorando!</b><br><br>Nos gustaría que nos cuentes tu experiencia a través una breve encuesta.<br><b>No tomará más de un minuto.</b>`;

        //   this.funcionesMtcService.ocultarCargando();
        //   this.funcionesMtcService.mensajeOkEncuesta(titulo, null , html, "Ir a Encuesta")
        //     .then(() => {
        //       this.funcionesMtcService.mostrarCargando();
        //       this.encuestaService.generarEncuesta(this.tramiteId, this.idEncuestaConfig)
        //       .subscribe((result: any) => {
        //         this.funcionesMtcService.ocultarCargando();
        //         this.router.navigate(['encuesta/form', result.idEncuesta, result.codigoIdentificador]);
        //       }, (error) => {
        //         this.funcionesMtcService.ocultarCargando();
        //         this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
        //       })
        //     });
        // }else{
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeOkEncuesta(titulo, null, html)
          .then(() => {
            this.router.navigate(['/mis-tramites']);
          });


        // });        
        //}
      }
    } catch (error) {
      console.log(error);
      this.funcionesMtcService.mensajeError('No se pudo finalizar el trámite');
      this.funcionesMtcService.ocultarCargando();
    }
    //}

    btnSubmit.disabled = false;
  }

  get errorTipoComunicacion() {
    return this.solicitudesAdicionales.get('tipoComunicacion');
  } 

  tipoComunicacionValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '0' ? { invalidSelection: true } : null;
  }

  get errorTipoDocumentoTramite() {
    return this.solicitudesAdicionales.get('tipoDocumentoTramite');
  }

  tipoDocumentoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === '0' ? { invalidSelection: true } : null;
  }

  get errorNumeroDocumento() {
    return this.solicitudesAdicionales.get('numeroDocumento');
  } 
  get errorDescripcion() {
    return this.solicitudesAdicionales.get('descripcion');
  } 

  get errorArchivo() {
    return this.solicitudesAdicionales.get('archivos');
  }

  archivoValidator(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value.length > 0 ? null : { noFileSelected: true };
  }
  private markAllFieldsAsTouched(): void {
    Object.keys(this.solicitudesAdicionales.controls).forEach(controlName => {
      const control = this.solicitudesAdicionales.get(controlName);
      if (control && !control.touched) {
        control.markAsTouched();
      }
    });
  }

  ver(){
    if (this.denominacionEstado !== 'FINALIZADO' && 
      this.denominacionEstado !== 'APROBADO'&& 
      this.denominacionEstado !== 'DESAPROBADO'&& 
      this.denominacionEstado !== 'DESISTIDO'&& 
      this.denominacionEstado !== 'ABANDONO') {
    return true;
    }
    return false;
  }
 
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }
}
