import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_D17Request } from 'src/app/core/models/Anexos/Anexo001_D17/Anexo001_D17Request';
import { Anexo001_D17Response } from 'src/app/core/models/Anexos/Anexo001_D17/Anexo001_D17Response';
import { A001_D17_Seccion2 } from 'src/app/core/models/Anexos/Anexo001_D17/Secciones';
import { Anexo001_G17Request } from 'src/app/core/models/Anexos/Anexo001_G17/Anexo001_G17Request';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { Anexo001D17Service } from 'src/app/core/services/anexos/anexo001-d17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-d17',
  templateUrl: './anexo001-d17.component.html',
  styleUrls: ['./anexo001-d17.component.css']
})
export class Anexo001D17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  indexEditTabla: number = -1;
  visibleButtonCarf: boolean = false;
  caf_vinculado: string = '';

  anexoFormulario: UntypedFormGroup;
  listaPaises: PaisResponse[] = [];
  listaFlotaVehicular: A001_D17_Seccion2[] = [];

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  codigoTipoSolicitud: string;
  descTipoSolicitud:string;

  codigoTipoSolicitudTupa:string;
  descTipoSolicitudTupa:string;


  paSeccion1: string[]=["DSTT-024","DSTT-027"];
  paSeccion2: string[]=["DSTT-025","DSTT-027"];
  paSeccion3: string[]=["DSTT-027"];
  
  habilitarSeccion1:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;

  paTipoServicio = [
    {"pa":"DSTT-025","tipoSolicitud":"1","tipoServicio":"1"}, //RENOVACION PARA PASAJEROS
    {"pa":"DSTT-025","tipoSolicitud":"2","tipoServicio":"15"},//DUPLICADO PARA PASAJEROS
    {"pa":"DSTT-025","tipoSolicitud":"3","tipoServicio":"9"}, //RENOVACION PARA MERCANCIAS
    {"pa":"DSTT-025","tipoSolicitud":"3","tipoServicio":"16"}, //RENOVACION PARA MERCANCIAS
    {"pa":"DSTT-025","tipoSolicitud":"4","tipoServicio":"9"}, //DUPLICADO PARA MERCANCIASS
    {"pa":"DSTT-025","tipoSolicitud":"4","tipoServicio":"16"}, //DUPLICADO PARA MERCANCIASS
    {"pa":"DSTT-027","tipoSolicitud":"5","tipoServicio":"1"},//DUPLICADO PARA PASAJEROS
    {"pa":"DSTT-027","tipoSolicitud":"5","tipoServicio":"15"},//DUPLICADO PARA PASAJEROS
    {"pa":"DSTT-027","tipoSolicitud":"6","tipoServicio":"9"},//DUPLICADO PARA MERCANCIAS
    {"pa":"DSTT-027","tipoSolicitud":"6","tipoServicio":"10"},//DUPLICADO PARA MERCANCIAS
    {"pa":"DSTT-027","tipoSolicitud":"6","tipoServicio":"16"},//DUPLICADO PARA MERCANCIAS
    {"pa":"DSTT-027","tipoSolicitud":"6","tipoServicio":"21"},//DUPLICADO PARA MERCANCIAS
   ];
  tipoServicio: string="";

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private paisService: PaisService,
    private anexoService: Anexo001D17Service,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private vehiculoService: VehiculoService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    //==================================================================================
    //RECUPERAMOS NOMBRE DEL TUPA:
    const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa = tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;
    this.codigoTipoSolicitud = this.dataInput.tipoSolicitud.codigo;
    this.descTipoSolicitud = this.dataInput.tipoSolicitud.descripcion;
    this.codigoTipoSolicitudTupa = (this.dataInput.tipoSolicitudTupaCod==null || this.dataInput.tipoSolicitudTupaCod==""?"0":this.dataInput.tipoSolicitudTupaCod);
    this.descTipoSolicitudTupa = this.dataInput.tipoSolicitudTupaDesc;
    this.uriArchivo = this.dataInput.rutaDocumento;
    console.log("Tipo de Solicitud: "+this.codigoProcedimientoTupa+" - Solicitud: "+this.descProcedimientoTupa);
    //console.log(this.dataRequisitosInput);
    //==================================================================================
    if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion2.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion2=true; else this.habilitarSeccion2=false;
    if(this.paSeccion3.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion3=true; else this.habilitarSeccion3=false;

    this.anexoFormulario = this.fb.group({
      s1_ambitoOperacion: this.fb.control('', [Validators.required]),
      s1_paisesOperar: this.fb.array([], this.paisesOperarValidator()),

      s3_nombreUsuario: this.fb.control(''),
      s3_numeroDocumento: this.fb.control(''),
      s3_empresa: this.fb.control('', [Validators.required]),
      s3_poderInscrito: this.fb.control('', [Validators.required]),
      s3_domicilio: this.fb.control('', [Validators.required]),
      s3_dia: this.fb.control(this.getDia(), [Validators.required]),
      s3_mes: this.fb.control(this.getMes(), [Validators.required]),
      s3_anio: this.fb.control(this.getAnio(), [Validators.required]),

      placaRodajeForm: this.fb.control(''),
      soatForm: this.fb.control({value: '', disabled: true}),
      citvForm: this.fb.control({value: '', disabled: true}),
      cafForm: this.fb.control(false),
      vinculadoForm: this.fb.control(false),
    });

    //VERIFICAMOS QUE EL FORMULARIO YA ESTÉ GRABADO
    for (let i = 0; i < this.dataRequisitosInput.length; i++) {
      if (this.dataInput.tramiteReqRefId === this.dataRequisitosInput[i].tramiteReqId) {
        if (this.dataRequisitosInput[i].movId === 0) {
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Primero debe completar el primer registro');
          return;
        }
      }
    }

    if(!this.habilitarSeccion1){
      this.anexoFormulario.controls['s1_ambitoOperacion'].setValidators(null);
      this.anexoFormulario.controls['s1_ambitoOperacion'].updateValueAndValidity();

      this.anexoFormulario.controls['s1_paisesOperar'].setValidators(null);
      this.anexoFormulario.controls['s1_paisesOperar'].updateValueAndValidity();
    }

    if (!this.habilitarSeccion3) {

      this.anexoFormulario.controls['s3_empresa'].setValidators(null);
      this.anexoFormulario.controls['s3_empresa'].updateValueAndValidity();

      this.anexoFormulario.controls['s3_poderInscrito'].setValidators(null);
      this.anexoFormulario.controls['s3_poderInscrito'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_domicilio'].setValidators(null);
      this.anexoFormulario.controls['s3_domicilio'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_dia'].setValidators(null);
      this.anexoFormulario.controls['s3_dia'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_mes'].setValidators(null);
      this.anexoFormulario.controls['s3_mes'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_anio'].setValidators(null);
      this.anexoFormulario.controls['s3_anio'].updateValueAndValidity();
    }
    /*
    if (this.dataInput.tipoSolicitud.codigo == 1 &&  this.dataInput.tupaId == 887) {//DSTT-025 RENOVACION

      this.anexoFormulario.controls['s1_ambitoOperacion'].setValidators(null);
      this.anexoFormulario.controls['s1_ambitoOperacion'].updateValueAndValidity();

      this.anexoFormulario.controls['s1_paisesOperar'].setValidators(null);
      this.anexoFormulario.controls['s1_paisesOperar'].updateValueAndValidity();
    }

    if (this.dataInput.tipoSolicitud.codigo == 2 && this.dataInput.tupaId == 887) {//DSTT-025 DUPLICADO

      this.anexoFormulario.controls['s1_ambitoOperacion'].setValidators(null);
      this.anexoFormulario.controls['s1_ambitoOperacion'].updateValueAndValidity();

      this.anexoFormulario.controls['s1_paisesOperar'].setValidators(null);
      this.anexoFormulario.controls['s1_paisesOperar'].updateValueAndValidity();


      this.anexoFormulario.controls['s3_empresa'].setValidators(null);
      this.anexoFormulario.controls['s3_empresa'].updateValueAndValidity();

      this.anexoFormulario.controls['s3_poderInscrito'].setValidators(null);
      this.anexoFormulario.controls['s3_poderInscrito'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_domicilio'].setValidators(null);
      this.anexoFormulario.controls['s3_domicilio'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_dia'].setValidators(null);
      this.anexoFormulario.controls['s3_dia'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_mes'].setValidators(null);
      this.anexoFormulario.controls['s3_mes'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_anio'].setValidators(null);
      this.anexoFormulario.controls['s3_anio'].updateValueAndValidity();
    }*/

    if (this.dataInput.tipoSolicitud.codigo == 6 && this.dataInput.tupaId === 889) {//DSTT-027 MERCANCIAS

      this.anexoFormulario.controls['s1_ambitoOperacion'].setValidators(null);
      this.anexoFormulario.controls['s1_ambitoOperacion'].updateValueAndValidity();

      this.anexoFormulario.controls['s1_paisesOperar'].setValidators(null);
      this.anexoFormulario.controls['s1_paisesOperar'].updateValueAndValidity();


      this.anexoFormulario.controls['s3_empresa'].setValidators(null);
      this.anexoFormulario.controls['s3_empresa'].updateValueAndValidity();

      this.anexoFormulario.controls['s3_poderInscrito'].setValidators(null);
      this.anexoFormulario.controls['s3_poderInscrito'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_domicilio'].setValidators(null);
      this.anexoFormulario.controls['s3_domicilio'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_dia'].setValidators(null);
      this.anexoFormulario.controls['s3_dia'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_mes'].setValidators(null);
      this.anexoFormulario.controls['s3_mes'].updateValueAndValidity();
      this.anexoFormulario.controls['s3_anio'].setValidators(null);
      this.anexoFormulario.controls['s3_anio'].updateValueAndValidity();
    }

    setTimeout(() => {
     
      if(this.habilitarSeccion1===true){
        this.acc.expand('anexo001-d17-seccion-1');
      }else{
        this.acc.collapse('anexo001-d17-seccion-1');
        document.querySelector('button[aria-controls=anexo001-d17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion2===true){
        this.acc.expand('anexo001-d17-seccion-2');
      }else{
        this.acc.collapse('anexo001-d17-seccion-2');
        document.querySelector('button[aria-controls=anexo001-d17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('anexo001-d17-seccion-3');
      }else{
        this.acc.collapse('anexo001-d17-seccion-3');
        document.querySelector('button[aria-controls=anexo001-d17-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

    });

    this.recuperarPaises();
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

  desactivarPanel(seccion: string) {
    switch (seccion) {
      case 'seccion1':
        if (this.dataInput.tipoSolicitud.codigo == 2 && this.dataInput.tupaId == 887) {//DUPLICADO DSTT-025
          return true;
        }

        if (this.dataInput.tipoSolicitud.codigo == 1 && this.dataInput.tupaId == 887) {//RENOVACION DSTT-025
          return true;
        }

        if (this.dataInput.tipoSolicitud.codigo == 6 && this.dataInput.tupaId === 889) {//MERCANCIAS DSTT-027
          return true;
        }
        break;
      case 'seccion2':
        if (this.dataInput.tipoSolicitud.codigo == 6 && this.dataInput.tupaId === 886) {//MERCANCIAS DSTT-024
          return true;
        }
        break;
      case 'seccion3':
        if (this.dataInput.tipoSolicitud.codigo == 2 && this.dataInput.tupaId == 887) {//DUPLICADO DSTT-025
          return true;
        }

        if (this.dataInput.tipoSolicitud.codigo == 6 &&  this.dataInput.tupaId === 889) {// //MERCANCIAS DSTT-027
          return true;
        }
        break;
    }
    return false;
  }

  deshabilitarButtonGuardarModificar() {
    if (this.dataInput.tipoSolicitud.codigo == 6 &&//MERCANCIAS
      this.dataInput.tupaId == 886) {//DSTT-024
      return this.anexoFormulario.invalid ||
        this.indexEditTabla !== -1;
    }

    if (this.dataInput.tipoSolicitud.codigo == 6 && //MERCANCIAS
      this.dataInput.tupaId === 889) {//DSTT-027

      return this.anexoFormulario.invalid ||
        this.indexEditTabla !== -1;
    }

    return this.anexoFormulario.invalid ||
      this.listaFlotaVehicular.length === 0 ||
      this.indexEditTabla !== -1
  }

  recuperarPaises() {
    this.funcionesMtcService.mostrarCargando();

    this.paisService.get<PaisResponse[]>('BOL,COL,ECU,PER')
      .subscribe(
        data => {
          this.funcionesMtcService.ocultarCargando();

          data.map((item, index) => {
            item.text = item.text.capitalize();
            this.listaPaises.push(item);

            (this.anexoFormulario.get('s1_paisesOperar') as UntypedFormArray).push(this.fb.group({ checked: false, ...item }));
          });

          if (this.habilitarSeccion3 === true) {
            return this.recuerarDatosGuardados();
          }


          this.funcionesMtcService.mostrarCargando();
          //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
          //RECUPERAMOS DATOS DEL FORMULARIO
          //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
          this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
            (dataForm: any) => {
              //debugger;

              this.funcionesMtcService.ocultarCargando();
              const metaDataForm: any = JSON.parse(dataForm.metaData);
              const representanteLegal = metaDataForm?.DatosSolicitante?.RepresentanteLegal;

              this.anexoFormulario.controls['s3_nombreUsuario'].setValue(
                `${representanteLegal?.apellidoPaterno} ${representanteLegal?.apellidoMaterno} ${representanteLegal?.Nombres}`
              );
              this.anexoFormulario.controls['s3_numeroDocumento'].setValue(representanteLegal?.NumeroDocumento);
              this.anexoFormulario.controls['s3_empresa'].setValue(metaDataForm?.DatosSolicitante?.RazonSocial);
              this.anexoFormulario.controls['s3_poderInscrito'].setValue(representanteLegal?.NroPartida);
              this.anexoFormulario.controls['s3_domicilio'].setValue(representanteLegal?.DomicilioRepresentanteLegal);

              this.recuerarDatosGuardados();

            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
            }
          );
        },
        error => {
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService.mensajeError('Problemas para cargar paises');
        }
      );
  }

  recuerarDatosGuardados() {
    if (this.dataInput.movId > 0) {
      this.funcionesMtcService.mostrarCargando();
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //RECUPERAMOS LOS DATOS GUARDADOS EN EL ANEXO
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
        (dataAnexo: Anexo001_D17Response) => {
          this.funcionesMtcService.ocultarCargando();

          const metaData: any = JSON.parse(dataAnexo.metaData);
          this.idAnexo = dataAnexo.anexoId;

          let i = 0;

          this.anexoFormulario.get("s1_ambitoOperacion").setValue(metaData.seccion1.ambitoOperacion || '');

          //recorremos los paises:
          metaData.seccion1.paisesJson = {}

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

          for (i = 0; i < metaData.seccion2.length; i++) {
            this.listaFlotaVehicular.push({
              placaRodaje: metaData.seccion2[i].placaRodaje,
              soat: metaData.seccion2[i].soat,
              citv: metaData.seccion2[i].citv,
              caf: metaData.seccion2[i].caf == true || metaData.seccion2[i].caf === 'true' ? true : false,
              vinculado: metaData.seccion2[i].vinculado == true || metaData.seccion2[i].caf === 'true' ? true : false,
              pathName: metaData.seccion2[i].pathName,
              file: null
            });
          }

          this.anexoFormulario.get("s3_dia").setValue(metaData.seccion3.dia);
          this.anexoFormulario.get("s3_mes").setValue(metaData.seccion3.mes);
          this.anexoFormulario.get("s3_anio").setValue(metaData.seccion3.anio);
        },
        error => {
          // this.errorAlCargarData = true;
          this.funcionesMtcService
            .ocultarCargando()
          //   .mensajeError('Problemas para recuperar los datos guardados del anexo');
        });
    }
  }

  getDia() {
    return ('0' + (new Date().getDate())).slice(-2);
  }

  getMes() {
    switch (new Date().getMonth()) {
      case 0:
        return 'Enero';
      case 1:
        return 'Febrero';
      case 2:
        return 'Marzo';
      case 3:
        return 'Abril';
      case 4:
        return 'Mayo';
      case 5:
        return 'Junio';
      case 6:
        return 'Julio';
      case 7:
        return 'Agosto';
      case 8:
        return 'Setiembre';
      case 9:
        return 'Octubre';
      case 10:
        return 'Noviembre';
      case 11:
        return 'Diciembre';
    }
  }

  getAnio() {
    return new Date().getFullYear().toString().substr(2);
  }

  onChangeCaf(event: boolean) {
    this.visibleButtonCarf = event;

    if (event === true) {
      this.anexoFormulario.controls['vinculadoForm'].setValue(false);

      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCarf = false;
        this.anexoFormulario.controls['cafForm'].setValue(false);
        this.caf_vinculado = '';
        this.filePdfCafSeleccionado = null;
      });

      this.caf_vinculado = 'C.A.F';
    } else {
      this.caf_vinculado = '';
      this.filePdfCafSeleccionado = null;
      this.filePdfCafPathName = null;
    }

  }

  onChangeVinciulado(event: boolean) {
    this.visibleButtonCarf = event;

    if (event === true) {
      this.anexoFormulario.controls['cafForm'].setValue(false);

      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCarf = false;
        this.anexoFormulario.controls['vinculadoForm'].setValue(false);
        this.caf_vinculado = '';
        this.filePdfCafSeleccionado = null;
      });

      this.caf_vinculado = 'Vinculado';
    } else {
      this.caf_vinculado = '';
      this.filePdfCafSeleccionado = null;
    }
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
            if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoSolicitud==this.codigoTipoSolicitudTupa && i.tipoServicio==placa.tipoId)!=undefined){
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
                
        //if (respuesta.citv.estado !== 'VIGENTE')
          //return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
        // if (respuesta.citv.tipoId != '23')
        //   return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');        
        //this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '(FALTANTE)');
        
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
    this.anexoFormulario.controls['vinculadoForm'].setValue(false);

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

    if (this.anexoFormulario.controls['cafForm'].value === true || this.anexoFormulario.controls['vinculadoForm'].value === true) {
      if (this.filePdfCafSeleccionado === null)
        return this.funcionesMtcService.mensajeError('Debe cargar un archivo PDF');
    }

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
        vinculado: this.anexoFormulario.controls['vinculadoForm'].value,
        file: this.filePdfCafSeleccionado
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].vinculado = this.anexoFormulario.controls['vinculadoForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
    }

    this.cancelarFlotaVehicular();
  }

  modificarFlotaVehicular(item: A001_D17_Seccion2, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['placaRodajeForm'].setValue(item.placaRodaje);
    this.anexoFormulario.controls['soatForm'].setValue(item.soat);
    this.anexoFormulario.controls['citvForm'].setValue(item.citv);
    this.anexoFormulario.controls['cafForm'].setValue(item.caf);

    this.visibleButtonCarf = item.caf === true || item.vinculado === true ? true : false;

    this.anexoFormulario.controls['vinculadoForm'].setValue(item.vinculado);

    this.filePdfCafSeleccionado = item.file;
    this.filePdfCafPathName = item.pathName;
  }

  eliminarFlotaVehicular(item: A001_D17_Seccion2, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  verPdfCafGrilla(item: A001_D17_Seccion2) {
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
    console.log("ARCHIVO: "+this.uriArchivo);
    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-D/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );

  }

  guardarAnexo() {

    if (this.anexoFormulario.invalid === true) {
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');
    }

    //if (this.desactivarPanel('seccion2') === false) {
    if (this.habilitarSeccion2) {
      if (this.listaFlotaVehicular.length === 0)
        return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
    }

    let dataGuardar: Anexo001_D17Request = new Anexo001_D17Request();
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "D";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------    
    dataGuardar.metaData.tipoSolicitud = {
      codigo: this.dataInput.tipoSolicitud.codigo,
      descripcion: this.dataInput.tipoSolicitud.descripcion
    } as TipoSolicitudModel
    //-------------------------------------    
    //SECCION 1:
    dataGuardar.metaData.seccion1.ambitoOperacion = this.anexoFormulario.controls['s1_ambitoOperacion'].value?.trim()?.toUpperCase();
    dataGuardar.metaData.seccion1.paisesOperar = this.anexoFormulario.controls['s1_paisesOperar'].value.map(item => {
      return {
        value: item.value,
        text: item.text,
        _checked: item.checked
      } as PaisResponse
    });
    //-------------------------------------    
    //SECCION 2:
    dataGuardar.metaData.seccion2 = this.listaFlotaVehicular;
    //-------------------------------------    
    //SECCION 3:
    const bloqueadoSeccion3 = this.desactivarPanel('seccion3');

    dataGuardar.metaData.seccion3.nombreUsuario = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_nombreUsuario'].value;
    dataGuardar.metaData.seccion3.numeroDocumento = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_numeroDocumento'].value;
    dataGuardar.metaData.seccion3.razonSocial = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_empresa'].value;
    dataGuardar.metaData.seccion3.partidaRegistral = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_poderInscrito'].value;
    dataGuardar.metaData.seccion3.domicilio = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_domicilio'].value;
    dataGuardar.metaData.seccion3.dia = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_dia'].value;
    dataGuardar.metaData.seccion3.mes = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_mes'].value;
    dataGuardar.metaData.seccion3.anio = !this.habilitarSeccion3 ? '' : this.anexoFormulario.controls['s3_anio'].value;

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
                console.log("ARCHIVO NUEVO:"+this.uriArchivo);
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
