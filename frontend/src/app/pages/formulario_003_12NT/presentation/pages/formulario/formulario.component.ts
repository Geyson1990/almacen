/**
 * @author Ramiro Castro
 * @version 1.0
 */
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';
import { Formulario00312NTService } from '../../../application';
import { Formulario003_12NTResponse, Formulario003_12NTRequest, MetaData } from '../../../domain';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  @Input() public dataInput: any;
  @Input() public dataRequisitosInput: any;

  unidadOrganica:string
  tipoPersonaLogin: string
  rucLogin: string
  nroDocumentoLogin: string
  solicitanteLogin:string

  idTipoDocumentoIdentidadLogin: string

  formulario: UntypedFormGroup;

  graboUsuario = false;

  id = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];
  txtTitulo = 'FORMULARIO 003/12 - PERSONAL AERONAÚTICO Evaluación Práctica Local - Nacional';

  listaDepartamentos:Array<any>
  listaProvincias:Array<any>
  listaDistritos:Array<any>

  tipoSolicitante: string;
  codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE
  DatosUsuarioLogin: DatosUsuarioLogin

  constructor(
    private formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario00312NTService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private modalService: NgbModal,
    private sunatService: SunatService,
    private ubigeoService: UbigeoService
  ) {
      this.tipoPersonaLogin = this.seguridadService.getNameId();   // tipo de documento usuario login
      this.rucLogin = this.seguridadService.getCompanyCode();
      this.solicitanteLogin = this.seguridadService.getUserName(); //nombre o razon social
      this.nroDocumentoLogin = this.seguridadService.getNumDoc();

      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
      this.unidadOrganica = tramiteSelected.acronimo;

      this.ubigeoService.departamento().subscribe((response) => {
        this.listaDepartamentos = response
      })

      console.log("FormularioComponent", "Formulario 003_12NT")
  }

  ngOnInit(): void {
    console.dir(this.dataInput)
    this.uriArchivo = this.dataInput.rutaDocumento;
    this.id = this.dataInput.movId;
    this.tramiteReqId = this.dataInput.tramiteReqId;
    this.DatosUsuarioLogin = this.seguridadService.getDatosUsuarioLogin()
    console.log("DatosUsuarioLogin", this.DatosUsuarioLogin)

    switch (this.tipoPersonaLogin){
      case "00001": // persona natural
        this.idTipoDocumentoIdentidadLogin = '01';
        this.setDataPersonaNatural();
        break;
      case "00002": // persona juridica
        // this.setDataPersonaJuridica();
        break;
      case "00003": // persona natural juridica
        break;
      case "00004": // persona extranjera
        this.idTipoDocumentoIdentidadLogin = '04';
        this.setDataPersonaNatural();
        break;
      case "00005": // persona natural con ruc
        this.idTipoDocumentoIdentidadLogin = '01';
        this.setDataPersonaNatural();
        break;
      case "00005": // persona juridica o persona natural con ruc
        break;
    }

    if (this.dataInput != null && this.id > 0) {
        this.funcionesMtcService.mostrarCargando();
        this.formularioTramiteService.get<Formulario003_12NTResponse>(this.tramiteReqId)
        .subscribe((response) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = response.formularioId;
          const metaData = JSON.parse(response.metaData) as MetaData;

          this.Nombres.setValue(metaData.seccion3.nombres);
          this.TipoDocSolicitante.setValue(metaData.seccion3.tipoDocumento.documento)
          this.NroDocSolicitante.setValue(metaData.seccion3.numeroDocumento);
          this.Telefono.setValue(metaData.seccion3.telefono);
          this.Celular.setValue(metaData.seccion3.celular);
          this.Correo.setValue(metaData.seccion3.email);
          this.Ruc.setValue(metaData.seccion3.ruc);
          this.Domicilio.setValue(metaData.seccion3.domicilioLegal);
          this.setUbigeoText(metaData.seccion3.departamento, metaData.seccion3.provincia, metaData.seccion3.distrito);

          this.ModalidadNotificacion.setValue(metaData.seccion2.modalidadNotificacion.toString());
          this.Declaracion1.setValue(metaData.seccion4.declaracion1);
          this.Declaracion2.setValue(metaData.seccion4.declaracion2);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos del formulario');
        })

    } else{
        this.Nombres.setValue(this.solicitanteLogin)
        this.TipoDocSolicitante.setValue(this.listaTiposDocumentos.find( item => item.id === this.idTipoDocumentoIdentidadLogin).documento);
        this.NroDocSolicitante.setValue(this.nroDocumentoLogin)
        this.Ruc.setValue(this.rucLogin)

        switch(this.idTipoDocumentoIdentidadLogin){
          case "01":
            this.funcionesMtcService.mostrarCargando();
            this.reniecService.getDni(this.nroDocumentoLogin).subscribe(
              (response) => {
                this.funcionesMtcService.ocultarCargando();

                if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
                  return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

                const {direccion, ubigeo} = response.reniecConsultDniResponse.listaConsulta.datosPersona

                this.Domicilio.setValue(direccion.trim())
                const departamento = ubigeo.split('/')[0].trim()
                const provincia = ubigeo.split('/')[1].trim()
                const distrito = ubigeo.split('/')[2].trim()
                this.setUbigeoText(departamento, provincia, distrito);
              }, (error) => {
                this.modalService.dismissAll();
                this.funcionesMtcService.ocultarCargando().mensajeError('Error al intentar obtener los datos del solicitante')
              }
            );
            break;
          default:
              this.Domicilio.enable()
              this.Departamento.enable()
              this.Provincia.enable()
              this.Distrito.enable()
            break;
        }
    }
  }

  setDataPersonaNatural() {
    this.setFormPN();
  }

  setFormPN() {
    this.formulario = this.formBuilder.group({
      Nombres: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
      TipoDocSolicitante: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
      NroDocSolicitante: [{value:'', disabled:true}, [Validators.required, exactLengthValidator([8, 9])]],
      Ruc: [{value:'', disabled:true}, [Validators.required, exactLengthValidator([11])]],
      Telefono: ['', [Validators.maxLength(9)]],
      Celular: ['', [Validators.required, exactLengthValidator([9])]],
      Correo: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
      Domicilio: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)]],
      Departamento: ['', [Validators.required]],
      Provincia: ['', [Validators.required]],
      Distrito: ['', [Validators.required]],
      ModalidadNotificacion: ["", [Validators.required]],
      Declaracion1: [false, [Validators.requiredTrue]],
      Declaracion2: [false, [Validators.requiredTrue]]
    });
  }

  get Nombres(): AbstractControl { return this.formulario.get(['Nombres']); }
  get TipoDocSolicitante(): AbstractControl { return this.formulario.get(['TipoDocSolicitante']); }
  get NroDocSolicitante(): AbstractControl { return this.formulario.get(['NroDocSolicitante']); }
  get Ruc(): AbstractControl { return this.formulario.get(['Ruc']); }
  get Telefono(): AbstractControl { return this.formulario.get(['Telefono']); }
  get Celular(): AbstractControl { return this.formulario.get(['Celular']); }
  get Correo(): AbstractControl { return this.formulario.get(['Correo']); }
  get Domicilio(): AbstractControl { return this.formulario.get(['Domicilio']); }
  get Departamento(): AbstractControl { return this.formulario.get(['Departamento']); }
  get Provincia(): AbstractControl { return this.formulario.get(['Provincia']); }
  get Distrito(): AbstractControl { return this.formulario.get(['Distrito']); }

  get ModalidadNotificacion(): AbstractControl { return this.formulario.get(['ModalidadNotificacion']); }

  get Declaracion1(): AbstractControl { return this.formulario.get(['Declaracion1']); }
  get Declaracion2(): AbstractControl { return this.formulario.get(['Declaracion2']); }


  onChangeDepartamento(codDepartamento: string){
    if(codDepartamento != ""){
      this.ubigeoService.provincia(Number(codDepartamento)).subscribe((data) => {
        this.listaProvincias = data;
        this.Provincia.setValue("");
      });
    }else{
      this.listaProvincias = [];
      this.Provincia.setValue("");
    }

    this.listaDistritos = [];
    this.Distrito.setValue("");
  }

  onChangeProvincia(codDepartamento: string, codProvincia: string){
    if(codDepartamento != "" && codProvincia != ""){
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritos = data;
        this.Distrito.setValue("");
      });
    }else{
      this.listaDistritos = [];
      this.Distrito.setValue("");
    }
  }

  setUbigeoText(departamento:string, provincia:string, distrito:string){
    const idxDep = this.listaDepartamentos.findIndex(item => this.campareStrings(item.text, departamento));
    if(idxDep > -1){
      const codDepartamento = this.listaDepartamentos[idxDep].value;
      this.Departamento.setValue(codDepartamento);

      this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
        this.listaProvincias = provincias;

        //Buscar Provincia
        const idxProv = this.listaProvincias.findIndex(item => this.campareStrings(item.text, provincia));
        if(idxProv > -1){
          const codProvincia = this.listaProvincias[idxProv].value;
          this.Provincia.setValue(codProvincia);

          this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
            this.listaDistritos = distritos;

            //Buscar Distritos
            const idxDist = this.listaDistritos.findIndex(item => this.campareStrings(item.text, distrito));
            if(idxDist > -1){
              const codDistrito = this.listaDistritos[idxDist].value;
              this.Distrito.setValue(codDistrito);
            }else{
              this.Distrito.enable();
            }
          });
        }else{
          this.Provincia.enable();
          this.Distrito.enable();
        }
      });
    }else{
      this.Departamento.enable();
      this.Provincia.enable();
      this.Distrito.enable();
    }
  }

  //=========================================================================================================
  //=========================================================================================================

  guardarFormulario() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const dataGuardar = new Formulario003_12NTRequest();

    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F003-12';
    dataGuardar.formularioId = 3;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId
    dataGuardar.estado = 1;

    dataGuardar.metaData.seccion1.codigoProcedimiento = this.codigoProcedimientoTupa
    dataGuardar.metaData.seccion2.modalidadNotificacion = this.ModalidadNotificacion.value

    dataGuardar.metaData.seccion3.nombres          = this.Nombres.value
    dataGuardar.metaData.seccion3.tipoDocumento    = this.listaTiposDocumentos.find(x => x.id === this.idTipoDocumentoIdentidadLogin)
    dataGuardar.metaData.seccion3.numeroDocumento  = this.NroDocSolicitante.value
    dataGuardar.metaData.seccion3.ruc              = this.Ruc.value
    dataGuardar.metaData.seccion3.domicilioLegal   = this.Domicilio.value
    dataGuardar.metaData.seccion3.departamento     = this.listaDepartamentos.find(item => item.value === this.Departamento.value).text
    dataGuardar.metaData.seccion3.provincia        = this.listaProvincias.find(item => item.value === this.Provincia.value).text
    dataGuardar.metaData.seccion3.distrito         = this.listaDistritos.find(item => item.value === this.Distrito.value).text
    dataGuardar.metaData.seccion3.telefono         = this.Telefono.value
    dataGuardar.metaData.seccion3.celular          = this.Celular.value
    dataGuardar.metaData.seccion3.email            = this.Correo.value

    dataGuardar.metaData.seccion4.declaracion1 = this.Declaracion1.value
    dataGuardar.metaData.seccion4.declaracion2 = this.Declaracion2.value
    dataGuardar.metaData.seccion5.nombresFirmante = this.solicitanteLogin
    dataGuardar.metaData.seccion5.nroDocumentoFirmante = this.DatosUsuarioLogin.nroDocumento

    console.dir("dataGuardar", dataGuardar)

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            const data = await this.formularioService.post(dataGuardar).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente ');
          }
          catch (e) {
            this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
          }
        } else {
          // Evalua anexos a actualizar
          const listarequisitos = this.dataRequisitosInput;
          let cadenaAnexos = '';
          for (const requisito of listarequisitos) {
            if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
              if (requisito.movId > 0) {
                const nombreAnexo = requisito.codigoFormAnexo.split('_');
                cadenaAnexos += nombreAnexo[0] + ' ' + nombreAnexo[1] + '-' + nombreAnexo[2] + ' ';
              }
            }
          }
          if (cadenaAnexos.length > 0) {
            // ACTUALIZA FORMULARIO Y ANEXOS
            this.funcionesMtcService.mensajeConfirmar('Deberá volver a grabar los anexos ' + cadenaAnexos + '¿Desea continuar?')
              .then(async () => {
                this.funcionesMtcService.mostrarCargando();

                try {
                  const data = await this.formularioService.put(dataGuardar).toPromise();
                  this.funcionesMtcService.ocultarCargando();
                  this.id = data.id;
                  this.uriArchivo = data.uriArchivo;
                  this.graboUsuario = true;
                  this.funcionesMtcService.ocultarCargando().mensajeOk(`Los datos fueron modificados exitosamente`);

                  for (const requisito of listarequisitos) {
                    if (this.dataInput.tramiteReqId === requisito.tramiteReqRefId) {
                      if (requisito.movId > 0) {
                        // ACTUALIZAR ESTADO DEL ANEXO Y LIMPIAR URI ARCHIVO
                        try {
                          await this.formularioTramiteService.uriArchivo<number>(requisito.movId).toPromise();
                        }
                        catch (e) {
                          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de los anexos');
                        }
                      }
                    }
                  }
                }
                catch (e) {
                  this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
                }
              });
          } else {
            // actualiza formulario
            this.funcionesMtcService.mostrarCargando();
            try {
              const data = await this.formularioService.put(dataGuardar).toPromise();
              this.funcionesMtcService.ocultarCargando();
              this.id = data.id;
              this.uriArchivo = data.uriArchivo;
              this.graboUsuario = true;
              this.funcionesMtcService.ocultarCargando();
              this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);
            }
            catch (e) {
              this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
            }
          }
        }
      });
  }

  async descargarPdf(): Promise<void> { // OK
    if (this.id === 0) {
      this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');
      return;
    }

    if (!this.uriArchivo || this.uriArchivo === '' || this.uriArchivo == null) {
      this.funcionesMtcService.mensajeError('No se logró ubicar el archivo PDF');
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    try {
      const file: Blob = await this.visorPdfArchivosService.get(this.uriArchivo).toPromise();
      this.funcionesMtcService.ocultarCargando();

      const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
      const urlPdf = URL.createObjectURL(file);
      modalRef.componentInstance.pdfUrl = urlPdf;
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 003/12';
    }
    catch (e) {
      this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para descargar Pdf');
    }
  }

  formInvalid(control: AbstractControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }

  campareStrings(str1:string, str2:string) {
    const cadena1 = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const cadena2 = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    return cadena1 === cadena2 ? true : false;
  }

}
