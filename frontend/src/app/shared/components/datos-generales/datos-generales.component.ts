import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeccionDatosGenerales } from 'src/app/core/models/Formularios/FormularioMain';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { noWhitespaceValidator, exactLengthValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from '../forms/ubigeo/ubigeo.component';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.css']
})
export class DatosGeneralesComponent implements OnInit, AfterViewInit {

  @Input() formGroup: UntypedFormGroup;

  @ViewChild('ubigeoCmpPerNat') ubigeoPerNatComponent: UbigeoComponent;
  @ViewChild('ubigeoCmpRepLeg') ubigeoRepLegComponent: UbigeoComponent;

  oficinasRegistral: OficinaRegistralModel[];
  maxLengthNumeroDocumentoRepLeg: number;
  representanteLegal: RepresentanteLegal[];
  tipoSolicitante = '';
  cargoRepresentanteLegal = '';
  codTipoDocSolicitante = ''; // 01 DNI  03 CI  04 CE
  nroDocumentoLogin = '';
  disableBtnBuscarRepLegal = false;

  nroRuc = '';
  razonSocial = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
    public tramiteService: TramiteService,
    private oficinaRegistralService: OficinaRegistralService,
    private funcionesMtcService: FuncionesMtcService,
    private seguridadService: SeguridadService,
    private reniecService: ReniecService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      fg_PerNatFG: this.formBuilder.group({
        fg_pn_NombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
        fg_pn_TipoDocSolicitanteFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(20)]],
        fg_pn_NroDocSolicitanteFC: ['', [Validators.required, exactLengthValidator([8, 9])]],
        fg_pn_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
        fg_pn_TelefonoFC: ['', [Validators.maxLength(9)]],
        fg_pn_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
        fg_pn_CorreoFC: ['', [Validators.required, Validators.email, noWhitespaceValidator(), Validators.maxLength(50)]],
        fg_pn_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        fg_pn_DepartamentoFC: ['', [Validators.required]],
        fg_pn_ProvinciaFC: ['', [Validators.required]],
        fg_pn_DistritoFC: ['', [Validators.required]],
      }),
      fg_PerJurFG: this.formBuilder.group({
        fg_pj_RazonSocialFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        fg_pj_RucFC: ['', [Validators.required, exactLengthValidator([11])]],
        fg_pj_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
        fg_pj_DepartamentoFC: ['', [Validators.required]],
        fg_pj_ProvinciaFC: ['', [Validators.required]],
        fg_pj_DistritoFC: ['', [Validators.required]],
        fg_pj_RepLegalFG: this.formBuilder.group({
          fg_pj_rl_TipoDocumentoFC: ['', [Validators.required]],
          fg_pj_rl_NumeroDocumentoFC: ['', [Validators.required]], // at runtime maxlength
          fg_pj_rl_NombreFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
          fg_pj_rl_ApePaternoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50)]],
          fg_pj_rl_ApeMaternoFC: ['', [noWhitespaceValidator(), Validators.maxLength(50)]],
          fg_pj_rl_TelefonoFC: ['', [Validators.maxLength(9)]],
          fg_pj_rl_CelularFC: ['', [Validators.required, exactLengthValidator([9])]],
          fg_pj_rl_CorreoFC: ['', [Validators.required, noWhitespaceValidator(), Validators.email, Validators.maxLength(50)]],
          fg_pj_rl_DomicilioFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]],
          fg_pj_rl_DepartamentoFC: ['', [Validators.required]],
          fg_pj_rl_ProvinciaFC: ['', [Validators.required]],
          fg_pj_rl_DistritoFC: ['', [Validators.required]],
          fg_pj_rl_OficinaFC: ['', [Validators.required]],
          fg_pj_rl_PartidaFC: ['', [Validators.required, Validators.maxLength(15)]],
          fg_pj_rl_AsientoFC: ['', [Validators.required, Validators.maxLength(15)]],
        }),
      }),
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.cargarOficinaRegistral();

    this.nroRuc = this.seguridadService.getCompanyCode();
    this.razonSocial = this.seguridadService.getUserName();          // nombre de usuario login
    const tipoDocumento = this.seguridadService.getNameId();         // tipo de documento usuario login
    this.nroDocumentoLogin = this.seguridadService.getNumDoc();      // nro de documento usuario login

    console.log('tipoDocumento: ', tipoDocumento);

    switch (tipoDocumento) {
      case '00001':
      case '00004':
        this.fg_PerNatFG.enable({ emitEvent: false });
        this.fg_PerJurFG.disable({ emitEvent: false });
        break;
      case '00005':
      case '00002':
        this.fg_PerNatFG.disable({ emitEvent: false });
        this.fg_PerJurFG.enable({ emitEvent: false });
        break;
    }

    this.onChangeTipoDocumento();
  }

  get fg_PerNatFG(): UntypedFormGroup { return this.formGroup.get('fg_PerNatFG') as UntypedFormGroup; }
  get fg_pn_NombresFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_NombresFC']) as UntypedFormControl; }
  get fg_pn_TipoDocSolicitanteFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_TipoDocSolicitanteFC']) as UntypedFormControl; }
  get fg_pn_NroDocSolicitanteFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_NroDocSolicitanteFC']) as UntypedFormControl; }
  get fg_pn_RucFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_RucFC']) as UntypedFormControl; }
  get fg_pn_TelefonoFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_TelefonoFC']) as UntypedFormControl; }
  get fg_pn_CelularFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_CelularFC']) as UntypedFormControl; }
  get fg_pn_CorreoFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_CorreoFC']) as UntypedFormControl; }
  get fg_pn_DomicilioFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_DomicilioFC']) as UntypedFormControl; }
  get fg_pn_DepartamentoFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_DepartamentoFC']) as UntypedFormControl; }
  get fg_pn_ProvinciaFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_ProvinciaFC']) as UntypedFormControl; }
  get fg_pn_DistritoFC(): UntypedFormControl { return this.fg_PerNatFG.get(['fg_pn_DistritoFC']) as UntypedFormControl; }
  get fg_PerJurFG(): UntypedFormGroup { return this.formGroup.get('fg_PerJurFG') as UntypedFormGroup; }
  get fg_pj_RazonSocialFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_RazonSocialFC']) as UntypedFormControl; }
  get fg_pj_RucFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_RucFC']) as UntypedFormControl; }
  get fg_pj_DomicilioFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_DomicilioFC']) as UntypedFormControl; }
  get fg_pj_DepartamentoFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_DepartamentoFC']) as UntypedFormControl; }
  get fg_pj_ProvinciaFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_ProvinciaFC']) as UntypedFormControl; }
  get fg_pj_DistritoFC(): UntypedFormControl { return this.fg_PerJurFG.get(['fg_pj_DistritoFC']) as UntypedFormControl; }
  get fg_pj_RepLegalFG(): UntypedFormGroup { return this.fg_PerJurFG.get('fg_pj_RepLegalFG') as UntypedFormGroup; }
  get fg_pj_rl_TipoDocumentoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_TipoDocumentoFC']) as UntypedFormControl; }
  get fg_pj_rl_NumeroDocumentoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_NumeroDocumentoFC']) as UntypedFormControl; }
  get fg_pj_rl_NombreFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_NombreFC']) as UntypedFormControl; }
  get fg_pj_rl_ApePaternoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_ApePaternoFC']) as UntypedFormControl; }
  get fg_pj_rl_ApeMaternoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_ApeMaternoFC']) as UntypedFormControl; }
  get fg_pj_rl_TelefonoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_TelefonoFC']) as UntypedFormControl; }
  get fg_pj_rl_CelularFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_CelularFC']) as UntypedFormControl; }
  get fg_pj_rl_CorreoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_CorreoFC']) as UntypedFormControl; }
  get fg_pj_rl_DomicilioFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_DomicilioFC']) as UntypedFormControl; }
  get fg_pj_rl_DepartamentoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_DepartamentoFC']) as UntypedFormControl; }
  get fg_pj_rl_ProvinciaFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_ProvinciaFC']) as UntypedFormControl; }
  get fg_pj_rl_DistritoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_DistritoFC']) as UntypedFormControl; }
  get fg_pj_rl_OficinaFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_OficinaFC']) as UntypedFormControl; }
  get fg_pj_rl_PartidaFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_PartidaFC']) as UntypedFormControl; }
  get fg_pj_rl_AsientoFC(): UntypedFormControl { return this.fg_pj_RepLegalFG.get(['fg_pj_rl_AsientoFC']) as UntypedFormControl; }

  private async cargarOficinaRegistral(): Promise<void> {
    try {
      const dataOficinaRegistral = await this.oficinaRegistralService.oficinaRegistral().toPromise();
      this.oficinasRegistral = dataOficinaRegistral;
      this.funcionesMtcService.ocultarCargando();
    }
    catch (e) {
      this.funcionesMtcService
        .ocultarCargando()
        .mensajeError('Problemas para conectarnos con el servicio y recuperar datos de la oficina registral');
    }
  }

  private onChangeTipoDocumento(): void {
    this.fg_pj_rl_TipoDocumentoFC.valueChanges.subscribe((tipoDocumento: string) => {
      if (tipoDocumento?.trim() === '04') {
        this.fg_pj_rl_ApeMaternoFC.clearValidators();
        this.fg_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.fg_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([9])]);
        this.fg_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 9;
      } else {
        this.fg_pj_rl_ApeMaternoFC.setValidators([Validators.required]);
        this.fg_pj_rl_ApeMaternoFC.updateValueAndValidity();

        this.fg_pj_rl_NumeroDocumentoFC.setValidators([Validators.required, exactLengthValidator([8])]);
        this.fg_pj_rl_NumeroDocumentoFC.updateValueAndValidity();
        this.maxLengthNumeroDocumentoRepLeg = 8;
      }

      this.fg_pj_rl_NumeroDocumentoFC.reset('', { emitEvent: false });
      this.inputNumeroDocumento();
    });
  }

  private inputNumeroDocumento(): void {
    this.fg_pj_rl_NombreFC.reset('', { emitEvent: false });
    this.fg_pj_rl_ApePaternoFC.reset('', { emitEvent: false });
    this.fg_pj_rl_ApeMaternoFC.reset('', { emitEvent: false });
  }

  async buscarNumeroDocumento(): Promise<void> {
    const tipoDocumento: string = this.fg_pj_rl_TipoDocumentoFC.value.trim();
    const numeroDocumento: string = this.fg_pj_rl_NumeroDocumentoFC.value.trim();

    if (tipoDocumento.length === 0 || numeroDocumento.length === 0) {
      this.funcionesMtcService.mensajeError('Debe ingresar Tipo de Documento y/o Número de Documento');
      return;
    }
    if (tipoDocumento === '01' && numeroDocumento.length !== 8) {
      this.funcionesMtcService.mensajeError('DNI debe tener 8 caracteres');
      return;
    }

    const resultado = this.representanteLegal?.find(
      representante => (
        '0' + representante.tipoDocumento.trim()).toString() === tipoDocumento &&
        representante.nroDocumento.trim() === numeroDocumento
    );

    if (resultado || this.tipoSolicitante === 'PNR') {
      this.funcionesMtcService.mostrarCargando();

      if (tipoDocumento === '01') {// DNI
        try {
          const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }

          const datosPersona = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
          const ubigeo = datosPersona.ubigeo.split('/');
          const cargo = resultado?.cargo?.split('-');
          if (cargo) {
            this.cargoRepresentanteLegal = cargo[cargo.length - 1].trim();
          }
          this.addPersona(tipoDocumento,
            datosPersona.prenombres,
            datosPersona.apPrimer,
            datosPersona.apSegundo,
            datosPersona.direccion,
            ubigeo[2],
            ubigeo[1],
            ubigeo[0]);
        }
        catch (e) {
          console.error(e);

          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.fg_pj_rl_NombreFC.enable();
          this.fg_pj_rl_ApePaternoFC.enable();
          this.fg_pj_rl_ApeMaternoFC.enable();
        }
      } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
        try {
          const respuesta = await this.extranjeriaService.getCE(numeroDocumento).toPromise();

          this.funcionesMtcService.ocultarCargando();

          if (respuesta.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }

          this.addPersona(tipoDocumento,
            respuesta.CarnetExtranjeria.nombres,
            respuesta.CarnetExtranjeria.primerApellido,
            respuesta.CarnetExtranjeria.segundoApellido,
            '',
            '',
            '',
            '');
        }
        catch (e) {
          console.error(e);

          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar al servicio');
          this.fg_pj_rl_NombreFC.enable();
          this.fg_pj_rl_ApePaternoFC.enable();
          this.fg_pj_rl_ApeMaternoFC.enable();
        }
      }
    } else {
      return this.funcionesMtcService.mensajeError('Representante legal no encontrado');
    }
  }

  private async addPersona(
    tipoDocumento: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string): Promise<void> {

    if (this.tipoSolicitante === 'PNR') {
      this.fg_pj_rl_NombreFC.setValue(nombres);
      this.fg_pj_rl_ApePaternoFC.setValue(apPaterno);
      this.fg_pj_rl_ApeMaternoFC.setValue(apMaterno);
      this.fg_pj_rl_DomicilioFC.setValue(direccion);

      this.fg_pj_rl_NombreFC.disable({ emitEvent: false });
      this.fg_pj_rl_ApePaternoFC.disable({ emitEvent: false });
      this.fg_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

      await this.ubigeoRepLegComponent?.setUbigeoByText(
        departamento,
        provincia,
        distrito);
    }
    else {
      this.funcionesMtcService
        .mensajeConfirmar(`Los datos ingresados fueron validados por ${tipoDocumento === '01' ? 'RENIEC' : 'MIGRACIONES'} corresponden a la persona ${nombres} ${apPaterno} ${apMaterno}. ¿Está seguro de agregarlo?`)
        .then(async () => {
          this.fg_pj_rl_NombreFC.setValue(nombres);
          this.fg_pj_rl_ApePaternoFC.setValue(apPaterno);
          this.fg_pj_rl_ApeMaternoFC.setValue(apMaterno);
          this.fg_pj_rl_DomicilioFC.setValue(direccion);

          this.fg_pj_rl_NombreFC.disable({ emitEvent: false });
          this.fg_pj_rl_ApePaternoFC.disable({ emitEvent: false });
          this.fg_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

          await this.ubigeoRepLegComponent?.setUbigeoByText(
            departamento,
            provincia,
            distrito);
        });
    }
  }

  async cargarDatos(datosGenerales?: SeccionDatosGenerales): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    switch (this.seguridadService.getNameId()) {
      case '00001':
        this.tipoSolicitante = 'PN'; // persona natural
        this.fg_pn_TipoDocSolicitanteFC.setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;

      case '00002':
        this.tipoSolicitante = 'PJ'; // persona juridica
        this.fg_pn_TipoDocSolicitanteFC.setValue('DNI');
        break;

      case '00004':
        this.tipoSolicitante = 'PE'; // persona extranjera
        this.fg_pn_TipoDocSolicitanteFC.setValue('CARNET DE EXTRANJERIA');
        this.codTipoDocSolicitante = '04';
        break;

      case '00005':
        this.tipoSolicitante = 'PNR'; // persona natural con ruc
        this.fg_pn_TipoDocSolicitanteFC.setValue('DNI');
        this.codTipoDocSolicitante = '01';
        break;
    }

    if (!!datosGenerales) {
      try {
        if (this.formGroup.enable) {
          if (this.fg_PerNatFG.enabled) {
            this.fg_pn_NombresFC.setValue(datosGenerales.nombresApellidos);
            this.fg_pn_NroDocSolicitanteFC.setValue(datosGenerales.numeroDocumento);
          }

          if (this.fg_PerJurFG.enabled) {
            this.fg_pj_RucFC.setValue(datosGenerales.numeroDocumento);
            this.fg_pj_RazonSocialFC.setValue(datosGenerales.razonSocial);
            this.fg_pj_DomicilioFC.setValue(datosGenerales.domicilioLegal);

            // await this.ubigeoPerJurComponent?.setUbigeoByText(
            //   datosGenerales.departamento.trim(),
            //   datosGenerales.provincia.trim(),
            //   datosGenerales.distrito.trim());

            this.fg_pj_DepartamentoFC.setValue(datosGenerales.departamento.trim());
            this.fg_pj_ProvinciaFC.setValue(datosGenerales.provincia.trim());
            this.fg_pj_DistritoFC.setValue(datosGenerales.distrito.trim());

            this.fg_pj_rl_TelefonoFC.setValue(datosGenerales.telefono);
            this.fg_pj_rl_CelularFC.setValue(datosGenerales.celular);
            this.fg_pj_rl_CorreoFC.setValue(datosGenerales.email);

            const { representanteLegal } = datosGenerales;
            this.fg_pj_rl_TipoDocumentoFC.setValue(representanteLegal.tipoDocumento.id);
            this.fg_pj_rl_NumeroDocumentoFC.setValue(representanteLegal.numeroDocumento);
            this.fg_pj_rl_NombreFC.setValue(representanteLegal.nombres);
            this.fg_pj_rl_ApePaternoFC.setValue(representanteLegal.apellidoPaterno);
            this.fg_pj_rl_ApeMaternoFC.setValue(representanteLegal.apellidoMaterno);
            this.fg_pj_rl_DomicilioFC.setValue(representanteLegal.domicilioLegal);

            await this.ubigeoRepLegComponent?.setUbigeoByText(
              representanteLegal.departamento,
              representanteLegal.provincia,
              representanteLegal.distrito);

            this.fg_pj_rl_OficinaFC.setValue(representanteLegal.oficinaRegistral.id);
            this.fg_pj_rl_PartidaFC.setValue(representanteLegal.partida);
            this.fg_pj_rl_AsientoFC.setValue(representanteLegal.asiento);

            this.fg_pj_RazonSocialFC.disable();
            this.fg_pj_RucFC.disable();
            this.fg_pj_DomicilioFC.disable();
            this.fg_pj_DistritoFC.disable({ emitEvent: false });
            this.fg_pj_ProvinciaFC.disable({ emitEvent: false });
            this.fg_pj_DepartamentoFC.disable({ emitEvent: false });

            if (this.tipoSolicitante === 'PNR') {
              this.fg_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
              this.fg_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });

              this.fg_pj_RucFC.clearValidators();
              this.fg_pj_RucFC.updateValueAndValidity();
              this.fg_pj_RucFC.disable({ emitEvent: false });

              this.fg_pj_DepartamentoFC.clearValidators();
              this.fg_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
              this.fg_pj_DepartamentoFC.disable({ emitEvent: false });
              this.fg_pj_ProvinciaFC.clearValidators();
              this.fg_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
              this.fg_pj_ProvinciaFC.disable({ emitEvent: false });
              this.fg_pj_DistritoFC.clearValidators();
              this.fg_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
              this.fg_pj_DistritoFC.disable({ emitEvent: false });

              this.fg_pj_rl_NombreFC.disable({ emitEvent: false });
              this.fg_pj_rl_ApePaternoFC.disable({ emitEvent: false });
              this.fg_pj_rl_ApeMaternoFC.disable({ emitEvent: false });

              this.disableBtnBuscarRepLegal = true;
            }
          }
        }

      }
      catch (e) {
        console.error(e);
        this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para recuperar los datos guardados');
      }
    } else {
      if (this.tipoSolicitante === 'PNR') {
        this.fg_pj_rl_TipoDocumentoFC.setValue('01');
        this.fg_pj_rl_NumeroDocumentoFC.setValue(this.nroDocumentoLogin);
        await this.buscarNumeroDocumento();
        this.fg_pj_rl_TipoDocumentoFC.disable({ emitEvent: false });
        this.fg_pj_rl_NumeroDocumentoFC.disable({ emitEvent: false });
        this.disableBtnBuscarRepLegal = true;

        this.fg_pj_RucFC.clearValidators();
        this.fg_pj_RucFC.updateValueAndValidity();
        this.fg_pj_RucFC.disable({ emitEvent: false });

        this.fg_pj_DepartamentoFC.clearValidators();
        this.fg_pj_DepartamentoFC.updateValueAndValidity({ emitEvent: false });
        this.fg_pj_DepartamentoFC.disable({ emitEvent: false });
        this.fg_pj_ProvinciaFC.clearValidators();
        this.fg_pj_ProvinciaFC.updateValueAndValidity({ emitEvent: false });
        this.fg_pj_ProvinciaFC.disable({ emitEvent: false });
        this.fg_pj_DistritoFC.clearValidators();
        this.fg_pj_DistritoFC.updateValueAndValidity({ emitEvent: false });
        this.fg_pj_DistritoFC.disable({ emitEvent: false });
      }
      else {
        try {
          const response = await this.sunatService.getDatosPrincipales(this.nroRuc).toPromise();
          this.funcionesMtcService.ocultarCargando();
          if (this.tipoSolicitante === 'PJ') {
            this.fg_pj_RazonSocialFC.setValue(response.razonSocial.trim());
            this.fg_pj_RucFC.setValue(response.nroDocumento.trim());
            this.fg_pj_DomicilioFC.setValue(response.domicilioLegal.trim());

            console.log('nombreDepartamento: ', response.nombreDepartamento.trim(),
              'nombreProvincia: ', response.nombreProvincia.trim(),
              'nombreDistrito: ', response.nombreDistrito.trim());

            // await this.ubigeoPerJurComponent?.setUbigeoByText(
            //   response.nombreDepartamento.trim(),
            //   response.nombreProvincia.trim(),
            //   response.nombreDistrito.trim());

            this.fg_pj_DepartamentoFC.setValue(response.nombreDepartamento.trim());
            this.fg_pj_ProvinciaFC.setValue(response.nombreProvincia.trim());
            this.fg_pj_DistritoFC.setValue(response.nombreDistrito.trim());

            this.fg_pj_rl_TelefonoFC.setValue(response.telefono.trim());
            this.fg_pj_rl_CelularFC.setValue(response.celular.trim());
            this.fg_pj_rl_CorreoFC.setValue(response.correo.trim());

            this.fg_pj_RazonSocialFC.disable();
            this.fg_pj_RucFC.disable();
            this.fg_pj_DomicilioFC.disable();
            this.fg_pj_DistritoFC.disable({ emitEvent: false });
            this.fg_pj_ProvinciaFC.disable({ emitEvent: false });
            this.fg_pj_DepartamentoFC.disable({ emitEvent: false });
          }
          else {
            this.fg_pn_NroDocSolicitanteFC.setValue(this.nroDocumentoLogin);
            this.fg_pn_RucFC.setValue(response.nroDocumento.trim());
            this.fg_pn_NombresFC.setValue(response.razonSocial.trim());
            this.fg_pn_DomicilioFC.setValue(response.domicilioLegal.trim());

            await this.ubigeoPerNatComponent?.setUbigeoByText(
              response.nombreDepartamento.trim(),
              response.nombreProvincia.trim(),
              response.nombreDistrito.trim());

            this.fg_pn_TelefonoFC.setValue(response.telefono.trim());
            this.fg_pn_CelularFC.setValue(response.celular.trim());
            this.fg_pn_CorreoFC.setValue(response.correo.trim());
          }

          this.representanteLegal = response.representanteLegal;
        }
        catch (e) {
          this.funcionesMtcService.ocultarCargando().mensajeError('Error al consultar el Servicio de Sunat');

          this.fg_pj_RazonSocialFC.setValue(this.razonSocial);
          this.fg_pj_RucFC.setValue(this.nroRuc);

          this.fg_pj_DomicilioFC.enable();
          this.fg_pj_DistritoFC.enable();
          this.fg_pj_ProvinciaFC.enable();
          this.fg_pj_DepartamentoFC.enable();
        }
      }
    }
  }

  formInvalid(control: UntypedFormControl): boolean {
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    }
  }
}
