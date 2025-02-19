import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_B17Request } from 'src/app/core/models/Anexos/Anexo001_B17/Anexo001_B17Request';
import { Anexo001_B17Response } from 'src/app/core/models/Anexos/Anexo001_B17/Anexo001_B17Response';
import { A001_B17_Seccion3 } from 'src/app/core/models/Anexos/Anexo001_B17/Secciones';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { Anexo001B17Service } from 'src/app/core/services/anexos/anexo001-b17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-b17',
  templateUrl: './anexo001-b17.component.html',
  styleUrls: ['./anexo001-b17.component.css']
})
export class Anexo001B17Component implements OnInit {

  @Input() public dataInput: any;
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

  listaFlotaVehicular: A001_B17_Seccion3[] = [];

  filePdfPolizaSeleccionado: any = null;
  filePdfPolizaPathName: string = null;

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  paSeccion1: string[]=["DSTT-008","DSTT-012","DSTT-016"];
  paSeccion2: string[]=["DSTT-014"];
  paSeccion3: string[]=["DSTT-008","DSTT-012","DSTT-014","DSTT-016"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;

  paTipoServicio = [
    {"pa":"DSTT-008","tipoServicio":"9"},
    {"pa":"DSTT-012","tipoServicio":"10"},
    {"pa":"DSTT-012","tipoServicio":"16"},
    {"pa":"DSTT-014","tipoServicio":"9"},
    {"pa":"DSTT-016","tipoServicio":"9"},
    {"pa":"DSTT-016","tipoServicio":"10"}
   ];
  tipoServicio: string="";

  //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private paisService: PaisService,
    private anexoService: Anexo001B17Service,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService) { }

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

    this.uriArchivo = this.dataInput.rutaDocumento;

    this.listaPasoFrontera.push({ value: 1, text: "Desaguadero" });
    this.listaPasoFrontera.push({ value: 2, text: "Santa Rosa" });

    if (this.dataInput.tipoSolicitud.codigo === 3) {//SOLO TRANSPORTE PERSONAL
      this.listaPasoFrontera.push({ value: 3, text: "Kasani" });
    }

    this.listaPasoFrontera.push({ value: 4, text: "Iñapari" })
    /*
    setTimeout(() => {
      // if (this.dataInput.tipoSolicitud.codigo === 4)//'ORIGINARIO'
      //   this.disabledAcordion = 3
      if (this.dataInput.tipoSolicitud.codigo === 1)//'ORIGINARIO'
        this.onChangePermiso('anexo001-b17-seccion-1', 'anexo001-b17-seccion-2', 2);
      else
        this.onChangePermiso('anexo001-b17-seccion-2', 'anexo001-b17-seccion-1', 1);
    }, 50);*/

    this.anexoFormulario = this.fb.group({
      s1_paisesOperar: this.fb.array([], this.paisesOperarValidator()),

      s2_tipoCargaTransportarIda: this.fb.control(''),
      s2_tipoCargaTransportarRegreso: this.fb.control(''),
      s2_destinoViaje: this.fb.control(''),
      s2_periodoViajeOsacional: this.fb.control(''),
      s2_pasoFronteraIda: this.fb.control(''),
      s2_pasoFronteraRegreso: this.fb.control(''),
      s2_cantidadViajes: this.fb.control(''),
      s2_vehiculosOfertados: this.fb.control(''),
      //-------------------------------------------------------------------------------
      placaRodajeForm: this.fb.control(''),
      soatForm: this.fb.control(''),
      citvForm: this.fb.control(''),
      cafForm: this.fb.control(false),
      tipoModificacion: [''],
    });

    this.recuperarPaises();

