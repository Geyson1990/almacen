import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anexo001_C17Request } from 'src/app/core/models/Anexos/Anexo001_C17/Anexo001_C17Request';
import { Anexo001_C17Response } from 'src/app/core/models/Anexos/Anexo001_C17/Anexo001_C17Response';
import { A001_C17_Seccion3 } from 'src/app/core/models/Anexos/Anexo001_C17/Secciones';
import { PaisResponse } from 'src/app/core/models/Maestros/PaisResponse';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { TipoSolicitudModel } from 'src/app/core/models/TipoSolicitudModel';
import { TripulacionModel } from 'src/app/core/models/TripulacionModel';
import { Anexo001C17Service } from 'src/app/core/services/anexos/anexo001-c17.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'app-anexo001-c17',
  templateUrl: './anexo001-c17.component.html',
  styleUrls: ['./anexo001-c17.component.css']
})
export class Anexo001C17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;

  idAnexo: number = 0;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  indexEditTabla: number = -1;
  listaPaises: PaisResponse[] = [];
  listaTripulacion: TripulacionModel[] = [];
  listaFlotaVehicular: A001_C17_Seccion3[] = [];

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: "1", documento: 'DNI' },
    { id: "2", documento: 'Carné de Extranjería' }
  ];
  caf_vinculado: string = '';

  filePdfCafSeleccionado: any = null;
  filePdfCafPathName: string = null;

  visibleButtonCarf: boolean = false;

  fechaMinimaInicio: Date = (new Date()).addDays(1);
  fechaMinimaConclusion: Date = (new Date()).addDays(2);

  anexoFormulario: UntypedFormGroup;

  @ViewChild('acc') acc: NgbAccordionDirective ;

  //CODIGO Y NOMBRE DEL PROCEDIMIENTO:
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;

  paSeccion1: string[]=["DSTT-019","DSTT-020","DSTT-024","DSTT-026"];
  paSeccion2: string[]=["DSTT-026"];
  paSeccion3: string[]=["DSTT-019","DSTT-020","DSTT-026","DSTT-027"];

  habilitarSeccion1:boolean=true;
  habilitarSeccion2:boolean=true;
  habilitarSeccion3:boolean=true;
  
  paTipoServicio = [
    {"pa":"DSTT-019","tipoServicio":"15"},
    {"pa":"DSTT-020","tipoServicio":"15"},
    {"pa":"DSTT-024","tipoServicio":"15"},
    {"pa":"DSTT-026","tipoServicio":"15"},
    {"pa":"DSTT-026","tipoServicio":"20"},
    {"pa":"DSTT-027","tipoServicio":"0"},
    {"pa":"DSTT-027","tipoServicio":"1"},
    {"pa":"DSTT-027","tipoServicio":"2"},
    {"pa":"DSTT-027","tipoServicio":"3"},
    {"pa":"DSTT-027","tipoServicio":"4"},
    {"pa":"DSTT-027","tipoServicio":"5"},
    {"pa":"DSTT-027","tipoServicio":"6"},
    {"pa":"DSTT-027","tipoServicio":"7"},
    {"pa":"DSTT-027","tipoServicio":"8"},
    {"pa":"DSTT-027","tipoServicio":"9"},
    {"pa":"DSTT-027","tipoServicio":"10"},
    {"pa":"DSTT-027","tipoServicio":"11"},
    {"pa":"DSTT-027","tipoServicio":"12"},
    {"pa":"DSTT-027","tipoServicio":"13"},
    {"pa":"DSTT-027","tipoServicio":"14"},
    {"pa":"DSTT-027","tipoServicio":"15"},
    {"pa":"DSTT-027","tipoServicio":"16"},
    {"pa":"DSTT-027","tipoServicio":"17"},
    {"pa":"DSTT-027","tipoServicio":"18"},
    {"pa":"DSTT-027","tipoServicio":"19"},
    {"pa":"DSTT-027","tipoServicio":"20"},
    {"pa":"DSTT-027","tipoServicio":"21"},
    {"pa":"DSTT-027","tipoServicio":"22"},
    ];
  tipoServicio: string="";

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo001C17Service,
    private paisService: PaisService,
    private vehiculoService: VehiculoService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
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

    console.log("Tipo de Solicitud:"+this.dataInput.tipoSolicitud.codigo);
    console.log(this.dataInput);
    console.log(this.dataRequisitosInput);

    //if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion1.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion1=true; else this.habilitarSeccion1=false;
    if(this.paSeccion2.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion2=true; else this.habilitarSeccion2=false;
    if(this.paSeccion3.indexOf(this.codigoProcedimientoTupa)>-1) this.habilitarSeccion3=true; else this.habilitarSeccion3=false;

    this.uriArchivo = this.dataInput.rutaDocumento;

    this.anexoFormulario = this.fb.group({
      s1_ambitoOperacion: this.fb.control('', [Validators.required]),

      s1_paisesOperar: this.fb.array([], this.paisesOperarValidator()),
      s1_rutas: this.fb.group({}),
      
      tipoDocumentoForm: this.fb.control(''),
      numeroDocumentoForm: this.fb.control(''),

      s2_fechaInicioViaje: (this.habilitarSeccion2 ? this.fb.control('', [Validators.required]) : this.fb.control('')),
      s2_fechaConclusionViaje: (this.habilitarSeccion2 ? this.fb.control('', [Validators.required]) : this.fb.control('')) ,// this.fb.control('', [Validators.required]),
      s2_rutaAutorizada: (this.habilitarSeccion2 ? this.fb.control('',[Validators.required]) : this.fb.control('')),

      placaRodajeForm: this.fb.control(''),
      soatForm: this.fb.control(''),
      citvForm: this.fb.control(''),
      anioFabForm: this.fb.control(''),
      chasisForm: this.fb.control(''),
      cafForm: this.fb.control(false),
      vinculadoForm: this.fb.control(false),
      marcaForm: this.fb.control(''),
      modeloForm: this.fb.control(''),
    });

    if (this.dataInput.tipoSolicitud.codigo == 5 &&   this.dataInput.tupaId == 886) {//DSTT-024 PASAJEROS

      this.anexoFormulario.controls['s2_fechaInicioViaje'].setValidators(null);
      this.anexoFormulario.controls['s2_fechaInicioViaje'].updateValueAndValidity();

      this.anexoFormulario.controls['s2_fechaConclusionViaje'].setValidators(null);
      this.anexoFormulario.controls['s2_fechaConclusionViaje'].updateValueAndValidity();

      this.anexoFormulario.controls['s2_rutaAutorizada'].setValidators(null);
      this.anexoFormulario.controls['s2_rutaAutorizada'].updateValueAndValidity();
    }

    if (this.dataInput.tipoSolicitud.codigo == 5 && this.dataInput.tupaId === 889) {//DSTT-027 Pasajeros 

      this.anexoFormulario.controls['s1_ambitoOperacion'].setValidators(null);
      this.anexoFormulario.controls['s1_ambitoOperacion'].updateValueAndValidity();

      this.anexoFormulario.controls['s1_paisesOperar'].setValidators(null);
      this.anexoFormulario.controls['s1_paisesOperar'].updateValueAndValidity();

      this.anexoFormulario.controls['s2_fechaInicioViaje'].setValidators(null);
      this.anexoFormulario.controls['s2_fechaInicioViaje'].updateValueAndValidity();

      this.anexoFormulario.controls['s2_fechaConclusionViaje'].setValidators(null);
      this.anexoFormulario.controls['s2_fechaConclusionViaje'].updateValueAndValidity();

      this.anexoFormulario.controls['s2_rutaAutorizada'].setValidators(null);
      this.anexoFormulario.controls['s2_rutaAutorizada'].updateValueAndValidity();

    }

    setTimeout(() => {
      if(this.habilitarSeccion1===true){
        this.acc.expand('anexo001-c17-seccion-1');
      }else{
        this.acc.collapse('anexo001-c17-seccion-1');
        document.querySelector('button[aria-controls=anexo001-c17-seccion-1]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion2===true){
        this.acc.expand('anexo001-c17-seccion-2');
      }else{
        this.acc.collapse('anexo001-c17-seccion-2');
        document.querySelector('button[aria-controls=anexo001-c17-seccion-2]').parentElement.parentElement.classList.add('acordeon-bloqueado');
      }

      if(this.habilitarSeccion3===true){
        this.acc.expand('anexo001-c17-seccion-3');
      }else{
        this.acc.collapse('anexo001-c17-seccion-3');
        document.querySelector('button[aria-controls=anexo001-c17-seccion-3]').parentElement.parentElement.classList.add('acordeon-bloqueado');
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

  desactivarPanel(seccion: string) {

    switch (seccion) {
      case 'seccion1':

        if (this.dataInput.tipoSolicitud.codigo == 5 && //Pasajeros
          this.dataInput.tupaId === 889) {//DSTT-027
          return true;
        }
        break;
      case 'seccion2':
        if (this.dataInput.tipoSolicitud.codigo == 5 && //Pasajeros
          this.dataInput.tupaId === 889) {//DSTT-027
          return true;
        }

        if (this.dataInput.tipoSolicitud.codigo == 5 && //Pasajeros
          this.dataInput.tupaId === 886) {//DSTT-024
          return true;
        }

        if (!this.habilitarSeccion2) return true;
        break;
      case 'seccion3':
        if (this.dataInput.tipoSolicitud.codigo == 5 && //Pasajeros
          this.dataInput.tupaId === 886) {//DSTT-024
          return true;
        }

        break;
    }

    return false;
  }

  deshabilitarButtonGuardarModificar() {

    if (this.dataInput.tipoSolicitud.codigo == 5 &&//PASAJEROS
      this.dataInput.tupaId == 886) {//DSTT-024

      return this.anexoFormulario.invalid ||
        this.indexEditTabla !== -1;
    }

    if (this.dataInput.tipoSolicitud.codigo == 5 && //Pasajeros
      this.dataInput.tupaId === 889) {//DSTT-027

      return this.anexoFormulario.invalid ||
        this.indexEditTabla !== -1;

    }

    if (!this.habilitarSeccion2){
      return this.anexoFormulario.invalid ||
      this.listaFlotaVehicular.length === 0 ||
      this.indexEditTabla !== -1;
    }

    return this.anexoFormulario.invalid ||
      this.listaTripulacion.length === 0 ||
      this.listaFlotaVehicular.length === 0 ||
      this.indexEditTabla !== -1;
  }

  formInvalid(control: string) {
    return this.anexoFormulario.get(control).invalid &&
      (this.anexoFormulario.get(control).dirty || this.anexoFormulario.get(control).touched);
  }

  formInvalidForm(group: any, control: string) {
    return group.get(control).invalid &&
      (group.get(control).dirty || group.get(control).touched);
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

            (this.anexoFormulario.get('s1_rutas') as UntypedFormGroup).addControl(item.text,
              this.fb.group({
                ruta: this.fb.control(''),// [Validators.required]),
                itinerario: this.fb.control(''),// [Validators.required]),
                //frecuencia: this.fb.control(''),// [Validators.required]),
                numeroFrecuencia: this.fb.control(''),// [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{0,1}?$/)]),
              }));
          });

          if (this.dataInput.movId > 0) {
            //RECUPERAMOS LOS DATOS
            this.funcionesMtcService.mostrarCargando();
            this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
              (dataAnexo: Anexo001_C17Response) => {
                this.funcionesMtcService.ocultarCargando();

                const metaData: any = JSON.parse(dataAnexo.metaData);

                this.idAnexo = dataAnexo.anexoId;
                let i = 0;

                if(this.habilitarSeccion1===true){
                  this.anexoFormulario.get("s1_ambitoOperacion").setValue(metaData.seccion1.ambitoOperacion || "");
                  metaData.seccion1.paisesJson = {}
                  //recorremos los paises:
                  for (i; i < metaData.seccion1.paisesOperar.length; i++) {
                    metaData.seccion1.paisesJson[metaData.seccion1.paisesOperar[i].value] = metaData.seccion1.paisesOperar[i];
                  }

                  i = 0;
                  let contadorRutas = -1;

                  for (let control of this.anexoFormulario.controls["s1_paisesOperar"].value) {
                    if (metaData.seccion1.paisesJson[control.value]) {

                      if (metaData.seccion1.paisesJson[control.value]._checked) {
                        this.anexoFormulario.get("s1_paisesOperar")["controls"][i]['controls']['checked'].setValue(metaData.seccion1.paisesJson[control.value]._checked);

                        contadorRutas++;

                        this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['ruta'].setValue(metaData.seccion1.rutas[contadorRutas].ruta);
                        this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['itinerario'].setValue(metaData.seccion1.rutas[contadorRutas].itinerario);
                        //this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['frecuencia'].setValue(metaData.seccion1.rutas[contadorRutas].frecuencia.split('-')[0].trim());
                        //this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['numeroFrecuencia'].setValue(metaData.seccion1.rutas[contadorRutas].frecuencia.split('-')[1].trim());
                        this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['numeroFrecuencia'].setValue(metaData.seccion1.rutas[contadorRutas].frecuencia.trim());

                        setTimeout(() => {
                          this.anexoFormulario.get("s1_rutas")["controls"][control.text]['controls']['numeroFrecuencia'].enable()
                        }, 500);
                      }
                    }
                    i++;
                  }
                }

                if(this.habilitarSeccion2===true){
                  for (i = 0; i < metaData.seccion2.listaTripulacion.length; i++) {
                    this.listaTripulacion.push({
                      nombres: metaData.seccion2.listaTripulacion[i].nombres,
                      apellidos: metaData.seccion2.listaTripulacion[i].apellidos,
                      tipoDocumento: {
                        id: metaData.seccion2.listaTripulacion[i].tipoDocumento.id,
                        documento: metaData.seccion2.listaTripulacion[i].tipoDocumento.documento
                      },
                      numeroDocumento: metaData.seccion2.listaTripulacion[i].numeroDocumento
                    });
                  }

                  this.anexoFormulario.get("s2_fechaInicioViaje").setValue(metaData.seccion2.fechaInicioViaje ? new Date(metaData.seccion2.fechaInicioViaje) : "");
                  this.anexoFormulario.get("s2_fechaConclusionViaje").setValue(metaData.seccion2.fechaConclusionViaje ? new Date(metaData.seccion2.fechaConclusionViaje) : "");
                  this.anexoFormulario.get("s2_rutaAutorizada").setValue(metaData.seccion2.rutaAutorizada || "");
                }

                if(this.habilitarSeccion3===true) {
                  for (i = 0; i < metaData.seccion3.length; i++) {
                    this.listaFlotaVehicular.push({
                      placaRodaje: metaData.seccion3[i].placaRodaje,
                      soat: metaData.seccion3[i].soat,
                      citv: metaData.seccion3[i].citv,
                      caf: metaData.seccion3[i].caf,
                      vinculado: metaData.seccion3[i].vinculado,
                      anioFabricacion: metaData.seccion3[i].anioFabricacion,
                      chasis: metaData.seccion3[i].chasis,
                      marca: metaData.seccion3[i].marca,
                      modelo: metaData.seccion3[i].modelo,
                      file: null,
                      pathName: metaData.seccion3[i].pathName
                    });
                  }
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
          this.funcionesMtcService.ocultarCargando();
          this.funcionesMtcService.mensajeError('Problemas para cargar paises');
        }
      );

    // const paisBolivia: SelectionModel = { id: 2, descripcion: 'Bolivia' } as SelectionModel;
    // const paisColombia: SelectionModel = { id: 1, descripcion: 'Colombia' } as SelectionModel;
    // const paisEcuador: SelectionModel = { id: 3, descripcion: 'Ecuador' } as SelectionModel;
    // const paisPeru: SelectionModel = { id: 4, descripcion: 'Perú' } as SelectionModel;

    // this.listaPaises.push(paisBolivia);
    // this.listaPaises.push(paisColombia);
    // this.listaPaises.push(paisEcuador);
    // this.listaPaises.push(paisPeru);
  }

  validarCheckPais(item: any) {
    let pais = item.key;
    for (let control of this.anexoFormulario.get('s1_paisesOperar')['controls']) {
      if (control.controls['text'].value === pais && control.controls['checked'].value === true)
        return true;
    }

    item.value.get('ruta').setValue('');
    item.value.get('itinerario').setValue('');
    //item.value.get('frecuencia').setValue('');
    item.value.get('numeroFrecuencia').setValue('');

    return false;
  }

  getMaxLengthNumeroDocumento() {
    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();

    if (tipoDocumento === '1')//DNI
      return 8;
    else if (tipoDocumento === '2')//CE
      return 12;
    return 0
  }

  changeTipoDocumento() {
    this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
  }

  agregarTripulacion() {
    const tipoDocumento: string = this.anexoFormulario.controls['tipoDocumentoForm'].value.trim();
    const numeroDocumento: string = this.anexoFormulario.controls['numeroDocumentoForm'].value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '1' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    this.funcionesMtcService.mostrarCargando();

    if (tipoDocumento === '1') {//DNI
      this.reniecService.getDni(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          this.addTripulacion(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer + ' ' + datosPersona.apSegundo,
            numeroDocumento);
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    } else if (tipoDocumento === '2') {//CARNÉ DE EXTRANJERÍA
      this.extranjeriaService.getCE(numeroDocumento).subscribe(
        respuesta => {
          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');

          this.addTripulacion(tipoDocumento,
            respuesta.CarnetExtranjeria.nombres,
            respuesta.CarnetExtranjeria.primerApellido + ' ' + respuesta.CarnetExtranjeria.segundoApellido,
            numeroDocumento);

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Error al consultar al servicio');
        }
      );
    }
  }

  addTripulacion(tipoDocumento: string, nombres: string, apellidos: string, numeroDocumento: string) {

    //buscamos si el documento ya existe en la grilla:
    const indexFind = this.listaTripulacion.findIndex(item => item.tipoDocumento.id === tipoDocumento && item.numeroDocumento === numeroDocumento);

    if (indexFind !== -1) {
      if (indexFind !== this.indexEditTabla)
        return this.funcionesMtcService.mensajeError('El tipo y número de documento ya existen. No pueden ser agregados');
    }

    this.funcionesMtcService.mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '1' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres + ' ' + apellidos}. ¿Está seguro de agregarlo?`)
      .then(() => {
        this.listaTripulacion.push({
          nombres: nombres,
          apellidos: apellidos,
          tipoDocumento: {
            id: tipoDocumento,
            documento: this.listaTiposDocumentos.filter(item => item.id == tipoDocumento)[0].documento
          },
          numeroDocumento: numeroDocumento
        });

        this.anexoFormulario.controls['tipoDocumentoForm'].setValue('');
        this.anexoFormulario.controls['numeroDocumentoForm'].setValue('');
      });
  }

  changePlacaRodaje() {
    this.anexoFormulario.controls['soatForm'].setValue('');
    this.anexoFormulario.controls['citvForm'].setValue('');
    this.anexoFormulario.controls['anioFabForm'].setValue('');
    this.anexoFormulario.controls['chasisForm'].setValue('');
    this.anexoFormulario.controls['marcaForm'].setValue('');
    this.anexoFormulario.controls['modeloForm'].setValue('');
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
        if (respuesta.soat.estado === '')
          return this.funcionesMtcService.mensajeError('La placa de rodaje ingresada no cuenta con SOAT');
        if (respuesta.soat.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de SOAT del vehículo no se encuentra VIGENTE');
        if (respuesta.citv.estado !== 'VIGENTE')
          return this.funcionesMtcService.mensajeError('El número de CITV del vehículo no se encuentra VIGENTE');
        
        */
        //if (respuesta.citv.tipoId != '15')
        //   return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        /*if (this.paTipoServicio.find(i => i.pa === this.codigoProcedimientoTupa && i.tipoServicio==respuesta.citv.tipoId)==undefined){
          return this.funcionesMtcService.mensajeError('El número de CITV no es para el servicio ofertado');
        }*/

        if(respuesta.categoria===""){
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

        const fechaActual = new Date();
        const anioModelo = parseInt(respuesta.anioModelo) || 0;
        const anioFabricacion = parseInt(respuesta.anioFabricacion) || 0;
        const anioVerifico = anioModelo >= anioFabricacion ? anioModelo : anioFabricacion;

        if (fechaActual.getFullYear() - anioVerifico > 12) {
          return this.funcionesMtcService.mensajeError('El vehículo cuenta con más de 12 años de antigüedad desde su fabricación'); 
        }
/*
        this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero || '(FALTANTE)');
        this.anexoFormulario.controls['citvForm'].setValue(respuesta.citv.numero || '(FALTANTE)');*/

        this.anexoFormulario.controls['anioFabForm'].setValue(anioVerifico || '(FALTANTE)');
        this.anexoFormulario.controls['chasisForm'].setValue(respuesta.chasis || '(FALTANTE)');
        this.anexoFormulario.controls['marcaForm'].setValue(respuesta.marca || '(FALTANTE)');
        this.anexoFormulario.controls['modeloForm'].setValue(respuesta.modelo || '(FALTANTE)');
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
      }
    );
  }

  onChangeFrecuencia(event, inputFrecuencia, controlForm) {
    if (event.target.value === '') {
      inputFrecuencia.disabled = true;
      controlForm.setValue('');
    } else {
      inputFrecuencia.disabled = false;
      inputFrecuencia.focus();
    }
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

  cancelarFlotaVehicular() {
    this.indexEditTabla = -1;

    this.anexoFormulario.controls['placaRodajeForm'].setValue('');
    this.anexoFormulario.controls['soatForm'].setValue('');
    this.anexoFormulario.controls['citvForm'].setValue('');
    this.anexoFormulario.controls['cafForm'].setValue(false);
    this.anexoFormulario.controls['vinculadoForm'].setValue(false);
    this.anexoFormulario.controls['anioFabForm'].setValue('');
    this.anexoFormulario.controls['chasisForm'].setValue('');
    this.anexoFormulario.controls['marcaForm'].setValue('');
    this.anexoFormulario.controls['modeloForm'].setValue('');

    this.filePdfCafSeleccionado = null;
    this.filePdfCafPathName = null;
    this.caf_vinculado = '';
    this.visibleButtonCarf = false;
  }

  agregarFlotaVehicular() {
    if (
      this.anexoFormulario.controls['placaRodajeForm'].value.trim() === '' ||
      this.anexoFormulario.controls['soatForm'].value.trim() === '' ||
      this.anexoFormulario.controls['citvForm'].value.trim() === '' ||
      this.anexoFormulario.controls['anioFabForm'].value.toString().trim() === '' ||
      this.anexoFormulario.controls['chasisForm'].value.trim() === '' ||
      this.anexoFormulario.controls['marcaForm'].value.trim() === '' ||
      this.anexoFormulario.controls['modeloForm'].value.trim() === ''
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
        anioFabricacion: this.anexoFormulario.controls['anioFabForm'].value,
        chasis: this.anexoFormulario.controls['chasisForm'].value,
        marca: this.anexoFormulario.controls['marcaForm'].value,
        modelo: this.anexoFormulario.controls['modeloForm'].value,
        file: this.filePdfCafSeleccionado
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].vinculado = this.anexoFormulario.controls['vinculadoForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].anioFabricacion = this.anexoFormulario.controls['anioFabForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].chasis = this.anexoFormulario.controls['chasisForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].marca = this.anexoFormulario.controls['marcaForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].modelo = this.anexoFormulario.controls['modeloForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].file = this.filePdfCafSeleccionado;
    }

    this.cancelarFlotaVehicular();
  }

  soloNumeros(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  verPdfCafGrilla(item: A001_C17_Seccion3) {
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

    // const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    // const urlPdf = URL.createObjectURL(item.file);
    // modalRef.componentInstance.pdfUrl = urlPdf;
    // modalRef.componentInstance.titleModal = "Vista Previa - " + (item.caf === true ? 'CAF' : 'Vinculado');
  }

  visualizarGrillaPdf(file: File, placaRodaje: string) {
    const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
    const urlPdf = URL.createObjectURL(file);
    modalRef.componentInstance.pdfUrl = urlPdf;
    modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + placaRodaje;
  }

  modificarFlotaVehicular(item: A001_C17_Seccion3, index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['placaRodajeForm'].setValue(item.placaRodaje);
    this.anexoFormulario.controls['soatForm'].setValue(item.soat);
    this.anexoFormulario.controls['citvForm'].setValue(item.citv);
    this.anexoFormulario.controls['cafForm'].setValue(item.caf);

    this.visibleButtonCarf = item.caf === true || item.vinculado === true ? true : false;

    this.anexoFormulario.controls['vinculadoForm'].setValue(item.vinculado);
    this.anexoFormulario.controls['anioFabForm'].setValue(item.anioFabricacion);
    this.anexoFormulario.controls['chasisForm'].setValue(item.chasis);
    this.anexoFormulario.controls['marcaForm'].setValue(item.marca);
    this.anexoFormulario.controls['modeloForm'].setValue(item.modelo);

    this.filePdfCafSeleccionado = item.file;
    this.filePdfCafPathName = item.pathName;
  }

  eliminarTripulacion(index) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.listaTripulacion.splice(index, 1);
      });
  }

  eliminarFlotaVehicular(item: A001_C17_Seccion3, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
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
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 001-C/17";
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para descargar Pdf');
        }
      );
  }

  guardarAnexo() {
    const bloqueadoSeccion2 = this.desactivarPanel('seccion2');
    const bloqueadoSeccion3 = this.desactivarPanel('seccion3');

    if (this.anexoFormulario.invalid === true)
      return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

    if (this.habilitarSeccion2 === true) {
      if (this.anexoFormulario.controls['s2_fechaInicioViaje'].value >= this.anexoFormulario.controls['s2_fechaConclusionViaje'].value)
        return this.funcionesMtcService.mensajeError('La fecha de inicio del viaje debe ser menor a la fecha de conclusión del viaje');
    }

    if (this.habilitarSeccion3 === true) {
      if (this.codigoProcedimientoTupa==="DSTT-019"){
        if (this.listaFlotaVehicular.length < 3)
        return this.funcionesMtcService.mensajeError('Debe ingresar al menos 3 flotas vehiculares');
      }
      else{
        if (this.listaFlotaVehicular.length === 0)
        return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');
      }
    }

    let mensajeErrorPermisoOriginario = '';
    let ruta = ''
    let itinerario = ''
    let frecuencia = ''
    let numeroFrecuencia = '';
    let dataGuardar: Anexo001_C17Request = new Anexo001_C17Request();
    //-------------------------------------    
    dataGuardar.id = this.idAnexo;
    dataGuardar.movimientoFormularioId = this.dataInput.tramiteReqRefId;
    dataGuardar.anexoId = 1;
    dataGuardar.codigo = "C";
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    //-------------------------------------  
    dataGuardar.metaData.tipoSolicitud = {
      codigo: this.dataInput.tipoSolicitud.codigo,
      descripcion: this.dataInput.tipoSolicitud.descripcion
    } as TipoSolicitudModel
    //-------------------------------------  
    //SECCION 1:
    if(this.habilitarSeccion1===true){
      dataGuardar.metaData.seccion1.ambitoOperacion = this.anexoFormulario.controls['s1_ambitoOperacion'].value?.trim()?.toUpperCase();
      dataGuardar.metaData.seccion1.paisesOperar =
        this.anexoFormulario.controls['s1_paisesOperar'].value.map(item => {
          if (item.checked === true) {
            if (mensajeErrorPermisoOriginario === '') {

              ruta = this.anexoFormulario.get('s1_rutas')['controls'][item.text].controls['ruta'].value.trim();
              itinerario = this.anexoFormulario.get('s1_rutas')['controls'][item.text].controls['itinerario'].value.trim();
              //frecuencia = this.anexoFormulario.get('s1_rutas')['controls'][item.text].controls['frecuencia'].value.trim();
              frecuencia = '';
              numeroFrecuencia = this.anexoFormulario.get('s1_rutas')['controls'][item.text].controls['numeroFrecuencia'].value.trim();

              if (ruta.length > 0 && itinerario.length > 0 && numeroFrecuencia.length > 0) { //&& frecuencia.length > 0 
                dataGuardar.metaData.seccion1.rutas.push(
                  {
                    ruta,
                    itinerario,
                    frecuencia: numeroFrecuencia//frecuencia + ' - ' + numeroFrecuencia
                  }
                );
              } else {
                mensajeErrorPermisoOriginario = 'Debe ingresar información en Ruta y/o Itinerario y/o Frecuencia para el país ' + item.text;
              }

            }
          }
          return { value: item.value, text: item.text, _checked: item.checked } as PaisResponse
        });
    }else{
      dataGuardar.metaData.seccion1.ambitoOperacion ="";
      dataGuardar.metaData.seccion1.paisesOperar = [];
      dataGuardar.metaData.seccion1.rutas=[];
    }
    
    if (mensajeErrorPermisoOriginario !== '')
      return this.funcionesMtcService.mensajeError(mensajeErrorPermisoOriginario);

    //-------------------------------------    
    if(this.habilitarSeccion2===true){
      dataGuardar.metaData.seccion2.listaTripulacion = this.listaTripulacion;
      dataGuardar.metaData.seccion2.fechaInicioViaje =this.anexoFormulario.controls['s2_fechaInicioViaje'].value.toStringFecha();
      dataGuardar.metaData.seccion2.fechaConclusionViaje = this.anexoFormulario.controls['s2_fechaConclusionViaje'].value.toStringFecha();
      dataGuardar.metaData.seccion2.rutaAutorizada = this.anexoFormulario.controls['s2_rutaAutorizada'].value;
    }else{
      dataGuardar.metaData.seccion2.listaTripulacion = [];
      dataGuardar.metaData.seccion2.fechaInicioViaje ="";
      dataGuardar.metaData.seccion2.fechaConclusionViaje = "";
      dataGuardar.metaData.seccion2.rutaAutorizada = "";
    }
    
    //-------------------------------------  
    if(this.habilitarSeccion3===true){  
      dataGuardar.metaData.seccion3 = this.listaFlotaVehicular;
    }
    else{
      dataGuardar.metaData.seccion3 = [];
    }
    //-------------------------------------    

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
}
