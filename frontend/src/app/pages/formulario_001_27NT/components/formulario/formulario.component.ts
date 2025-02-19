/**
 * Formulario 001/27 (Nuevo TUPA)
 * Procedimientos:
 * @author Ramiro Castro P.
 * @version 1.0
 */
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { TouchSequence } from 'selenium-webdriver';
import { MetaData } from 'src/app/core/models/Formularios/Formulario001_27NT/MetaData';

import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { TipoDocumentoModel } from 'src/app/core/models/TipoDocumentoModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { Formulario001_27Request } from 'src/app/core/models/Formularios/Formulario001_27NT/Formulario001_27Request';
import { Formulario001_27Response } from 'src/app/core/models/Formularios/Formulario001_27NT/Formulario001_27Response';
import { Formulario00127NTService } from 'src/app/core/services/formularios/formulario001-27NT.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { DatosUsuarioLogin } from 'src/app/core/models/Autenticacion/DatosUsuarioLogin';

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

  solicitaPN: boolean=false;
  solicitaPJ: boolean=false;

  formulario: UntypedFormGroup;

  graboUsuario = false;

  id = 0;
  uriArchivo = ''; // PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
  tramiteReqId:number

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  tramiteSelected: string;
  //  codigoTipoSolicitudTupa: string;
  //  descTipoSolicitudTupa: string;

  listaTiposDocumentos: TipoDocumentoModel[] = [
    { id: '01', documento: 'DNI' },
    { id: '04', documento: 'Carnet de Extranjería' },
  ];
  listaRepresentantesLegales: Array<RepresentanteLegal> = [];
  txtTitulo = 'FORMULARIO 001/27 - CONCESIÓN ÚNICA Y SERVICIOS PÚBLICOS DE TELECOMUNICACIONES';

  listaOficinasRegistrales: OficinaRegistralModel[];
  listaDepartamentos:Array<any>
  listaProvincias:Array<any>
  listaDistritos:Array<any>
  listaDepartamentosRep:Array<any>
  listaProvinciasRep:Array<any>
  listaDistritosRep:Array<any>

  disableBtnBuscarRepLegal = false;

  maxLengthNumeroDocumentoRepLeg: number;

  tipoSolicitante: string;
  codTipoDocSolicitante: string; // 01 DNI  03 CI  04 CE
  DatosUsuarioLogin: DatosUsuarioLogin

  constructor(
    private formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private formularioTramiteService: FormularioTramiteService,
    private formularioService: Formulario00127NTService,
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
        this.listaDepartamentosRep = response
      })

      // console.log("DATOS USUARIO LOGIN",this.seguridadService.getDatosUsuarioLogin())
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
        this.setDataPersonaJuridica();
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
        this.formularioTramiteService.get<Formulario001_27Response>(this.tramiteReqId)
        .subscribe((response) => {
          this.funcionesMtcService.ocultarCargando();
          this.id = response.formularioId;
          const metaData = JSON.parse(response.metaData) as MetaData;

          if (this.solicitaPN) {
            this.Nombres.setValue(metaData.seccion3.nombres);
            this.TipoDocSolicitante.setValue(metaData.seccion3.tipoDocumento.id)
            this.NroDocSolicitante.setValue(metaData.seccion3.numeroDocumento);
            this.Telefono.setValue(metaData.seccion3.telefono);
            this.Celular.setValue(metaData.seccion3.celular);
            this.Correo.setValue(metaData.seccion3.email);
          }

          this.Ruc.setValue(metaData.seccion3.ruc);
          this.Domicilio.setValue(metaData.seccion3.domicilioLegal);
          this.setUbigeoText(metaData.seccion3.departamento, metaData.seccion3.provincia, metaData.seccion3.distrito);

          if (this.solicitaPJ) {
            this.RazonSocial.setValue(metaData.seccion3.razonSocial);
            this.TipoDocumentoRep.setValue(metaData.seccion3.representanteLegal.tipoDocumento.id);
            this.NumeroDocumentoRep.setValue(metaData.seccion3.representanteLegal.numeroDocumento);
            this.NombresRep.setValue(metaData.seccion3.representanteLegal.nombres);
            this.ApePaternoRep.setValue(metaData.seccion3.representanteLegal.apellidoPaterno);
            this.ApeMaternoRep.setValue(metaData.seccion3.representanteLegal.apellidoMaterno);
            this.TelefonoRep.setValue(metaData.seccion3.representanteLegal.telefono);
            this.CelularRep.setValue(metaData.seccion3.representanteLegal.celular);
            this.CorreoRep.setValue(metaData.seccion3.representanteLegal.email);
            this.DomicilioRep.setValue(metaData.seccion3.representanteLegal.domicilioLegal);
            this.setUbigeoTextRepresentante(metaData.seccion3.representanteLegal.departamento, metaData.seccion3.representanteLegal.provincia, metaData.seccion3.representanteLegal.distrito);
            this.OficinaRep.setValue(metaData.seccion3.representanteLegal.oficinaRegistral.id);
            this.PartidaRep.setValue(metaData.seccion3.representanteLegal.partida);
            this.AsientoRep.setValue(metaData.seccion3.representanteLegal.asiento);
            console.dir(metaData.seccion3.representanteLegal.oficinaRegistral)
          }

          this.ColegioProfesional.setValue(metaData.seccion3.habilitacionProfesional.colegioProfesional);
          this.NumeroColegiatura.setValue(metaData.seccion3.habilitacionProfesional.numeroColegiatura);
          this.ModalidadNotificacion.setValue(metaData.seccion2.modalidadNotificacion.toString());
          this.Declaracion1.setValue(metaData.seccion4.declaracion1);
          this.Declaracion2.setValue(metaData.seccion4.declaracion2);

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
        })

    } else{

      if(this.solicitaPN) {
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
      }else{

          this.Ruc.setValue(this.rucLogin);

          this.funcionesMtcService.mostrarCargando();

          this.sunatService.getDatosPrincipales(this.rucLogin)
          .subscribe((response) => {
            this.funcionesMtcService.ocultarCargando();

            this.RazonSocial.setValue(response.razonSocial.trim());
            this.Domicilio.setValue(response.domicilioLegal.trim());

            this.setUbigeoText(response.nombreDepartamento.trim(), response.nombreProvincia.trim(), response.nombreDistrito.trim());

            this.listaRepresentantesLegales = response.representanteLegal;

          }, (error) => {
            this.modalService.dismissAll();
            this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');
          })
      }
    }
  }

  setDataPersonaNatural() {
    this.solicitaPN = true;
    this.setFormPN();
  }

  setDataPersonaJuridica() {
    this.solicitaPJ = true;
    this.setFormPJ();
    this.cargarOficinaRegistral();

    this.TipoDocumentoRep?.valueChanges.subscribe((value: string) => {
      if (value?.trim() === '04') {
        this.ApeMaternoRep.clearValidators();
        this.ApeMaternoRep.updateValueAndValidity();
        this.NumeroDocumentoRep.setValidators([Validators.required, exactLengthValidator([9])]);
        this.NumeroDocumentoRep.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.ApeMaternoRep.setValidators([Validators.required]);
        this.ApeMaternoRep.updateValueAndValidity();
        this.NumeroDocumentoRep.setValidators([Validators.required, exactLengthValidator([8])]);
        this.NumeroDocumentoRep.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }

      this.NumeroDocumentoRep.reset('', { emitEvent: false });
      this.NombresRep.reset('', { emitEvent: false });
      this.ApePaternoRep.reset('', { emitEvent: false });
      this.ApeMaternoRep.reset('', { emitEvent: false });
    });
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
      ColegioProfesional: ["", [Validators.required, Validators.maxLength(50)]],
      NumeroColegiatura: ["", [Validators.required, Validators.maxLength(10)]],
      ModalidadNotificacion: ["", [Validators.required]],
      Declaracion1: [false, [Validators.requiredTrue]],
      Declaracion2: [false, [Validators.requiredTrue]]
    });
  }

  setFormPJ() {
    this.formulario = this.formBuilder.group({
      RazonSocial: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
      Ruc: [{value:'', disabled:true}, [Validators.required, exactLengthValidator([11])]],
      Domicilio: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)]],
      Departamento: [{value:'', disabled:true}, [Validators.required]],
      Provincia: [{value:'', disabled:true}, [Validators.required]],
      Distrito: [{value:'', disabled:true}, [Validators.required]],
      TipoDocumentoRep: ['', [Validators.required]],
      NumeroDocumentoRep: ['', [Validators.required]],
      NombresRep: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
      ApePaternoRep: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
      ApeMaternoRep: [{value:'', disabled:true}, [noWhitespaceValidator(), Validators.maxLength(50)]],
      DomicilioRep: [{value:'', disabled:true}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)]],
      DepartamentoRep: [{value:'', disabled:true}, [Validators.required]],
      ProvinciaRep: [{value:'', disabled:true}, [Validators.required]],
      DistritoRep: [{value:'', disabled:true}, [Validators.required]],
      TelefonoRep: ['', [Validators.maxLength(9)]],
      CelularRep: ['', [Validators.required, exactLengthValidator([9])]],
      CorreoRep: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
      PartidaRep: ['', [Validators.required, Validators.maxLength(15)]],
      AsientoRep: ['', [Validators.required, Validators.maxLength(15)]],
      OficinaRep: ['', [Validators.required]],
      ColegioProfesional: ["", [Validators.required, Validators.maxLength(50)]],
      NumeroColegiatura: ["", [Validators.required, Validators.maxLength(10)]],
      ModalidadNotificacion: ["", [Validators.required]],
      Declaracion1: [false, [Validators.requiredTrue]],
      Declaracion2: [false, [Validators.requiredTrue]]
    });
  }

  get Nombres(): AbstractControl { return this.formulario.get(['Nombres']); }
  get TipoDocSolicitante(): AbstractControl { return this.formulario.get(['TipoDocSolicitante']); }
  get NroDocSolicitante(): AbstractControl { return this.formulario.get(['NroDocSolicitante']); }
  get RazonSocial(): AbstractControl { return this.formulario.get(['RazonSocial']); }
  get Ruc(): AbstractControl { return this.formulario.get(['Ruc']); }
  get Telefono(): AbstractControl { return this.formulario.get(['Telefono']); }
  get Celular(): AbstractControl { return this.formulario.get(['Celular']); }
  get Correo(): AbstractControl { return this.formulario.get(['Correo']); }
  get Domicilio(): AbstractControl { return this.formulario.get(['Domicilio']); }
  get Departamento(): AbstractControl { return this.formulario.get(['Departamento']); }
  get Provincia(): AbstractControl { return this.formulario.get(['Provincia']); }
  get Distrito(): AbstractControl { return this.formulario.get(['Distrito']); }

  get TipoDocumentoRep(): AbstractControl { return this.formulario.get(['TipoDocumentoRep']); }
  get NumeroDocumentoRep(): AbstractControl { return this.formulario.get(['NumeroDocumentoRep']); }
  get NombresRep(): AbstractControl { return this.formulario.get(['NombresRep']); }
  get ApePaternoRep(): AbstractControl { return this.formulario.get(['ApePaternoRep']); }
  get ApeMaternoRep(): AbstractControl { return this.formulario.get(['ApeMaternoRep']); }
  get TelefonoRep(): AbstractControl { return this.formulario.get(['TelefonoRep']); }
  get CelularRep(): AbstractControl { return this.formulario.get(['CelularRep']); }
  get CorreoRep(): AbstractControl { return this.formulario.get(['CorreoRep']); }
  get DomicilioRep(): AbstractControl { return this.formulario.get(['DomicilioRep']); }
  get DepartamentoRep(): AbstractControl { return this.formulario.get(['DepartamentoRep']); }
  get ProvinciaRep(): AbstractControl { return this.formulario.get(['ProvinciaRep']); }
  get DistritoRep(): AbstractControl { return this.formulario.get(['DistritoRep']); }
  get PartidaRep(): AbstractControl { return this.formulario.get(['PartidaRep']); }
  get AsientoRep(): AbstractControl { return this.formulario.get(['AsientoRep']); }
  get OficinaRep(): AbstractControl { return this.formulario.get(['OficinaRep']); }

  get ColegioProfesional(): AbstractControl { return this.formulario.get(['ColegioProfesional']); }
  get NumeroColegiatura(): AbstractControl { return this.formulario.get(['NumeroColegiatura']); }
  get ModalidadNotificacion(): AbstractControl { return this.formulario.get(['ModalidadNotificacion']); }

  get Declaracion1(): AbstractControl { return this.formulario.get(['Declaracion1']); }
  get Declaracion2(): AbstractControl { return this.formulario.get(['Declaracion2']); }

  cargarOficinaRegistral(){
    this.funcionesMtcService.mostrarCargando();
    this.oficinaRegistralService.oficinaRegistral().subscribe((response:any) => {
        this.funcionesMtcService.ocultarCargando();
        this.listaOficinasRegistrales = response.map(data => ({ id: data.value, descripcion: data.text } as OficinaRegistralModel) );
    }, (error) => {
      this.modalService.dismissAll()
      this.funcionesMtcService.ocultarCargando().mensajeError('Ocurruió un problema al consultar los datos de las oficinas registrales');
    })
  }

  buscarRepresentanteLegal() {
    const tipoDocumento: string = this.TipoDocumentoRep.value.trim();
    const numeroDocumento: string = this.NumeroDocumentoRep.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
      return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
    if (tipoDocumento === '01' && numeroDocumento.length !== 8)
      return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

    const existe = this.listaRepresentantesLegales.find(r => ('0' + r.tipoDocumento.trim()).toString() === tipoDocumento && r.nroDocumento.trim() === numeroDocumento);

    if (existe) {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {// DNI
        this.reniecService.getDni(numeroDocumento).subscribe((response) => {
          this.funcionesMtcService.ocultarCargando();
          this.listaProvinciasRep = []
          this.listaDistritosRep = []

          if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');

          const {prenombres, apPrimer, apSegundo, direccion, ubigeo} = response.reniecConsultDniResponse.listaConsulta.datosPersona
          this.addRepresentante(prenombres, apPrimer, apSegundo, direccion, ubigeo.split('/')[0], ubigeo.split('/')[1], ubigeo.split('/')[2])

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el servicio de Reniec').then(() => {
            this.funcionesMtcService.mensajeConfirmar("¿Desea agregar los datos manualmente?").then(() => {
              this.NombresRep.enable()
              this.ApePaternoRep.enable()
              this.ApeMaternoRep.enable()
              this.DomicilioRep.enable()
              this.DepartamentoRep.enable()
              this.ProvinciaRep.enable()
              this.DistritoRep.enable()
            })
          });
        });
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        this.extranjeriaService.getCE(numeroDocumento).subscribe((response) => {
          this.funcionesMtcService.ocultarCargando();

          if (response.CarnetExtranjeria.numRespuesta !== '0000')
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones')

          const {nombres, primerApellido, segundoApellido} = response.CarnetExtranjeria
          this.addRepresentante(nombres, primerApellido, segundoApellido, "", "", "", "")

        }, (error) => {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio').then(() => {
            this.funcionesMtcService.mensajeConfirmar("¿Desea agregar los datos manualmente?").then(() => {
              this.NombresRep.enable()
              this.ApePaternoRep.enable()
              this.ApeMaternoRep.enable()
              this.DomicilioRep.enable()
              this.DepartamentoRep.enable()
              this.ProvinciaRep.enable()
              this.DistritoRep.enable()
            })
          });
        })
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  addRepresentante(nombres:string, apePaterno:string, apeMaterno:string, domicilio:string, departamento:string, provincia:string, distrito:string ){
    this.NombresRep.setValue(nombres)
    this.ApePaternoRep.setValue(apePaterno)
    this.ApeMaternoRep.setValue(apeMaterno)
    this.DomicilioRep.setValue(domicilio)

    if(nombres == "") this.NombresRep.enable(); else this.NombresRep.disable()
    if(apePaterno == "") this.ApePaternoRep.enable(); else this.ApePaternoRep.disable()
    if(apeMaterno == "") this.ApeMaternoRep.enable(); else this.ApeMaternoRep.disable()
    if(domicilio == "") this.DomicilioRep.enable(); else this.DomicilioRep.disable()

    if(departamento != "" && provincia != "" && distrito != "")
      this.setUbigeoTextRepresentante(departamento, provincia, distrito)
  }


  // buscarRepresentanteLegal(){
  //   const tipoDocumento: string = this.TipoDocumentoRep.value.trim();
  //   const numeroDocumento: string = this.NumeroDocumentoRep.value.trim();

  //   if (tipoDocumento.length === 0 || numeroDocumento.length === 0)
  //     return this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
  //   if (tipoDocumento === '01' && numeroDocumento.length !== 8)
  //     return this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');

  //   if(this.listaRepresentantesLegales.length === 0){
  //     this.NombresRep.enable()
  //     this.ApePaternoRep.enable()
  //     this.ApeMaternoRep.enable()
  //     this.DomicilioRep.enable()
  //     this.DepartamentoRep.enable()
  //     this.ProvinciaRep.enable()
  //     this.DistritoRep.enable()
  //   }

  //   const resultado = this.listaRepresentantesLegales?.find(rep => ('0' + rep.tipoDocumento.trim()).toString() === tipoDocumento && rep.nroDocumento.trim() === numeroDocumento);

  //   if (resultado || this.tipoSolicitante === 'PNR') {
  //     this.funcionesMtcService.mostrarCargando();

  //     if (tipoDocumento == '01') {// DNI
  //       try {
  //         const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();

  //         this.funcionesMtcService.ocultarCargando();

  //         if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
  //           return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
  //         }

  //         const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
  //         const ubigeo = datosPersona.ubigeo.split('/');

  //         this.addPersona(tipoDocumento,
  //           datosPersona.prenombres,
  //           datosPersona.apPrimer,
  //           datosPersona.apSegundo,
  //           datosPersona.direccion,
  //           ubigeo[2],
  //           ubigeo[1],
  //           ubigeo[0]);
  //       }
  //       catch (e) {
  //         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
  //         this.NombresRep.enable()
  //         this.ApePaternoRep.enable()
  //         this.ApeMaternoRep.enable()
  //         this.DomicilioRep.enable()
  //         this.DepartamentoRep.enable()
  //         this.ProvinciaRep.enable()
  //         this.DistritoRep.enable()
  //       }
  //     } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
  //       try {
  //         const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

  //         this.funcionesMtcService.ocultarCargando();

  //         if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
  //           return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
  //         }

  //         this.addPersona(tipoDocumento,
  //           respuesta.CarnetExtranjeria.nombres,
  //           respuesta.CarnetExtranjeria.primerApellido,
  //           respuesta.CarnetExtranjeria.segundoApellido,
  //           '',
  //           '',
  //           '',
  //           '');
  //       }
  //       catch (e) {
  //         this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
  //         this.NombresRep.enable()
  //         this.ApePaternoRep.enable()
  //         this.ApeMaternoRep.enable()
  //         this.DomicilioRep.enable()
  //         this.DepartamentoRep.enable()
  //         this.ProvinciaRep.enable()
  //         this.DistritoRep.enable()
  //       }
  //     }
  //   } else {
  //     return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
  //   }
  // }


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

  onChangeDepartamentoRep(codDepartamento: string){
    if(codDepartamento != ""){
      this.ubigeoService.provincia(Number(codDepartamento)).subscribe((data) => {
        this.listaProvinciasRep = data;
        this.ProvinciaRep.setValue("");
      });
    }else{
      this.listaProvinciasRep = [];
      this.ProvinciaRep.setValue("");
    }

    this.listaDistritosRep = [];
    this.DistritoRep.setValue("");
  }

  onChangeProvinciaRep(codDepartamento: string, codProvincia: string){
    if(codDepartamento != "" && codProvincia != ""){
      this.ubigeoService.distrito(Number(codDepartamento), Number(codProvincia)).subscribe((data) => {
        this.listaDistritosRep = data;
        this.DistritoRep.setValue("");
      });
    }else{
      this.listaDistritosRep = [];
      this.DistritoRep.setValue("");
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

  setUbigeoTextRepresentante(departamento:string, provincia:string, distrito:string){
    const idxDep = this.listaDepartamentosRep.findIndex(item => this.campareStrings(item.text, departamento));
    if(idxDep > -1){
      const codDepartamento = this.listaDepartamentosRep[idxDep].value;
      this.DepartamentoRep.setValue(codDepartamento);

      this.ubigeoService.provincia(codDepartamento).subscribe((provincias) => {
        this.listaProvinciasRep = provincias;

        //Buscar Provincia
        const idxProv = this.listaProvinciasRep.findIndex(item => this.campareStrings(item.text, provincia));
        if(idxProv > -1){
          const codProvincia = this.listaProvinciasRep[idxProv].value;
          this.ProvinciaRep.setValue(codProvincia);

          this.ubigeoService.distrito(codDepartamento, codProvincia).subscribe((distritos) => {
            this.listaDistritosRep = distritos;

            //Buscar Distritos
            const idxDist = this.listaDistritosRep.findIndex(item => this.campareStrings(item.text, distrito));
            if(idxDist > -1){
              const codDistrito = this.listaDistritosRep[idxDist].value;
              this.DistritoRep.setValue(codDistrito);
            }else{
              this.DistritoRep.enable();
            }
          });
        }else{
          this.ProvinciaRep.enable();
          this.DistritoRep.enable();
        }
      });
    }else{
      this.DepartamentoRep.enable();
      this.ProvinciaRep.enable();
      this.DistritoRep.enable();
    }
  }

  //=========================================================================================================
  //=========================================================================================================

  guardarFormulario() {
    if (this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
    }

    const dataGuardar = new Formulario001_27Request();

    dataGuardar.id = this.id;
    dataGuardar.codigo = 'F001-27';
    dataGuardar.formularioId = 1;
    dataGuardar.codUsuario = this.nroDocumentoLogin;
    dataGuardar.tramiteReqId = this.dataInput.tramiteReqId
    dataGuardar.estado = 1;

    dataGuardar.metaData.unidadOrganica = this.unidadOrganica
    dataGuardar.metaData.seccion1.codigoProcedimiento = this.codigoProcedimientoTupa
    dataGuardar.metaData.seccion2.modalidadNotificacion = this.ModalidadNotificacion.value

    dataGuardar.metaData.seccion3.tipoSolicitante  = this.solicitaPN ? "PN" : "PJ"
    dataGuardar.metaData.seccion3.nombres          = this.solicitaPN ? this.Nombres.value : null
    dataGuardar.metaData.seccion3.tipoDocumento    = this.solicitaPN ? this.listaTiposDocumentos.find(x => x.id === this.idTipoDocumentoIdentidadLogin) : null
    dataGuardar.metaData.seccion3.numeroDocumento  = this.solicitaPN ? this.NroDocSolicitante.value : null
    dataGuardar.metaData.seccion3.ruc              = this.Ruc.value
    dataGuardar.metaData.seccion3.razonSocial      = this.solicitaPJ ? this.RazonSocial.value : null
    dataGuardar.metaData.seccion3.domicilioLegal   = this.Domicilio.value
    dataGuardar.metaData.seccion3.departamento     = this.listaDepartamentos.find(item => item.value === this.Departamento.value).text
    dataGuardar.metaData.seccion3.provincia        = this.listaProvincias.find(item => item.value === this.Provincia.value).text
    dataGuardar.metaData.seccion3.distrito         = this.listaDistritos.find(item => item.value === this.Distrito.value).text
    dataGuardar.metaData.seccion3.telefono         = this.solicitaPN ? this.Telefono.value : null
    dataGuardar.metaData.seccion3.celular          = this.solicitaPN ? this.Celular.value : null
    dataGuardar.metaData.seccion3.email            = this.solicitaPN ? this.Correo.value : null

    dataGuardar.metaData.seccion3.representanteLegal.nombres           = this.solicitaPJ ? this.NombresRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.apellidoPaterno   = this.solicitaPJ ? this.ApePaternoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.apellidoMaterno   = this.solicitaPJ ? this.ApeMaternoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.tipoDocumento     = this.solicitaPJ ? this.listaTiposDocumentos.find(x => x.id === this.TipoDocumentoRep.value) : null
    dataGuardar.metaData.seccion3.representanteLegal.numeroDocumento   = this.solicitaPJ ? this.NumeroDocumentoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.ruc               = null
    dataGuardar.metaData.seccion3.representanteLegal.telefono          = this.solicitaPJ ? this.TelefonoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.celular           = this.solicitaPJ ? this.CelularRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.email             = this.solicitaPJ ? this.CorreoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.domicilioLegal    = this.solicitaPJ ? this.DomicilioRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.departamento      = this.solicitaPJ ? this.listaDepartamentosRep.find(item => item.value === this.DepartamentoRep.value).text : null
    dataGuardar.metaData.seccion3.representanteLegal.provincia         = this.solicitaPJ ? this.listaProvinciasRep.find(item => item.value === this.ProvinciaRep.value).text : null
    dataGuardar.metaData.seccion3.representanteLegal.distrito          = this.solicitaPJ ? this.listaDistritosRep.find(item => item.value === this.DistritoRep.value).text : null
    dataGuardar.metaData.seccion3.representanteLegal.partida           = this.solicitaPJ ? this.PartidaRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.asiento           = this.solicitaPJ ? this.AsientoRep.value : null
    dataGuardar.metaData.seccion3.representanteLegal.oficinaRegistral  = this.solicitaPJ ? this.listaOficinasRegistrales.find(x => x.id === this.OficinaRep.value) : null

    dataGuardar.metaData.seccion3.habilitacionProfesional.colegioProfesional = this.ColegioProfesional.value
    dataGuardar.metaData.seccion3.habilitacionProfesional.numeroColegiatura  = this.NumeroColegiatura.value

    dataGuardar.metaData.seccion4.declaracion1 = this.Declaracion1.value
    dataGuardar.metaData.seccion4.declaracion2 = this.Declaracion2.value
    dataGuardar.metaData.seccion5.nombresFirmante = this.solicitaPN ? this.solicitanteLogin : `${this.NombresRep.value} ${this.ApePaternoRep.value} ${this.ApeMaternoRep.value}`
    dataGuardar.metaData.seccion5.nroDocumentoFirmante = this.DatosUsuarioLogin.nroDocumento

    console.log("dataGuardar", dataGuardar)

    this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.id === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
      .then(async () => {
        if (this.id === 0) {
          this.funcionesMtcService.mostrarCargando();
          // GUARDAR:
          try {
            const data = await this.formularioService.post<any>(dataGuardar).toPromise();
            this.funcionesMtcService.ocultarCargando();
            this.id = data.id;
            this.uriArchivo = data.uriArchivo;
            this.graboUsuario = true;
            this.funcionesMtcService.mensajeOk('Los datos fueron guardados exitosamente');
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
                  const data = await this.formularioService.put<any>(dataGuardar).toPromise();
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
              const data = await this.formularioService.put<any>(dataGuardar).toPromise();
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
      modalRef.componentInstance.titleModal = 'Vista Previa - Formulario 001/27';
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