    setTimeout(() => {
      if(this.habilitarSeccion1===true){
        this.acc.expand('anexo001-b17-seccion-1');
      }else{
        this.acc.collapse('anexo001-b17-seccion-1');
        document.querySelector('button[aria-controls=anexo001-b17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion2===true){
        this.acc.expand('anexo001-b17-seccion-2');
      }else{
        this.acc.collapse('anexo001-b17-seccion-2');
        document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('anexo001-b17-seccion-3');
      }else{
        this.acc.collapse('anexo001-b17-seccion-3');
        document.querySelector('button[aria-controls=anexo001-b17-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      this.actualizarValidatorSeccion1y2(true);
      //if (this.dataInput.tipoSolicitud.codigo === 4) {//
        // this.acc.expand('anexo001-b17-seccion-1');
        //document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      //}
    });
  }
  /*
  toggleAccordian(props: NgbPanelChangeEvent): void {

    if (this.dataInput.tipoSolicitud.codigo === 4) {//
      if (props.panelId === 'anexo001-b17-seccion-1') {
        this.acc.collapse('anexo001-b17-seccion-2');
        this.actualizarValidatorSeccion1y2(true);

      } else if (props.panelId === 'anexo001-b17-seccion-2') {
        this.acc.collapse('anexo001-b17-seccion-1');
        this.actualizarValidatorSeccion1y2(false);

      }
    }
  }
  */

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

  changeDestinoViaje(value) {
    if (value !== '29') {
      this.filePdfPolizaSeleccionado = null;
      this.filePdfPolizaPathName = null;
    }
  }

  onChangePermiso(seccion1: string, seccion2: string, valor: number) {
    this.acc.collapse(seccion2);
    this.disabledAcordion = valor;

    // const s1_paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'];
    // const s2_tipoCargaTransportarIda = this.anexoFormulario.controls['s2_tipoCargaTransportarIda'];
    // const s2_tipoCargaTransportarRegreso = this.anexoFormulario.controls['s2_tipoCargaTransportarRegreso'];
    // const s2_periodoViajeOsacional = this.anexoFormulario.controls['s2_periodoViajeOsacional'];
    // const s2_pasoFronteraIda = this.anexoFormulario.controls['s2_pasoFronteraIda'];
    // const s2_pasoFronteraRegreso = this.anexoFormulario.controls['s2_pasoFronteraRegreso'];
    // const s2_cantidadViajes = this.anexoFormulario.controls['s2_cantidadViajes'];
    // const s2_vehiculosOfertados = this.anexoFormulario.controls['s2_vehiculosOfertados'];

    if (seccion1 === 'anexo001-b17-seccion-1') {
      //seccion1 activa:

      document.querySelector('button[aria-controls=anexo001-b17-seccion-1]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
      document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');

      // s2_tipoCargaTransportarIda.setValidators(null);
      // s2_tipoCargaTransportarRegreso.setValidators(null);
      // s2_periodoViajeOsacional.setValidators(null);
      // s2_pasoFronteraIda.setValidators(null);
      // s2_pasoFronteraRegreso.setValidators(null);
      // s2_cantidadViajes.setValidators(null);
      // s2_vehiculosOfertados.setValidators(null);

      // s1_paisesOperar.setValidators(this.paisesOperarValidator());

      this.actualizarValidatorSeccion1y2(true);
    } else {
      //seccion2 activa:

      document.querySelector('button[aria-controls=anexo001-b17-seccion-2]').parentElement.parentElement.classList.remove('acordeon-bloqueado');
      document.querySelector('button[aria-controls=anexo001-b17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');

      this.actualizarValidatorSeccion1y2(false);

      // s1_paisesOperar.setValidators(null);

      // s2_tipoCargaTransportarIda.setValidators([Validators.required]);
      // s2_tipoCargaTransportarRegreso.setValidators([Validators.required]);
      // s2_periodoViajeOsacional.setValidators([Validators.required]);
      // s2_pasoFronteraIda.setValidators([Validators.required]);
      // s2_pasoFronteraRegreso.setValidators([Validators.required]);
      // s2_cantidadViajes.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
      // s2_vehiculosOfertados.setValidators([Validators.required]);
    }

    // s1_paisesOperar.updateValueAndValidity();
    // s2_tipoCargaTransportarIda.updateValueAndValidity();
    // s2_tipoCargaTransportarRegreso.updateValueAndValidity();
    // s2_periodoViajeOsacional.updateValueAndValidity();
    // s2_pasoFronteraIda.updateValueAndValidity();
    // s2_pasoFronteraRegreso.updateValueAndValidity();
    // s2_cantidadViajes.updateValueAndValidity();
    // s2_vehiculosOfertados.updateValueAndValidity();

    setTimeout(() => {
      this.acc.expand(seccion1);
    }, 200);
  }

  actualizarValidatorSeccion1y2(seccion1: boolean) {
    const s1_paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'];
    const s2_tipoCargaTransportarIda = this.anexoFormulario.controls['s2_tipoCargaTransportarIda'];
    const s2_tipoCargaTransportarRegreso = this.anexoFormulario.controls['s2_tipoCargaTransportarRegreso'];
    const s2_periodoViajeOsacional = this.anexoFormulario.controls['s2_periodoViajeOsacional'];
    const s2_pasoFronteraIda = this.anexoFormulario.controls['s2_pasoFronteraIda'];
    const s2_pasoFronteraRegreso = this.anexoFormulario.controls['s2_pasoFronteraRegreso'];
    const s2_cantidadViajes = this.anexoFormulario.controls['s2_cantidadViajes'];
    const s2_vehiculosOfertados = this.anexoFormulario.controls['s2_vehiculosOfertados'];

    if (!this.habilitarSeccion1){
      s1_paisesOperar.setValidators(null);
    }else{
      s1_paisesOperar.setValidators(this.paisesOperarValidator());
    }

    if (!this.habilitarSeccion2) {
      s2_tipoCargaTransportarIda.setValidators(null);
      s2_tipoCargaTransportarRegreso.setValidators(null);
      s2_periodoViajeOsacional.setValidators(null);
      s2_pasoFronteraIda.setValidators(null);
      s2_pasoFronteraRegreso.setValidators(null);
      s2_cantidadViajes.setValidators(null);
      s2_vehiculosOfertados.setValidators(null);
    }else{
      s2_tipoCargaTransportarIda.setValidators([Validators.required]);
      s2_tipoCargaTransportarRegreso.setValidators([Validators.required]);
      s2_periodoViajeOsacional.setValidators([Validators.required]);
      s2_pasoFronteraIda.setValidators([Validators.required]);
      s2_pasoFronteraRegreso.setValidators([Validators.required]);
      s2_cantidadViajes.setValidators([Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]);
      s2_vehiculosOfertados.setValidators([Validators.required]);
    }
      
    s1_paisesOperar.updateValueAndValidity();
    s2_tipoCargaTransportarIda.updateValueAndValidity();
    s2_tipoCargaTransportarRegreso.updateValueAndValidity();
    s2_periodoViajeOsacional.updateValueAndValidity();
    s2_pasoFronteraIda.updateValueAndValidity();
    s2_pasoFronteraRegreso.updateValueAndValidity();
    s2_cantidadViajes.updateValueAndValidity();
    s2_vehiculosOfertados.updateValueAndValidity();
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
    event.target.value = "";
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

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
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

          data.map((item, index) => {
            item.text = item.text.capitalize();
            this.listaPaises.push(item);
            (this.anexoFormulario.get('s1_paisesOperar') as UntypedFormArray).push(this.fb.group({ checked: false, ...item }));
          });

          if (this.dataInput.movId > 0) {
            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();

            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_B17Response) => {
                this.funcionesMtcService.ocultarCargando();

                const metaData: any = JSON.parse(dataAnexo.metaData);

                this.idAnexo = dataAnexo.anexoId;

                let i = 0;
                //recorremos los paises:
                metaData.seccion1.paisesJson = {}

                //PERMISO ORIGINARIO
                if (this.habilitarSeccion1){
                  for (i; i < metaData.seccion1.paisesOperar.length; i++) {
                    metaData.seccion1.paisesJson[metaData.seccion1.paisesOperar[i].value] = metaData.seccion1.paisesOperar[i];
                  }

                  i = 0;
                  for (let control of this.anexoFormulario.controls["s1_paisesOperar"].value) {
                    if (metaData.seccion1.paisesJson[control.value]) {
                      this.anexoFormulario.get("s1_paisesOperar")["controls"][i]['controls']['checked'].setValue(metaData.seccion1.paisesJson[control.value].checked);
                    }
                    i++;
                  }
                }
            
                if (this.habilitarSeccion2){
                  //PERMISO OCASIONAL
                  this.anexoFormulario.get("s2_tipoCargaTransportarIda").setValue(metaData.seccion2.tipoCargaTransportarIda || '');
                  this.anexoFormulario.get("s2_tipoCargaTransportarRegreso").setValue(metaData.seccion2.tipoCargaTransportarRegreso || '');
                  this.anexoFormulario.get("s2_destinoViaje").setValue(metaData.seccion2.destinoViaje.value || '');
                  this.anexoFormulario.get("s2_periodoViajeOsacional").setValue(metaData.seccion2.periodoViajeOcasional || '');
                  this.anexoFormulario.get("s2_pasoFronteraIda").setValue(metaData.seccion2.pasosFronteraIda.value || '');
                  this.anexoFormulario.get("s2_pasoFronteraRegreso").setValue(metaData.seccion2.pasosFronteraRegresa.value || '');
                  this.anexoFormulario.get("s2_cantidadViajes").setValue(metaData.seccion2.cantidadViajes || '');
                  this.anexoFormulario.get("s2_vehiculosOfertados").setValue(metaData.seccion2.vehiculosOfertados || '');
                  this.filePdfPolizaPathName = metaData.seccion2.pathName || null;
                }

                for (i = 0; i < metaData.seccion3.length; i++) {
                  this.listaFlotaVehicular.push({
                    placaRodaje: metaData.seccion3[i].placaRodaje,
                    soat: metaData.seccion3[i].soat,
                    citv: metaData.seccion3[i].citv,
                    caf: metaData.seccion3[i].caf == true || metaData.seccion3[i].caf === 'true' ? true : false,
                    pathName: metaData.seccion3[i].pathName,
                    tipoModificacion: metaData.seccion3[i].tipoModificacion || '',
                    file: null
                  });
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
          this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para cargar paises');
        }
      );
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
        /*
        console.log("SOAT Nro: "+respuesta.soat.numero+"  ESTADO:"+respuesta.soat.estado);
        console.log("CITV Nro: "+respuesta.citv.numero+"  ESTADO:"+respuesta.citv.estado);
        console.log("TIPO SERVICIO: Nro: "+respuesta.citv.tipoId);*/

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
        // if (respuesta.citv.tipoId != '23')
        //   return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoServicio==respuesta.citv.tipoId)==undefined){
          return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        }

        this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '(FALTANTE)');
        this.anexoFormulario.controls['citvForm'].setValue(respuesta.citv.numero || '(FALTANTE)');*/
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
    this.anexoFormulario.controls['tipoModificacion'].setValue('');

    this.filePdfCafSeleccionado = null;
    this.filePdfCafPathName = null;

    this.visibleButtonCarf = false;
  }

  agregarFlotaVehicular() {

    if (
      this.anexoFormulario.controls['placaRodajeForm'].value.trim() === '' ||
      this.anexoFormulario.controls['soatForm'].value.trim() === '' ||
      this.anexoFormulario.controls['citvForm'].value.trim() === '' ||
      (
        this.anexoFormulario.controls['tipoModificacion'].value.trim() === '' &&
        this.dataInput.tipoSolicitud.codigo === 4 && this.dataInput.tupaId === 878
      )
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
        tipoModificacion: this.anexoFormulario.controls['tipoModificacion'].value,
        file: this.filePdfCafSeleccionado
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].tipoModificacion = this.anexoFormulario.controls['tipoModificacion'].value;
      this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
    }

    this.cancelarFlotaVehicular();
  }

