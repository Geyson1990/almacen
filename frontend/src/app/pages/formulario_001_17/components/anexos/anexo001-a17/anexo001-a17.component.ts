import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo001A17Service } from 'src/app/core/services/anexos/anexo001-a17.service';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { Anexo001_A17Request } from 'src/app/core/models/Anexos/Anexo001_A17/Anexo001_A17Request';
import { A001_A17_Seccion1, A001_A17_Seccion2, A001_A17_Seccion3, A001_A17_Seccion4 } from 'src/app/core/models/Anexos/Anexo001_A17/Secciones';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { Anexo001_A17Response } from 'src/app/core/models/Anexos/Anexo001_A17/Anexo001_A17Response';
import { MetaData } from 'src/app/core/models/Anexos/Anexo001_A17/MetaData';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { CompletarReqRequestModel } from 'src/app/core/models/Tramite/CompletarReqRequest';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
  selector: 'app-anexo001-a17',
  templateUrl: './anexo001-a17.component.html',
  styleUrls: ['./anexo001-a17.component.css'],
})
export class Anexo001A17Component implements OnInit {

  @Input() public dataInput: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  indexEditTabla: number = -1;
  disabledAcordion: number = 2;

  listaPaises: PaisResponse[] = [];
  listaPasoFrontera: SelectionModel[] = [];

  anexoFormulario: UntypedFormGroup;
  visibleButtonCarf: boolean = false;

  listaFlotaVehicular: A001_A17_Seccion4[] = [];

  fechaMinimaSalida: Date = (new Date()).addDays(1);
  fechaMinimaLlegada: Date = (new Date()).addDays(2);

  filePdfCroquisSeleccionado: any = null;
  filePdfCroquisPathName: string = null;

