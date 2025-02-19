import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective , NgbModal , NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo002E17Service } from 'src/app/core/services/anexos/anexo002-e17.service';
import { Anexo002_E17Request } from 'src/app/core/models/Anexos/Anexo002_E17/Anexo002_E17Request';
import { A002_E17_Seccion1, A002_E17_Seccion2, Vehiculos } from 'src/app/core/models/Anexos/Anexo002_E17/Secciones';
import { VehiculoService } from 'src/app/core/services/servicios/vehiculo.service';
import { Anexo002_E17Response } from 'src/app/core/models/Anexos/Anexo002_E17/Anexo002_E17Response';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { ValidateFileSize_Formulario } from 'src/app/helpers/file';

@Component({
  selector: 'app-anexo002-e17',
  templateUrl: './anexo002-e17.component.html',
  styleUrls: ['./anexo002-e17.component.css']
})
export class Anexo002E17Component implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;
  graboUsuario: boolean = false;
  uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO

  codigoTupa: string = "DSTT-030" ;
  descripcionTupa: string;
  idAnexo: number = 0;
  //titulo:string = "Anexo002-e17";
  indexEditTabla: number = -1;
  anexoFormulario: UntypedFormGroup;
  visibleButtonCaf: boolean = false;
  visibleButtonCao: boolean = false;
  visibleButtonInstalacion: boolean = false;
  filePdfCafSeleccionado: any = null;
  filePdfCaoSeleccionado: any = null;
  pathPdfCafSeleccionado: string = null;
  pathPdfCaoSeleccionado: string = null;
  filePdfInstalacionSeleccionado: any = null;
  pathPdfInstalacionSeleccionado: any = null;
  tipoTransporte: string = "";
  anexoTramiteReqId: number = 0;
  nombreAnexoDependiente:string = "";
  
  paTipoServicio = [
    {"pa":"DSTT-029","tipoServicio":"1"},
    {"pa":"DSTT-030","tipoServicio":"1"},
    {"pa":"DSTT-031","tipoServicio":"22"},//revisar
    {"pa":"DSTT-034","tipoServicio":"15"},
    {"pa":"DSTT-036","tipoServicio":"20"}
   ];

  @ViewChild('acc') acc: NgbAccordionDirective ;

  listaFlotaVehicular: Vehiculos[] = [];

  constructor(private fb: UntypedFormBuilder,
    private funcionesMtcService: FuncionesMtcService,
    private modalService: NgbModal,
    private anexoService: Anexo002E17Service,
    private vehiculoService: VehiculoService,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    public activeModal: NgbActiveModal,
    private formularioTramiteService: FormularioTramiteService,
  ) { }

  ngOnInit(): void {

    this.uriArchivo = this.dataInput.rutaDocumento;
    console.log("DATAAAAAAAAAAAAAAA" , this.dataInput);
    const tramite: any= JSON.parse(localStorage.getItem('tramite-selected'));

    this.codigoTupa = tramite.codigo;
    this.descripcionTupa = tramite.nombre;

    this.anexoFormulario = this.fb.group({

      placaRodajeForm: this.fb.control(''),
      soatForm: this.fb.control(''),
      citvForm: this.fb.control(''),
      cafForm: this.fb.control(false),
      caoForm: this.fb.control(false),

      s1_instalacion: this.fb.control('', [Validators.required]),
      s1_razonSocial: this.fb.control('', [Validators.required]),
      s1_distrito: this.fb.control('', [Validators.required]),
      s1_provincia: this.fb.control('', [Validators.required]),
      s1_departamento: this.fb.control('', [Validators.required]),
      s2_declaracionJurada1: this.fb.control(false, [Validators.requiredTrue]),
      s2_declaracionJurada2: this.fb.control(false, [Validators.requiredTrue]),
      s2_declaracionJurada3: this.fb.control(false, [Validators.requiredTrue]),
      s2_declaracionJurada4: this.fb.control(false, [Validators.requiredTrue]),

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

      if(this.dataRequisitosInput[i].codigoFormAnexo=='ANEXO_002_A17'){
        this.anexoTramiteReqId = this.dataRequisitosInput[i].tramiteReqId;
        if(this.dataRequisitosInput[i].movId=== 0){
          const nombreAnexo = this.dataRequisitosInput[i].codigoFormAnexo.split("_");
          this.nombreAnexoDependiente = nombreAnexo[0] + " " + nombreAnexo[1] + "-" + nombreAnexo[2];
          this.activeModal.close(this.graboUsuario);
          this.funcionesMtcService.mensajeError('Debe completar el ' + this.nombreAnexoDependiente);
          return;
        }
      }
    }

    this.recuperarInformacion();

    setTimeout(() => {
      this.acc.expand('ngb-anexo002-e17');
      this.acc.expand('seccion2');
    });

    this.loadDeclaracionJurada(this.codigoTupa);

    if( this.codigoTupa === "DSTT-036" || this.codigoTupa === "DSTT-034" ){

        this.tipoTransporte = "TRANSPORTE DE MERCANCÍAS";

    }else{

        this.tipoTransporte = "TRANSPORTE DE PASAJEROS";

    }

  }

  loadDeclaracionJurada(codigoTupa: string){

    const s1_instalacion = this.anexoFormulario.controls['s1_instalacion'];
    const s2_declaracionJurada1 = this.anexoFormulario.controls['s2_declaracionJurada1'];
    const s2_declaracionJurada2 = this.anexoFormulario.controls['s2_declaracionJurada2'];
    const s2_declaracionJurada3 = this.anexoFormulario.controls['s2_declaracionJurada3'];
    const s2_declaracionJurada4 = this.anexoFormulario.controls['s2_declaracionJurada4'];

    switch(codigoTupa){

        case 'DSTT-029':

            s2_declaracionJurada1.setValidators(null);
            s2_declaracionJurada3.setValidators(null);

            s1_instalacion.setValidators([Validators.required]);
            s2_declaracionJurada2.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada4.setValidators([Validators.requiredTrue]);

            break;

        case 'DSTT-030':

            s2_declaracionJurada1.setValidators(null);
            s2_declaracionJurada3.setValidators(null);
            s2_declaracionJurada4.setValidators(null);

            s1_instalacion.setValidators([Validators.required]);
            s2_declaracionJurada2.setValidators([Validators.requiredTrue]);

            break;

        case 'DSTT-031':

            s2_declaracionJurada1.setValidators(null);
            s2_declaracionJurada3.setValidators(null);
            s2_declaracionJurada4.setValidators(null);

            s1_instalacion.setValidators([Validators.required]);
            s2_declaracionJurada2.setValidators([Validators.requiredTrue]);

            break;

        case 'DSTT-034':

            s2_declaracionJurada4.setValidators(null);
            s1_instalacion.setValidators(null);

            s2_declaracionJurada1.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada2.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada3.setValidators([Validators.requiredTrue]);

            break;

        case 'DSTT-036':

            s1_instalacion.setValidators(null);

            s2_declaracionJurada1.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada2.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada3.setValidators([Validators.requiredTrue]);
            s2_declaracionJurada4.setValidators([Validators.requiredTrue]);

            break;

    }

    s1_instalacion.updateValueAndValidity();
    s2_declaracionJurada1.updateValueAndValidity();
    s2_declaracionJurada2.updateValueAndValidity();
    s2_declaracionJurada3.updateValueAndValidity();
    s2_declaracionJurada4.updateValueAndValidity();

  }

  descargarPdf() {
    if (this.idAnexo === 0)
      return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

    this.funcionesMtcService.mostrarCargando();

    this.visorPdfArchivosService.get(this.uriArchivo)
      .subscribe(
        (file: Blob) => {
          this.funcionesMtcService.ocultarCargando();

          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
          const urlPdf = URL.createObjectURL(file);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = "Vista Previa - Anexo 002-E/17";
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

    if( this.codigoTupa !== "DSTT-036" && this.codigoTupa !== "DSTT-034" ){

        if(this.anexoFormulario.controls['s1_instalacion'].value === 'alquilada'){
            if (this.filePdfInstalacionSeleccionado === null && this.pathPdfInstalacionSeleccionado === null)
              return this.funcionesMtcService.mensajeError('Debe ingresar el contrato de arrendamiento');
        }

    }

    if (this.listaFlotaVehicular.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar al menos una flota vehicular');


    let dataGuardar: Anexo002_E17Request = new Anexo002_E17Request();
    //-------------------------------------
    dataGuardar.id = this.idAnexo;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId;
    dataGuardar.movimientoFormularioId = 17;
    dataGuardar.anexoId = 2;
    dataGuardar.codigo = "E";

    let seccion1: A002_E17_Seccion1 = new A002_E17_Seccion1();
    seccion1.vehiculos = this.listaFlotaVehicular.map(item => {
      return {
        placaRodaje: item.placaRodaje,
        soat: item.soat,
        citv: item.citv,
        caf: item.caf,
        cao: item.cao,
        fileCaf: item.fileCaf,
        fileCao: item.fileCao,
        pathNameCaf: item.pathNameCaf,
        pathNameCao: item.pathNameCao,
      } as Vehiculos
    });
    seccion1.instalacion = this.anexoFormulario.controls['s1_instalacion'].value;
    seccion1.razonSocial = this.anexoFormulario.controls['s1_razonSocial'].value;
    seccion1.distrito = this.anexoFormulario.controls['s1_distrito'].value;
    seccion1.provincia = this.anexoFormulario.controls['s1_provincia'].value;
    seccion1.departamento = this.anexoFormulario.controls['s1_departamento'].value;
    seccion1.pdfArrendamiento = this.filePdfInstalacionSeleccionado;
    seccion1.pathName = this.pathPdfInstalacionSeleccionado;

    dataGuardar.metaData.seccion1 = seccion1;

    let seccion2: A002_E17_Seccion2 = new A002_E17_Seccion2();
    seccion2.declaracionJurada1 = this.anexoFormulario.controls['s2_declaracionJurada1'].value;
    seccion2.declaracionJurada2 = this.anexoFormulario.controls['s2_declaracionJurada2'].value;
    seccion2.declaracionJurada3 = this.anexoFormulario.controls['s2_declaracionJurada3'].value;
    seccion2.declaracionJurada4 = this.anexoFormulario.controls['s2_declaracionJurada4'].value;
    dataGuardar.metaData.seccion2 = seccion2;

    /*console.log(JSON.stringify(dataGuardar, null, 10));*/
    //console.log(JSON.stringify(dataGuardar));

    const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
    console.log(dataGuardarFormData);
    console.log(dataGuardar);

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexo === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(() => {

        this.funcionesMtcService.mostrarCargando();

        if (this.idAnexo === 0) {
          //GUARDAR:
          try {

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
          } catch(e) {
            console.log(e);
          }
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

  onChangeInputCao(event) {
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

    this.filePdfCaoSeleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeCaf(event: boolean) {
    this.visibleButtonCaf = event;

    if (this.visibleButtonCaf === true) {
      this.visibleButtonCao = false;
      this.filePdfCaoSeleccionado = null;
      this.anexoFormulario.controls['caoForm'].setValue(false);
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCaf = false;
        this.anexoFormulario.controls['cafForm'].setValue(false);
      });
    } else {
      this.filePdfCafSeleccionado = null;
    }
  }

  onChangeCao(event: boolean) {
    this.visibleButtonCao = event;

    if (this.visibleButtonCao === true) {
      this.visibleButtonCaf = false;
      this.filePdfCafSeleccionado = null;
      this.anexoFormulario.controls['cafForm'].setValue(false);
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonCao = false;
        this.anexoFormulario.controls['caoForm'].setValue(false);
      });
    } else {
      this.filePdfCaoSeleccionado = null;
    }
  }

  onChangeInputInstalacion(event) {
    if (event.target.files.length === 0)
      return

    if (event.target.files[0].type !== 'application/pdf') {
      event.target.value = "";
      return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
    }

    this.filePdfInstalacionSeleccionado = event.target.files[0];
    event.target.value = "";
  }

  onChangeRadioInstalacion() {

    const tipoInstalacion = this.anexoFormulario.controls['s1_instalacion'].value;
    this.visibleButtonInstalacion = true;

    if(tipoInstalacion==='alquilada'){
      this.funcionesMtcService.mensajeConfirmar('¿Declaro que la información adjunta en el archivo es verídica?', 'DECLARACIÓN').catch(() => {
        this.visibleButtonInstalacion = false;
        this.anexoFormulario.controls['s1_instalacion'].setValue('');
      });
    } else {
      this.visibleButtonInstalacion = false;
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
        
//        if (placaRodaje !== 'Z6I966') {

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
              if (this.paTipoServicio.find(i => i.pa === this.codigoTupa && i.tipoServicio==placa.tipoId)!=undefined){
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
 //       }

       // this.anexoFormulario.controls['soatForm'].setValue(respuesta.soat.numero);
       // this.anexoFormulario.controls['citvForm'].setValue(respuesta.citv.numero);
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Error al consultar al servicio');
          this.anexoFormulario.controls['soatForm'].enable();
          this.anexoFormulario.controls['citvForm'].enable();
      }
    );
  }

  cancelarFlotaVehicular() {
    this.indexEditTabla = -1;

    this.anexoFormulario.controls['placaRodajeForm'].setValue('');
    this.anexoFormulario.controls['soatForm'].setValue('');
    this.anexoFormulario.controls['citvForm'].setValue('');
    this.anexoFormulario.controls['cafForm'].setValue(false);
    this.anexoFormulario.controls['caoForm'].setValue(false);

    this.filePdfCafSeleccionado = null;
    this.filePdfCaoSeleccionado = null;
    this.visibleButtonCaf = false;
    this.visibleButtonCao = false;
  }

  agregarFlotaVehicular() {

    if (
      this.anexoFormulario.controls['placaRodajeForm'].value.trim() === '' ||
      this.anexoFormulario.controls['soatForm'].value.trim() === '' ||
      this.anexoFormulario.controls['citvForm'].value.trim() === ''
    ) {
      return this.funcionesMtcService.mensajeError('Debe ingresar los campos faltantes');
    }

    if (this.anexoFormulario.controls['cafForm'].value === true && this.filePdfCafSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado C.A.F, debe cargar un archivo PDF');

    if (this.anexoFormulario.controls['caoForm'].value === true && this.filePdfCaoSeleccionado === null)
      return this.funcionesMtcService.mensajeError('A seleccionado C.A.O, debe cargar un archivo PDF');

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
        cao: this.anexoFormulario.controls['caoForm'].value,
        fileCaf: this.filePdfCafSeleccionado,
        fileCao: this.filePdfCaoSeleccionado,
        pathNameCaf: null,
        pathNameCao: null
      });
    } else {
      this.listaFlotaVehicular[this.indexEditTabla].placaRodaje = placaRodaje;
      this.listaFlotaVehicular[this.indexEditTabla].soat = this.anexoFormulario.controls['soatForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].citv = this.anexoFormulario.controls['citvForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].caf = this.anexoFormulario.controls['cafForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].cao = this.anexoFormulario.controls['caoForm'].value;
      this.listaFlotaVehicular[this.indexEditTabla].fileCaf = this.filePdfCafSeleccionado;
      this.listaFlotaVehicular[this.indexEditTabla].fileCao = this.filePdfCaoSeleccionado;
    }

    if(this.filePdfCafSeleccionado!==null){
      this.pathPdfCafSeleccionado = null;
    }

    if(this.filePdfCaoSeleccionado!==null){
      this.pathPdfCaoSeleccionado = null;
    }

    this.cancelarFlotaVehicular();
  }

  modificarFlotaVehicular(item: A002_E17_Seccion1["vehiculos"], index) {
    if (this.indexEditTabla !== -1)
      return;

    this.indexEditTabla = index;

    this.anexoFormulario.controls['placaRodajeForm'].setValue(item["placaRodaje"]);
    this.anexoFormulario.controls['soatForm'].setValue(item["soat"]);
    this.anexoFormulario.controls['citvForm'].setValue(item["citv"]);

    this.anexoFormulario.controls['cafForm'].setValue(item["caf"]);
    this.anexoFormulario.controls['caoForm'].setValue(item["cao"]);
    this.visibleButtonCaf = item["caf"];
    this.visibleButtonCao = item["cao"];

    this.filePdfCafSeleccionado = item["fileCaf"];
    this.filePdfCaoSeleccionado = item["fileCao"];

    this.pathPdfCafSeleccionado = item["pathNameCaf"];
    this.pathPdfCaoSeleccionado = item["pathNameCao"];

  }

  eliminarFlotaVehicular(item: A002_E17_Seccion1, index) {
    if (this.indexEditTabla === -1) {

      this.funcionesMtcService
        .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
        .then(() => {
          this.listaFlotaVehicular.splice(index, 1);
        });
    }
  }

  vistaPreviaCaf() {

    if (this.filePdfCafSeleccionado !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfCafSeleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - CAF";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfCafSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - CAF";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  vistaPreviaCao() {

    if (this.filePdfCaoSeleccionado !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfCaoSeleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - CAO";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfCaoSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - CAO";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  verPdfCafGrilla(item: Vehiculos) {

    if (item.fileCaf !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(item.fileCaf);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
    }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(item.pathNameCaf)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }

  }

  verPdfCaoGrilla(item: Vehiculos) {
    if (item.fileCao !== null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(item.fileCao);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
    }else{
        this.funcionesMtcService.mostrarCargando();

        this.visorPdfArchivosService.get(item.pathNameCao)
          .subscribe(
            (file: Blob) => {
              this.funcionesMtcService.ocultarCargando();

              const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
              const urlPdf = URL.createObjectURL(file);
              modalRef.componentInstance.pdfUrl = urlPdf;
              modalRef.componentInstance.titleModal = "Vista Previa - Placa Rodaje: " + item.placaRodaje;
            },
            error => {
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para descargar Pdf');
            }
          );
    }
  }

  vistaPreviaInstalacion() {
    if (this.pathPdfInstalacionSeleccionado === null){
        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(this.filePdfInstalacionSeleccionado);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
    }else{
      this.funcionesMtcService.mostrarCargando();

      this.visorPdfArchivosService.get(this.pathPdfInstalacionSeleccionado)
        .subscribe(
          (file: Blob) => {
            this.funcionesMtcService.ocultarCargando();

            const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
            const urlPdf = URL.createObjectURL(file);
            modalRef.componentInstance.pdfUrl = urlPdf;
            modalRef.componentInstance.titleModal = "Vista Previa - Contrato de Arrendamiento";
          },
          error => {
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para descargar Pdf');
          }
        );
    }

  }

  recuperarInformacion(){

      //si existe el documento pero no esta completo
      if (this.dataInput.movId > 0 && this.dataInput.completo === false) {
          this.heredarInformacionFormulario();
          this.heredarInformacionAnexo();
          //RECUPERAMOS Y CARGAMOS LOS DATOS DEL ANEXO A EXCEPCION DE LOS CAMPOS HEREDADOS DEL FORMULARIO
          this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
            (dataAnexo: Anexo002_E17Response) => {
              const metaData: any = JSON.parse(dataAnexo.metaData);

              this.idAnexo = dataAnexo.anexoId;

              /*let i = 0;

              for (i = 0; i < metaData.seccion1.vehiculos.length; i++) {
                this.listaFlotaVehicular.push({
                  placaRodaje: metaData.seccion1.vehiculos[i].placaRodaje,
                  soat: metaData.seccion1.vehiculos[i].soat,
                  citv: metaData.seccion1.vehiculos[i].citv,
                  caf: metaData.seccion1.vehiculos[i].caf === true || metaData.seccion1.vehiculos[i].caf === 'true' ? true : false,
                  cao: metaData.seccion1.vehiculos[i].cao === true || metaData.seccion1.vehiculos[i].cao === 'true' ? true : false,
                  pathNameCaf: metaData.seccion1.vehiculos[i].pathNameCaf,
                  pathNameCao: metaData.seccion1.vehiculos[i].pathNameCao,
                  fileCaf: null,
                  fileCao: null
                });
              }*/

              this.pathPdfInstalacionSeleccionado = metaData.seccion1.pathName;

              this.anexoFormulario.get("s1_instalacion").setValue(metaData.seccion1.instalacion);

              if( metaData.seccion1.instalacion === "alquilada" ){

                  this.visibleButtonInstalacion = true;

              }

              this.anexoFormulario.get("s2_declaracionJurada1").setValue(metaData.seccion2.declaracionJurada1);
              this.anexoFormulario.get("s2_declaracionJurada2").setValue(metaData.seccion2.declaracionJurada2);
              this.anexoFormulario.get("s2_declaracionJurada3").setValue(metaData.seccion2.declaracionJurada3);
              this.anexoFormulario.get("s2_declaracionJurada4").setValue(metaData.seccion2.declaracionJurada4);

            },
            error => {
              this.errorAlCargarData = true;
              this.funcionesMtcService
                .ocultarCargando()
                .mensajeError('Problemas para recuperar los datos guardados del anexo');
            });
      }
      //si existe el documento y esta completo
      else if (this.dataInput.movId > 0 && this.dataInput.completo === true) {
        //RECUPERAMOS LOS DATOS DEL ANEXO
        this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
          (dataAnexo: Anexo002_E17Response) => {
            const metaData: any = JSON.parse(dataAnexo.metaData);

            this.idAnexo = dataAnexo.anexoId;

            console.log(JSON.stringify(dataAnexo, null, 10));
            console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

            let i = 0;

            for (i = 0; i < metaData.seccion1.vehiculos.length; i++) {
              this.listaFlotaVehicular.push({
                placaRodaje: metaData.seccion1.vehiculos[i].placaRodaje,
                soat: metaData.seccion1.vehiculos[i].soat,
                citv: metaData.seccion1.vehiculos[i].citv,
                caf: metaData.seccion1.vehiculos[i].caf === true || metaData.seccion1.vehiculos[i].caf === 'true' ? true : false,
                cao: metaData.seccion1.vehiculos[i].cao === true || metaData.seccion1.vehiculos[i].cao === 'true' ? true : false,
                pathNameCaf: metaData.seccion1.vehiculos[i].pathNameCaf,
                pathNameCao: metaData.seccion1.vehiculos[i].pathNameCao,
                fileCaf: null,
                fileCao: null
              });
            }

            this.pathPdfInstalacionSeleccionado = metaData.seccion1.pathName;

            this.anexoFormulario.get("s1_instalacion").setValue(metaData.seccion1.instalacion);
            this.anexoFormulario.get("s1_razonSocial").setValue(metaData.seccion1.razonSocial);
            this.anexoFormulario.get("s1_distrito").setValue(metaData.seccion1.distrito);
            this.anexoFormulario.get("s1_provincia").setValue(metaData.seccion1.provincia);
            this.anexoFormulario.get("s1_departamento").setValue(metaData.seccion1.departamento);

            if( metaData.seccion1.instalacion === "alquilada" ){

                this.visibleButtonInstalacion = true;

            }

            this.anexoFormulario.get("s2_declaracionJurada1").setValue(metaData.seccion2.declaracionJurada1);
            this.anexoFormulario.get("s2_declaracionJurada2").setValue(metaData.seccion2.declaracionJurada2);
            this.anexoFormulario.get("s2_declaracionJurada3").setValue(metaData.seccion2.declaracionJurada3);
            this.anexoFormulario.get("s2_declaracionJurada4").setValue(metaData.seccion2.declaracionJurada4);

          },
          error => {
            this.errorAlCargarData = true;
            this.funcionesMtcService
              .ocultarCargando()
              .mensajeError('Problemas para recuperar los datos guardados del anexo');
          });
      }else{
          //si es un nuevo registro
          this.heredarInformacionFormulario();
          if( this.anexoTramiteReqId > 0 ){
              this.heredarInformacionAnexo();
          }
      }

  }

  heredarInformacionFormulario(){

      this.funcionesMtcService.mostrarCargando();
   //tramiteReqRefId
   console.log("DATAedy", this.dataInput.tramiteReqRefId)
      this.formularioTramiteService.get(this.dataRequisitosInput[0].tramiteReqId).subscribe(
        (dataForm: any) => {

          this.funcionesMtcService.ocultarCargando();
          const metaDataForm: any = JSON.parse(dataForm.metaData);

          console.log("data formulario",JSON.stringify(metaDataForm));

          this.anexoFormulario.controls['s1_razonSocial'].setValue(metaDataForm?.seccion1?.razonSocial);
          this.anexoFormulario.controls['s1_distrito'].setValue(metaDataForm?.seccion1?.distrito);
          this.anexoFormulario.controls['s1_provincia'].setValue(metaDataForm?.seccion1?.provincia);
          this.anexoFormulario.controls['s1_departamento'].setValue(metaDataForm?.seccion1?.departamento);

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );

  }

  heredarInformacionAnexo(){

      this.anexoTramiteService.get<any>(this.anexoTramiteReqId).subscribe(
          (dataAnexo: any) => {

          this.funcionesMtcService.ocultarCargando();

          const metaData: any = JSON.parse(dataAnexo.metaData);

          let i = 0;
          const listaVehiculos = metaData.renat.listaVehiculos;

          for (i = 0; i < listaVehiculos.length; i++) {
            this.listaFlotaVehicular.push({
              placaRodaje: listaVehiculos[i].placaRodaje,
              soat: listaVehiculos[i].soat,
              citv: listaVehiculos[i].citv,
              caf: listaVehiculos[i].caf === true || listaVehiculos[i].caf === 'true' ? true : false,
              cao: listaVehiculos[i].cao === true || listaVehiculos[i].cao === 'true' ? true : false,
              pathNameCaf: listaVehiculos[i].pathNameCaf,
              pathNameCao: listaVehiculos[i].pathNameCao,
              fileCaf: null,
              fileCao: null
            });
          }

        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para recuperar los datos del ' + this.nombreAnexoDependiente);
        });

  }

}