  modificarFlotaVehicular(item: A001_B17_Seccion3, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['placaRodajeForm'].setValue(item.placaRodaje);
    this.anexoFormulario.controls['soatForm'].setValue(item.soat);
    this.anexoFormulario.controls['citvForm'].setValue(item.citv);
    this.anexoFormulario.controls['cafForm'].setValue(item.caf);
    this.anexoFormulario.controls['tipoModificacion'].setValue(item.tipoModificacion);
    this.visibleButtonCarf = item.caf;

    this.filePdfCafSeleccionado = item.file;
    this.filePdfCafPathName = item.pathName;
  }

  eliminarFlotaVehicular(item: A001_B17_Seccion3, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  verPdfCafGrilla(item: A001_B17_Seccion3) {
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-B/17";

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

    if (this.listaFlotaVehicular.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');


    if (this.anexoFormulario.get('s2_destinoViaje').value === '29') {
      if (!this.filePdfPolizaSeleccionado && !this.filePdfPolizaPathName)
        return this.funcionesMtcService.mensajeError('Debe ingresar una póliza');
    }

    let dataGuardar: Anexo001_B17Request = new Anexo001_B17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "B";
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
    dataGuardar.metaData.seccion1.paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'].value.map(item => {
      return {
        value: item.value,
        text: item.text,
        _checked: dataGuardar.metaData.permisoOriginario === true ? item.checked : false
      } as PaisResponse
    });
    //-------------------------------------
    //SECCION 2:
    dataGuardar.metaData.seccion2.tipoCargaTransportarIda = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_tipoCargaTransportarIda'].value : '';
    dataGuardar.metaData.seccion2.origenViaje = dataGuardar.metaData.permisoOcasional === true ? 'PERÚ' : '';
    dataGuardar.metaData.seccion2.tipoCargaTransportarRegreso = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_tipoCargaTransportarRegreso'].value : '';
    dataGuardar.metaData.seccion2.destinoViaje = dataGuardar.metaData.permisoOcasional === true ?
      {
        value: this.anexoFormulario.controls['s2_destinoViaje'].value,
        text: this.listaPaises.filter(item => item.value == this.anexoFormulario.get('s2_destinoViaje').value)[0].text
      } as PaisResponse : null;
    dataGuardar.metaData.seccion2.periodoViajeOcasional = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_periodoViajeOsacional'].value : '';
    dataGuardar.metaData.seccion2.pasosFronteraIda = dataGuardar.metaData.permisoOcasional === true ?
      {
        value: this.anexoFormulario.controls['s2_pasoFronteraIda'].value,
        text: this.listaPasoFrontera.filter(item => item.value == this.anexoFormulario.get('s2_pasoFronteraIda').value)[0].text
      } as SelectionModel : null;

    dataGuardar.metaData.seccion2.pasosFronteraRegresa = dataGuardar.metaData.permisoOcasional === true ?
      {
        value: this.anexoFormulario.controls['s2_pasoFronteraRegreso'].value,
        text: this.listaPasoFrontera.filter(item => item.value == this.anexoFormulario.get('s2_pasoFronteraRegreso').value)[0].text
      } as SelectionModel : null;
    dataGuardar.metaData.seccion2.cantidadViajes = dataGuardar.metaData.permisoOcasional === true ? parseInt(this.anexoFormulario.controls['s2_cantidadViajes'].value) : 0;
    dataGuardar.metaData.seccion2.vehiculosOfertados = dataGuardar.metaData.permisoOcasional === true ? this.anexoFormulario.controls['s2_vehiculosOfertados'].value : '';

    dataGuardar.metaData.seccion2.pdfPoliza = dataGuardar.metaData.permisoOcasional === true ? this.filePdfPolizaSeleccionado : null;
    dataGuardar.metaData.seccion2.pathName = dataGuardar.metaData.permisoOcasional === true ? this.filePdfPolizaPathName : null;

    //-------------------------------------    
    //SECCION 3:
    dataGuardar.metaData.seccion3 = this.listaFlotaVehicular.map(item => {
      return {
        placaRodaje: item.placaRodaje,
        soat: item.soat,
        citv: item.citv,
        caf: item.caf,
        tipoModificacion: item.tipoModificacion,
        file: item.file
      } as A001_B17_Seccion3
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