  filePdfPolizaSeleccionado: any = null;
  filePdfPolizaPathName: string = null;

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  paSeccion1: string[]=["DSTT-009"];
  paSeccion2: string[]=["DSTT-015"];
  paSeccion3: string[]=[];
  paSeccion4: string[]=["DSTT-009","DSTT-015"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;
  habilitarSeccion4:boolean=true;
  // este anexo solo lo usan los PA DSTT-009 y DSTT-015
  paTipoServicio = [
    {"pa":"DSTT-009","tipoServicio":"15"},
    {"pa":"DSTT-009","tipoServicio":"22"},
    {"pa":"DSTT-015","tipoServicio":"15"},
    {"pa":"DSTT-015","tipoServicio":"20"}
   ];
  tipoServicio: string="";

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001A17Service,
    private paisService: PaisService,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    //==================================================================================
    //RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    //==================================================================================
    if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion2.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion2=true; else this.habilitarSeccion2=false;
    if(this.paSeccion3.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion3=true; else this.habilitarSeccion3=false;
    if(this.paSeccion4.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion4=true; else this.habilitarSeccion4=false;

    this.uriArchivo = this.dataInput.rutaDocumento;

    this.listaPasoFrontera.push({ value: 1, text: "Desaguadero" });
    this.listaPasoFrontera.push({ value: 2, text: "Santa Rosa" });

    //if (this.dataInput.tipoSolicitud.codigo === 3) {//SOLO TRANSPORTE PERSONAL
      this.listaPasoFrontera.push({ value: 3, text: "Kasani" });
    //}

    this.listaPasoFrontera.push({ value: 4, text: "Iñapari" });
  
    this.anexoFormulario = this.fb.group({
      s1_paisesOperar: this.fb.array([], this.paisesOperarValidator()),
      s1_destino: this.fb.control('', [Validators.required]),
      s1_ciudadesOperar: this.fb.control('', [Validators.required]),
      s1_paisesTransito: this.fb.array([], this.paisesOperarValidator()),
      s1_frecuencia: this.fb.control('', [Validators.required]),
      s1_numeroFrecuencia: this.fb.control('', [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
      s1_horarioSalida: this.fb.control('', [Validators.required]),
      s1_tiempoPromedioViaje: this.fb.control('', [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
      s2_destino: this.fb.control(''),
      s2_puntosIntermedios: this.fb.control(''),
      s2_pasoFronteraIda: this.fb.control(''),
      s2_pasoFronteraRegreso: this.fb.control(''),
      s2_fechaSalida: this.fb.control(null),
      s2_fechaLlegada: this.fb.control(null),

      s3_flota: [''],

      placaRodajeForm: this.fb.control(''),
      soatForm: this.fb.control(''),
      citvForm: this.fb.control(''),
      cafForm: this.fb.control(false),
    });

    this.recuperarPaises();

    setTimeout(() => {
      if(this.habilitarSeccion1===true){
        this.acc.expand('anexo001-a17-seccion-1');
      }else{
        this.acc.collapse('anexo001-a17-seccion-1');
        document.querySelector('button[aria-controls=anexo001-a17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion2===true){
        this.acc.expand('anexo001-a17-seccion-2');
      }else{
        this.acc.collapse('anexo001-a17-seccion-2');
        document.querySelector('button[aria-controls=anexo001-a17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('anexo001-a17-seccion-3');
      }else{
        this.acc.collapse('anexo001-a17-seccion-3');
        document.querySelector('button[aria-controls=anexo001-a17-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion4===true){
        this.acc.expand('anexo001-a17-seccion-4');
      }else{
        this.acc.collapse('anexo001-a17-seccion-4');
        document.querySelector('button[aria-controls=anexo001-a17-seccion-4]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }
    });
  }


  onChangePermiso(seccion1: string, seccion2: string, valor: number) {
    this.acc.collapse(seccion2);
    this.disabledAcordion = valor;

    const s1_paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'];
    const s1_destino = this.anexoFormulario.controls['s1_destino'];
    const s1_ciudadesOperar = this.anexoFormulario.controls['s1_ciudadesOperar'];
    const s1_paisesTransito = this.anexoFormulario.controls['s1_paisesTransito'];
    const s1_frecuencia = this.anexoFormulario.controls['s1_frecuencia'];
    const s1_numeroFrecuencia = this.anexoFormulario.controls['s1_numeroFrecuencia'];
    const s1_horarioSalida = this.anexoFormulario.controls['s1_horarioSalida'];
    const s1_tiempoPromedioViaje = this.anexoFormulario.controls['s1_tiempoPromedioViaje'];
    const s2_destino = this.anexoFormulario.controls['s2_destino'];
    const s2_puntosIntermedios = this.anexoFormulario.controls['s2_puntosIntermedios'];
    const s2_pasoFronteraIda = this.anexoFormulario.controls['s2_pasoFronteraIda'];
    const s2_pasoFronteraRegreso = this.anexoFormulario.controls['s2_pasoFronteraRegreso'];
    const s2_fechaSalida = this.anexoFormulario.controls['s2_fechaSalida'];
    const s2_fechaLlegada = this.anexoFormulario.controls['s2_fechaLlegada'];

    if (this.habilitarSeccion1) {

      document.querySelector('button[aria-controls=anexo001-a17-seccion-1]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
      document.querySelector('button[aria-controls=anexo001-a17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');

      //seccion1 activa:
      s2_destino.setValidators(null);
      s2_puntosIntermedios.setValidators(null);
      s2_pasoFronteraIda.setValidators(null);
      s2_pasoFronteraRegreso.setValidators(null);
      s2_fechaSalida.setValidators(null);
      s2_fechaLlegada.setValidators(null);

      s1_paisesOperar.setValidators(this.paisesOperarValidator());
      s1_destino.setValidators([Validators.required]);
      s1_ciudadesOperar.setValidators([Validators.required]);
      s1_paisesTransito.setValidators([Validators.required]);
      s1_frecuencia.setValidators([Validators.required]);
      s1_numeroFrecuencia.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
      s1_horarioSalida.setValidators([Validators.required]);
      s1_tiempoPromedioViaje.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
    } 

    if (this.habilitarSeccion2){

      document.querySelector('button[aria-controls=anexo001-a17-seccion-2]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
      document.querySelector('button[aria-controls=anexo001-a17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');

      s1_paisesOperar.setValidators(null);
      s1_destino.setValidators(null);
      s1_ciudadesOperar.setValidators(null);
      s1_paisesTransito.setValidators(null);
      s1_frecuencia.setValidators(null);
      s1_numeroFrecuencia.setValidators(null);
      s1_horarioSalida.setValidators(null);
      s1_tiempoPromedioViaje.setValidators(null);

      s2_destino.setValidators([Validators.required]);
      s2_puntosIntermedios.setValidators([Validators.required]);
      s2_pasoFronteraIda.setValidators([Validators.required]);
      s2_pasoFronteraRegreso.setValidators([Validators.required]);
      s2_fechaSalida.setValidators([Validators.required]);
      s2_fechaLlegada.setValidators([Validators.required]);
    }

    s1_paisesOperar.updateValueAndValidity();
    s1_destino.updateValueAndValidity();
    s1_ciudadesOperar.updateValueAndValidity();
    s1_paisesTransito.updateValueAndValidity();
    s1_frecuencia.updateValueAndValidity();
    s1_numeroFrecuencia.updateValueAndValidity();
    s1_horarioSalida.updateValueAndValidity();
    s1_tiempoPromedioViaje.updateValueAndValidity();
    s2_destino.updateValueAndValidity();
    s2_puntosIntermedios.updateValueAndValidity();
    s2_pasoFronteraIda.updateValueAndValidity();
    s2_pasoFronteraRegreso.updateValueAndValidity();
    s2_fechaSalida.updateValueAndValidity();
    s2_fechaLlegada.updateValueAndValidity();

    setTimeout(() => {
      this.acc.expand(seccion1);
    }, 200);
  }

  changeNumeroFrecuencia(event, inputFrecuencia, controlForm) {
    if (event.target.value === '') {
      inputFrecuencia.disabled = true;
      controlForm.setValue('');
      controlForm.setErrors(null);
    } else {
      inputFrecuencia.disabled = false;
      inputFrecuencia.focus();
    }
  }

  onChangeInputCroquis(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfCroquisSeleccionado = event.target.files[0];
    event.target.value = "";
    this.filePdfCroquisPathName = null;
  }

  onChangeInputPoliza(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfPolizaSeleccionado = event.target.files[0];
    event.target.value = "";
    this.filePdfPolizaPathName = null;
  }

  vistaPreviaPdfCroquis() {
    if (this.filePdfCroquisPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfCroquisPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCroquisSeleccionado = file;
          this.filePdfCroquisPathName = null;

          this.visualizarDialogoPdfCroquis();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarDialogoPdfCroquis();
    }
  };

  visualizarDialogoPdfCroquis() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfCroquisSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Croquis";
  }

  vistaPreviaPdfPoliza() {
    if (this.filePdfPolizaPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfPolizaPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfPolizaSeleccionado = file;
          this.filePdfPolizaPathName = null;

          this.visualizarDialogoPdfPoliza();
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarDialogoPdfPoliza();
    }
  };

  visualizarDialogoPdfPoliza() {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(this.filePdfPolizaSeleccionado);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Póliza de Seguro";
  }

  vistaPreviaCaf() {
    if (this.filePdfCafPathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(this.filePdfCafPathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          this.filePdfCafSeleccionado = <File>file;
          this.filePdfCafPathName = null;

          this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexoFormulario.get("placaRodajeForm").value);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(this.filePdfCafSeleccionado, this.anexoFormulario.get("placaRodajeForm").value);
    }
  }

  onChangeInputCaf(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    const msg = ValidateFileSize_Formulario(event.target.files[0], 'Debe adjuntarlo como documento adicional');
    if(msg !== 'ok') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError(msg);
    }

    this.filePdfCafSeleccionado = event.target.files[0];
    this.filePdfCafPathName = null;
    event.target.value = "";
  }

  onChangeCaf(event: boolean) {
    this.visibleButtonCarf = event;

    if (this.visibleButtonCarf === true) {
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCarf = false;
        //this.cafForm = false;
        this.anexoFormulario.controls['cafForm'].setValue(false);
      });
    } else {
      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
    }
  }

  paisesOperarValidator() {
    return (formArray: UntypedFormArray) => {
      let valid: boolean = false;
      formArray.value.forEach((item) => {
        if (item.checked === true)
          valid = item.checked;
      });
      return valid ? null : { error: "Sin checked" };
    };
  }

  formInvalid(control: string) {
    return this.anexoFormulario.get(control).invalid &&
      (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
  }

  recuperarPaises() {

    this.funcionesMtcService.mostrarCargando();

    this.paisService.get<PaisResponse[]>('ARG,BOL,BRA,CHL,PRY,URY')
      .subscribe(
        data => {
          this.funcionesMtcService.ocultarCargando();

          this.listaPaises = data;

          this.listaPaises.map((item, index) => {
            item.text = item.text.capitalize();
            (this.anexoFormulario.get('s1_paisesOperar') as UntypedFormArray).push(this.fb.group({ checked: false, ...item }));
            (this.anexoFormulario.get('s1_paisesTransito') as UntypedFormArray).push(this.fb.group({ checked: false, ...item }));
          });

          if (this.dataInput.movId > 0) {
            //RECUPERAMOS LOS DATOS
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_A17Response) => {
                const metaData: any = JSON.parse(dataAnexo.metaData);

                this.idAnexo = dataAnexo.anexoId;

                let i = 0;

                //if (this.dataInput.tipoSolicitud.codigo === 1) 
                if (this.habilitarSeccion1){
                  //PERMISO ORIGINARIO
                  metaData.seccion1.paisesJson = {}

                  for (i; i < metaData.seccion1.paisesOperar.length; i++) {
                    metaData.seccion1.paisesJson[metaData.seccion1.paisesOperar[i].value] = metaData.seccion1.paisesOperar[i];
                  }

                  i = 0;
                  for (let control of this.anexoFormulario.controls["s1_paisesOperar"].value) {
                    if (metaData.seccion1.paisesJson[control.value]) {
                      this.anexoFormulario.get("s1_paisesOperar")["controls"][i]['controls']['checked'].setValue(metaData.seccion1.paisesJson[control.value].checked);
                    }
                    if (metaData.seccion1.paisesTransito.indexOf(control.text) !== -1) {
                      this.anexoFormulario.get("s1_paisesTransito")["controls"][i]['controls']['checked'].setValue(true);
                    }
                    i++;
                  }

                  this.anexoFormulario.get("s1_destino").setValue(metaData.seccion1.destino.Value);
                  this.anexoFormulario.get("s1_ciudadesOperar").setValue(metaData.seccion1.ciudadesOperar);
                  this.anexoFormulario.get("s1_frecuencia").setValue(metaData.seccion1.numeroFrecuencias.split('-')[0].trim());
                  this.anexoFormulario.get("s1_numeroFrecuencia").setValue(metaData.seccion1.numeroFrecuencias.split('-')[1].trim());
                  this.anexoFormulario.get("s1_horarioSalida").setValue(metaData.seccion1.horariosSalida);
                  this.anexoFormulario.get("s1_tiempoPromedioViaje").setValue(metaData.seccion1.tiempoPromedioViaje);

                  this.filePdfCroquisPathName = metaData.seccion1.pathName;

                } else {
                  //PERMISO OCASIONAL
                  this.anexoFormulario.get("s2_destino").setValue(metaData.seccion2.destino.Value);
                  this.anexoFormulario.get("s2_puntosIntermedios").setValue(metaData.seccion2.puntosIntermedios);
                  this.anexoFormulario.get("s2_pasoFronteraIda").setValue(metaData.seccion2.pasoFronteraIda.Value);
                  this.anexoFormulario.get("s2_pasoFronteraRegreso").setValue(metaData.seccion2.pasoFronteraRegreso.Value);
                  this.anexoFormulario.get("s2_fechaSalida").setValue(new Date(metaData.seccion2.fechaSalida));
                  this.anexoFormulario.get("s2_fechaLlegada").setValue(new Date(metaData.seccion2.fechaLlegada));

                  this.filePdfPolizaPathName = metaData.seccion2.pathName;
                }

                this.anexoFormulario.get("s3_flota").setValue(metaData.seccion3.flotaAlta === true ? '1' : '2');

                for (i = 0; i < metaData.seccion4.length; i++) {
                  this.listaFlotaVehicular.push({
                    placaRodaje: metaData.seccion4[i].placaRodaje,
                    soat: metaData.seccion4[i].soat,
                    citv: metaData.seccion4[i].citv,
                    caf: metaData.seccion4[i].caf === true || metaData.seccion4[i].caf === 'true' ? true : false,
                    pathName: metaData.seccion4[i].pathName,
                    file: null
                  });
                }
              },
              error => {
                //this.errorAlCargarData = true;
                this.funcionesMtcService
                  .ocultarCargando()
                //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
              });
          }
        },
        error => {
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para cargar paises');
        }
      );

    // this.listaPaises.push(
    //   { value: "13", text: 'Argentina' } as PaisResponse,
    //   { value: "29", text: 'Bolivia' } as PaisResponse,
    //   { value: "33", text: 'Brasil' } as PaisResponse,
    //   { value: "46", text: 'Chile' } as PaisResponse,
    //   { value: "172", text: 'Paraguay' } as PaisResponse,
    //   { value: "229", text: 'Uruguay' } as PaisResponse
    // );


  }

  changePlacaRodaje() {
    this.anexoFormulario.controls['soatForm'].setValue('');
    this.anexoFormulario.controls['citvForm'].setValue('');
  }

  buscarPlacaRodaje() {
    const placaRodaje = this.anexoFormulario.controls['placaRodajeForm'].value.trim();
    if (placaRodaje.length !== 6)
      return;

    this.changePlacaRodaje();

    this.funcionesMtcService.mostrarCargando();

    this.vehiculoService.getPlacaRodaje(placaRodaje).subscribe(
      respuesta => {
        this.funcionesMtcService.ocultarCargando();
        
        if(respuesta.categoria==="" || respuesta.categoria==="-"){
          return this.funcionesMtcService.mensajeError('La placa de rodaje no tiene categoría definida.');
        }else{
          if(respuesta.categoria.charAt(0)=="O")
            this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '-');
          
          if(respuesta.categoria.charAt(0)=="N" || respuesta.categoria.charAt(0)=="M"){
              if (respuesta.soat.estado === '')
                return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
              else 
                if (respuesta.soat.estado !== 'VIGENTE')
                return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
                
                this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero);
          }
        }

        let band:boolean = false;
        let placaNumero:string = "";
        if(respuesta.citvs.length>0){
          for (let placa of respuesta.citvs){
            if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoServicio==placa.tipoId)!=undefined){
              placaNumero=placa.numero;
              band=true;
            }
          }
          if(!band)
            return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
          else
            this.anexoFormulario.controls['citvForm'].setValue(placaNumero || '(FALTANTE)');
        }else{
          if(respuesta.nuevo){
            this.anexoFormulario.controls['citvForm'].setValue(placaNumero || '-');                   
          }else{
            return this.funcionesMtcService.mensajeError('La placa no cuenta con CITV');     
          }
        }
       
       /*
        if (respuesta.soat.estado === '')
          return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
        if (respuesta.soat.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
        if (respuesta.citv.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
        // if (respuesta.citv.tipoId != '22')
        //   return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoServicio==respuesta.citv.tipoId)==undefined){
          return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        }
        this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '(FALTA)');
        this.anexoFormulario.controls['citvForm'].setValue(respuesta.citv.numero || '(FALTA)');*/
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }

  cancelarFlotaVehicular() {
    this.indexEditTabla = -1;

    this.anexoFormulario.controls['placaRodajeForm'].setValue('');
    this.anexoFormulario.controls['soatForm'].setValue('');
    this.anexoFormulario.controls['citvForm'].setValue('');
    this.anexoFormulario.controls['cafForm'].setValue(false);

    this.filePdfCafSeleccionado = null;
    this.filePdfCafPathName = null;
    this.visibleButtonCarf = false;
  }

  agregarFlotaVehicular() {

    if (
      this.anexoFormulario.controls['placaRodajeForm'].value.trim() === '' ||
      this.anexoFormulario.controls['soatForm'].value.trim() === '' ||
      this.anexoFormulario.controls['citvForm'].value.trim() === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    if (this.anexoFormulario.controls['cafForm'].value === true && (!this.filePdfCafSeleccionado && !this.filePdfCafPathName))
      return this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');

    const placaRodaje = this.anexoFormulario.controls['placaRodajeForm'].value.trim().toUpperCase();
    const indexFind = this.listaFlotaVehicular.findIndex(item => item.placaRodaje === placaRodaje);

    //Validamos que la placa de rodaje no esté incluida en la grilla
    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El vehículo ya se encuentra registrado');
    }

    if (this.indexEditTabla === -1) {
      this.listaFlotaVehicular.push({
        placaRodaje: placaRodaje,
        soat: this.anexoFormulario.controls['soatForm'].value,
        citv: this.anexoFormulario.controls['citvForm'].value,
        caf: this.anexoFormulario.controls['cafForm'].value,
        file: this.filePdfCafSeleccionado
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
    }

    this.cancelarFlotaVehicular();
  }

  modificarFlotaVehicular(item: A001_A17_Seccion4, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['placaRodajeForm'].setValue(item.placaRodaje);
    this.anexoFormulario.controls['soatForm'].setValue(item.soat);
    this.anexoFormulario.controls['citvForm'].setValue(item.citv);

    this.anexoFormulario.controls['cafForm'].setValue(item.caf);
    this.visibleButtonCarf = item.caf;

    this.filePdfCafSeleccionado = item.file;
    this.filePdfCafPathName = item.pathName;
  }

  eliminarFlotaVehicular(item: A001_A17_Seccion4, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  verPdfCafGrilla(item: A001_A17_Seccion4) {
    if (this.indexEditTabla !== -1)
      return;

    if (item.pathName) {
      this.funcionesMtcService.mostrarCargando();
      this.visorPdfArchivosService.get(item.pathName).subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          item.file = <File>file;
          item.pathName = null;

          this.visualizarGrillaPdf(item.file, item.placaRodaje);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
    } else {
      this.visualizarGrillaPdf(item.file, item.placaRodaje);
    }
  }

  visualizarGrillaPdf(file: File, placaRodaje: string) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + placaRodaje;
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-A/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarAnexo() {

    if (this.anexoFormulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    /*if (this.disabledAcordion === 2) {
        if (!this.filePdfCroquisSeleccionado && !this.filePdfCroquisPathName)
        return this.funcionesMtcService.mensajeError('Debe ingresar un croquis');
    } else {*/
    if (this.habilitarSeccion2===true) {
      if (this.anexoFormulario.controls['s2_fechaSalida'].value >= this.anexoFormulario.controls['s2_fechaLlegada'].value)
        return this.funcionesMtcService.mensajeError('Fecha de salida debe ser menor que fecha de llegada');

      if (this.anexoFormulario.get('s2_destino').value === '29') {
        if (!this.filePdfPolizaSeleccionado && !this.filePdfPolizaPathName)
          return this.funcionesMtcService.mensajeError('Debe ingresar una póliza');
      }
    }
    /*
    // Descartao por el usuario
    if (this.anexoFormulario.controls['s3_flota'].value === '')
      return this.funcionesMtcService.mensajeError('Debe seleccionar una flota'); */ 

    if (this.listaFlotaVehicular.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');


    let dataGuardar: Anexo001_A17Request = new Anexo001_A17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "A";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    
    dataGuardar.metaData.permisoOriginario = this.habilitarSeccion1;
    dataGuardar.metaData.permisoOcasional = this.habilitarSeccion2;
    dataGuardar.metaData.tipoSolicitud = {
      codigo: this.dataInput.tipoSolicitud.codigo,
      descripcion: this.dataInput.tipoSolicitud.descripcion
    } as TipoSolicitudModel
    //-------------------------------------    
    //SECCION 1:
    let seccion1: A001_A17_Seccion1 = new A001_A17_Seccion1();
    seccion1.paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'].value.map(item => {
      return { value: item.value, text: item.text, _checked: dataGuardar.metaData.permisoOriginario === true ? item.checked : false } as PaisResponse
    });
    seccion1.origen = dataGuardar.metaData.permisoOriginario === true ? 'PERÚ' : '';
    seccion1.destino = dataGuardar.metaData.permisoOriginario === true ?
      {
        value: this.anexoFormulario.controls['s1_destino'].value,
        text: this.listaPaises.filter(item => item.value == this.anexoFormulario.get('s1_destino').value)[0].text
      } as PaisResponse : null;

    seccion1.ciudadesOperar = dataGuardar.metaData.permisoOriginario === true ? this.anexoFormulario.controls['s1_ciudadesOperar'].value.trim() : '';
    seccion1.numeroFrecuencias = dataGuardar.metaData.permisoOriginario === true ? `${this.anexoFormulario.controls['s1_frecuencia'].value} - ${this.anexoFormulario.controls['s1_numeroFrecuencia'].value}` : '';
    seccion1.horariosSalida = dataGuardar.metaData.permisoOriginario === true ? this.anexoFormulario.controls['s1_horarioSalida'].value.trim() : '';
    seccion1.tiempoPromedioViaje = dataGuardar.metaData.permisoOriginario === true ? parseInt(this.anexoFormulario.controls['s1_tiempoPromedioViaje'].value) : 0;
    seccion1.paisesTransito = dataGuardar.metaData.permisoOriginario === true ? this.anexoFormulario.controls['s1_paisesTransito'].value.filter(item => item.checked).map(item => item.text).join(', ') : '';
    seccion1.pdfCroquis = dataGuardar.metaData.permisoOriginario === true ? this.filePdfCroquisSeleccionado : null;
    seccion1.pathName = dataGuardar.metaData.permisoOriginario === true ? this.filePdfCroquisPathName : null;
    dataGuardar.metaData.seccion1 = seccion1;
    //-------------------------------------    
    let seccion2: A001_A17_Seccion2 = new A001_A17_Seccion2();
    seccion2.origen = dataGuardar.metaData.permisoOcasional === true ? 'PERÚ' : '';
    seccion2.destino = dataGuardar.metaData.permisoOcasional === true ?
      {
        value: this.anexoFormulario.controls['s2_destino'].value,
        text: this.listaPaises.filter(item => item.value == this.anexoFormulario.get('s2_destino').value)[0].text
      } as PaisResponse : null;
    seccion2.puntosIntermedios = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_puntosIntermedios'].value : '';
    seccion2.pasoFronteraIda = dataGuardar.metaData.permisoOcasional === true ?
      {
        value: this.anexoFormulario.controls['s2_pasoFronteraIda'].value,
        text: this.listaPasoFrontera.filter(item => item.value == this.anexoFormulario.get('s2_pasoFronteraIda').value)[0].text
      } as SelectionModel : null;
    seccion2.pasoFronteraRegreso = dataGuardar.metaData.permisoOcasional === true ? //this.anexoFormulario.controls['s2_pasoFronteraRegreso'].value : '';
      {
        value: this.anexoFormulario.controls['s2_pasoFronteraRegreso'].value,
        text: this.listaPasoFrontera.filter(item => item.value == this.anexoFormulario.get('s2_pasoFronteraRegreso').value)[0].text
      } as SelectionModel : null;
    seccion2.fechaSalida = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_fechaSalida'].value.toStringFecha() : '';
    seccion2.fechaLlegada = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_fechaLlegada'].value.toStringFecha() : ''

    seccion2.pdfPoliza = dataGuardar.metaData.permisoOcasional === true ? this.filePdfPolizaSeleccionado : null;
    seccion2.pathName = dataGuardar.metaData.permisoOcasional === true ? this.filePdfPolizaPathName : null;

    dataGuardar.metaData.seccion2 = seccion2;
    //-------------------------------------    
    let seccion3: A001_A17_Seccion3 = new A001_A17_Seccion3();
    seccion3.flotaAlta = this.anexoFormulario.controls['s3_flota'].value === '1';
    seccion3.flotaBaja = this.anexoFormulario.controls['s3_flota'].value === '2';
    dataGuardar.metaData.seccion3 = seccion3;
    //-------------------------------------    
    dataGuardar.metaData.seccion4 = this.listaFlotaVehicular.map(item => {
      return {
        placaRodaje: item.placaRodaje,
        soat: item.soat,
        citv: item.citv,
        caf: item.caf,
        file: item.file,
        pathName: item.pathName
      } as A001_A17_Seccion4
    });

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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.anexoFormulario.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;

  }

}
