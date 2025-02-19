/**
 * Formulario de registro de usuarios para el TUPA DIGITAL
 * @author André Bernabé Pérez
 * @version 1.0 22.07.2021
 */
import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {  TipoPersonaResponseModel } from 'src/app/core/models/Autenticacion/TipoPersonaResponseModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { MustMatch } from 'src/app/helpers/functions';
import { PasswordStrengthValidator } from 'src/app/helpers/validator';
import { RegistroUsuarioModel } from '../../../../core/models/Autenticacion/RegistroUsuarioModel';
import { AyudaModalComponent } from '../ayuda-modal/ayuda-modal.component';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { ActivatedRoute, Router } from '@angular/router';
import { formatNumber, Location } from '@angular/common';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { RepresentanteLegalModel } from 'src/app/core/models/Autenticacion/RepresentanteLegalModel';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, AfterViewInit {

  @ViewChild('ubigeoCmp') ubigeoComponent: UbigeoComponent;
  @ViewChildren('ubigeoRepLegalCmp') ubigeoRepLegalComponent: QueryList<UbigeoComponent>;

  validacionFG: UntypedFormGroup;
  registroFG: UntypedFormGroup;

  listaTipoPersona: Array<TipoPersonaResponseModel>;
  listaOficinaRegistral: Array<any>;
  listaPaises: Array<any>;
  messageError: string;

  mostrarSegundoForm = false;

  usFoto: string;

  modal: NgbModalRef;

  paramState: string;
  paramCode: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private reniecService: ReniecService,
    private oficinaRegistralService: OficinaRegistralService,
    private paisService: PaisService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  async ngOnInit(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    if (this.seguridadService.isAuthenticated()) {
      this.router.navigate(['/index']);
    }

    this.validacionFG = this.formBuilder.group({
      valTipoUsuarioFC: ['', [Validators.required]],
      valPerNatFG: this.formBuilder.group({
        vpnDniFC: ['', [Validators.required, Validators.maxLength(8)]],
        vpnNombresFC: ['', [Validators.required]],
        vpnEstadoCivilFC: ['', [Validators.required]],
        vpnDepartamentoFC: ['', [Validators.required]],
      }),
      valPerJurFG: this.formBuilder.group({
        vpjRazonSocialFC: ['', [Validators.required]],
        vpjDecJurFC: ['', [Validators.requiredTrue]],
      }),
      valPerExtFG: this.formBuilder.group({
        vpjCeFC: ['', [Validators.required, Validators.maxLength(9)]]
      }),
    });

    this.registroFG = this.formBuilder.group({
      regDatosEmpFG: this.formBuilder.group({
        rdeEmailFC: ['', [Validators.required, Validators.email]],
        rdeDireccionFC: ['', [Validators.required]],
        rdeConfirmDirFC: ['', [Validators.requiredTrue]],
        rdeCelularFC: ['', [Validators.maxLength(9)]],
        rdeTelefonoFC: ['', [Validators.maxLength(7)]],
      }),
      regDatosUsuFG: this.formBuilder.group({
        rduRucFC: ['', [Validators.required, Validators.maxLength(11)]],
        rduTipoDocFC: ['DNI', [Validators.required]],
        rduDniFC: ['', [Validators.required, Validators.maxLength(8)]],
        rduValidaDniFG: this.formBuilder.group({
          rduvDniFC: ['', [Validators.required, Validators.maxLength(8)]],
          rduvNombresFC: ['', [Validators.required]],
          rduvEstadoCivilFC: ['', [Validators.required]],
          rduvDepartamentoFC: ['', [Validators.required]],
        }),
        rduCeFC: ['', [Validators.required, Validators.maxLength(9)]],
        rduNombresFC: ['', [Validators.required]],
        rduApPaternoFC: ['', [Validators.required]],
        rduApMaternoFC: ['', [Validators.required]],
        rduDomicilioFC: ['', [Validators.required]],
        rduConfirmDomFC: ['', [Validators.requiredTrue]],
        rduAceptaRepPriFC: ['', [Validators.requiredTrue]],
        rduGeneroFC: ['', [Validators.required]],
        rduPaisFC: ['', [Validators.required]],
        rduDepaFC: ['', [Validators.required]],
        rduProvFC: ['', [Validators.required]],
        rduDistFC: ['', [Validators.required]],
        rduEmailFC: ['', [Validators.required, Validators.email]],
        rduConfirmEmailFC: ['', [Validators.required, Validators.email]],
        rduPasswordFC: ['', [Validators.required, PasswordStrengthValidator]],
        rduConfirmPassFC: ['', [Validators.required]],
        rduCelularFC: ['', [Validators.required, Validators.maxLength(9)]],
        rduTelefonoFC: ['', [Validators.maxLength(7)]],
        rduOficinaFC: ['', [Validators.required]],
        rduPartidaFC: ['', [Validators.required]],
        rduAsientoFC: ['', [Validators.required]],
      },
        {
          validators: [
            MustMatch('rduEmailFC', 'rduConfirmEmailFC'),
            MustMatch('rduPasswordFC', 'rduConfirmPassFC')
          ],
        } as AbstractControlOptions),
      regDatosRepLegalFA: this.formBuilder.array([], [Validators.required]),
      regTerminosFC: ['', [Validators.requiredTrue]],
      regNotificaFC: ['', [Validators.requiredTrue]],
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.poblarTipoPersona();
    await this.poblarOficinaRegistral();
    await this.poblarPaises();

    this.onChangeTipoUsuario();
    this.onChangeTipoDoc();
    this.onChangeDNIUsuario();
    this.onChangeCEUsuario();
    this.onChangeParams();

    this.funcionesMtcService.ocultarCargando();
  }

  // GET FORM validacionFG
  get valTipoUsuarioFC(): AbstractControl { return this.validacionFG.get('valTipoUsuarioFC'); }

  get valPerNatFG(): UntypedFormGroup { return this.validacionFG.get('valPerNatFG') as UntypedFormGroup; }
  get vpnDniFC(): AbstractControl { return this.valPerNatFG.get(['vpnDniFC']); }
  get vpnNombresFC(): AbstractControl { return this.valPerNatFG.get(['vpnNombresFC']); }
  get vpnEstadoCivilFC(): AbstractControl { return this.valPerNatFG.get(['vpnEstadoCivilFC']); }
  get vpnDepartamentoFC(): AbstractControl { return this.valPerNatFG.get(['vpnDepartamentoFC']); }

  get valPerJurFG(): UntypedFormGroup { return this.validacionFG.get('valPerJurFG') as UntypedFormGroup; }
  get vpjRazonSocialFC(): AbstractControl { return this.valPerJurFG.get(['vpjRazonSocialFC']); }
  get vpjDecJurFC(): AbstractControl { return this.valPerJurFG.get(['vpjDecJurFC']); }

  get valPerExtFG(): UntypedFormGroup { return this.validacionFG.get('valPerExtFG') as UntypedFormGroup; }
  get vpjCeFC(): AbstractControl { return this.valPerExtFG.get(['vpjCeFC']); }

  // GET FORM registroFG
  get regDatosEmpFG(): UntypedFormGroup { return this.registroFG.get('regDatosEmpFG') as UntypedFormGroup; }
  get rdeEmailFC(): AbstractControl { return this.regDatosEmpFG.get(['rdeEmailFC']); }
  get rdeDireccionFC(): AbstractControl { return this.regDatosEmpFG.get(['rdeDireccionFC']); }
  get rdeConfirmDirFC(): AbstractControl { return this.regDatosEmpFG.get(['rdeConfirmDirFC']); }
  get rdeCelularFC(): AbstractControl { return this.regDatosEmpFG.get(['rdeCelularFC']); }
  get rdeTelefonoFC(): AbstractControl { return this.regDatosEmpFG.get(['rdeTelefonoFC']); }

  get regDatosUsuFG(): UntypedFormGroup { return this.registroFG.get('regDatosUsuFG') as UntypedFormGroup; }
  get rduRucFC(): AbstractControl { return this.regDatosUsuFG.get(['rduRucFC']); }
  get rduTipoDocFC(): AbstractControl { return this.regDatosUsuFG.get(['rduTipoDocFC']); }
  get rduDniFC(): AbstractControl { return this.regDatosUsuFG.get(['rduDniFC']); }
  get rduValidaDniFG(): UntypedFormGroup { return this.regDatosUsuFG.get(['rduValidaDniFG']) as UntypedFormGroup; }
  get rduvDniFC(): AbstractControl { return this.rduValidaDniFG.get(['rduvDniFC']); }
  get rduvNombresFC(): AbstractControl { return this.rduValidaDniFG.get(['rduvNombresFC']); }
  get rduvEstadoCivilFC(): AbstractControl { return this.rduValidaDniFG.get(['rduvEstadoCivilFC']); }
  get rduvDepartamentoFC(): AbstractControl { return this.rduValidaDniFG.get(['rduvDepartamentoFC']); }
  get rduCeFC(): AbstractControl { return this.regDatosUsuFG.get(['rduCeFC']); }
  get rduNombresFC(): AbstractControl { return this.regDatosUsuFG.get(['rduNombresFC']); }
  get rduApPaternoFC(): AbstractControl { return this.regDatosUsuFG.get(['rduApPaternoFC']); }
  get rduApMaternoFC(): AbstractControl { return this.regDatosUsuFG.get(['rduApMaternoFC']); }
  get rduDomicilioFC(): AbstractControl { return this.regDatosUsuFG.get(['rduDomicilioFC']); }
  get rduConfirmDomFC(): AbstractControl { return this.regDatosUsuFG.get(['rduConfirmDomFC']); }
  get rduAceptaRepPriFC(): AbstractControl { return this.regDatosUsuFG.get(['rduAceptaRepPriFC']); }
  get rduGeneroFC(): AbstractControl { return this.regDatosUsuFG.get(['rduGeneroFC']); }
  get rduPaisFC(): AbstractControl { return this.regDatosUsuFG.get(['rduPaisFC']); }
  get rduDepaFC(): AbstractControl { return this.regDatosUsuFG.get(['rduDepaFC']); }
  get rduProvFC(): AbstractControl { return this.regDatosUsuFG.get(['rduProvFC']); }
  get rduDistFC(): AbstractControl { return this.regDatosUsuFG.get(['rduDistFC']); }
  get rduEmailFC(): AbstractControl { return this.regDatosUsuFG.get(['rduEmailFC']); }
  get rduConfirmEmailFC(): AbstractControl { return this.regDatosUsuFG.get(['rduConfirmEmailFC']); }
  get rduPasswordFC(): AbstractControl { return this.regDatosUsuFG.get(['rduPasswordFC']); }
  get rduConfirmPassFC(): AbstractControl { return this.regDatosUsuFG.get(['rduConfirmPassFC']); }
  get rduCelularFC(): AbstractControl { return this.regDatosUsuFG.get(['rduCelularFC']); }
  get rduTelefonoFC(): AbstractControl { return this.regDatosUsuFG.get(['rduTelefonoFC']); }
  get rduOficinaFC(): AbstractControl { return this.regDatosUsuFG.get(['rduOficinaFC']); }
  get rduPartidaFC(): AbstractControl { return this.regDatosUsuFG.get(['rduPartidaFC']); }
  get rduAsientoFC(): AbstractControl { return this.regDatosUsuFG.get(['rduAsientoFC']); }

  get regTerminosFC(): AbstractControl { return this.registroFG.get('regTerminosFC'); }
  get regNotificaFC(): AbstractControl { return this.registroFG.get('regNotificaFC'); }

  get regDatosRepLegalFA(): UntypedFormArray { return this.registroFG.get(['regDatosRepLegalFA']) as UntypedFormArray; }
  rdrDniFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrDniFC']); }
  rdrNombresFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrNombresFC']); }
  rdrApPaternoFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrApPaternoFC']); }
  rdrApMaternoFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrApMaternoFC']); }
  rdrDomicilioFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrDomicilioFC']); }
  rdrConfirmDomFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrConfirmDomFC']); }
  rdrDepaFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrDepaFC']); }
  rdrFotoFC(index: string): AbstractControl { return this.regDatosRepLegalFA.get([index, 'rdrFotoFC']); }
  rdrValidaDniFG(index: string): UntypedFormGroup { return this.regDatosRepLegalFA.get([index, 'rdrValidaDniFG']) as UntypedFormGroup; }
  rdrvDniFC(index: string): AbstractControl { return this.rdrValidaDniFG(index).get(['rdrvDniFC']); }
  rdrvNombresFC(index: string): AbstractControl { return this.rdrValidaDniFG(index).get(['rdrvNombresFC']); }
  rdrvEstadoCivilFC(index: string): AbstractControl { return this.rdrValidaDniFG(index).get(['rdrvEstadoCivilFC']); }
  rdrvDepartamentoFC(index: string): AbstractControl { return this.rdrValidaDniFG(index).get(['rdrvDepartamentoFC']); }

  get mostrarPersonaJ(): boolean {
    return (this.valTipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA);
  }
  get mostrarPersonaN(): boolean {
    return (this.valTipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL);
  }
  get mostrarPersonaE(): boolean {
    return (this.valTipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA);
  }
  get mostrarPersonaNR(): boolean {
    return (this.valTipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC);
  }

  async poblarTipoPersona(): Promise<void> {
    try {
      //this.listaTipoPersona = await this.seguridadService.getTipoPersonas().toPromise();
      await this.seguridadService.getTipoPersonas().subscribe(res=>{
				if(res.success) this.listaTipoPersona = res.data;
			});
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los tipos de persona');
    }
  }

  async poblarOficinaRegistral(): Promise<void> {
    try {
      this.listaOficinaRegistral = await this.oficinaRegistralService.oficinaRegistral().toPromise();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener las oficinas registrales');
    }
  }

  async poblarPaises(): Promise<void> {
    try {
      this.listaPaises = await this.paisService.getAll<any>().toPromise();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los paises');
    }
  }

  onChangeTipoUsuario(): void {
    this.valTipoUsuarioFC.valueChanges.subscribe((tipoUsuario: string) => {

      this.mostrarSegundoForm = false;
      this.messageError = '';

      if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL) {
        this.valPerNatFG.enable({ emitEvent: false });
        this.valPerJurFG.disable({ emitEvent: false });
        this.valPerExtFG.disable({ emitEvent: false });

        this.regDatosEmpFG.disable({ emitEvent: false });
        this.regDatosUsuFG.enable({ emitEvent: false });
        this.regDatosRepLegalFA.disable({ emitEvent: false });

        this.rduRucFC.disable({ emitEvent: false });
        this.rduAceptaRepPriFC.disable({ emitEvent: false });

        this.rduOficinaFC.disable({ emitEvent: false });
        this.rduPartidaFC.disable({ emitEvent: false });
        this.rduAsientoFC.disable({ emitEvent: false });

        this.rduTipoDocFC.setValue('DNI');
      }
      else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA) {
        this.valPerNatFG.disable({ emitEvent: false });
        this.valPerJurFG.enable({ emitEvent: false });
        this.valPerExtFG.disable({ emitEvent: false });

        this.regDatosEmpFG.enable({ emitEvent: false });
        this.regDatosUsuFG.enable({ emitEvent: false });
        this.regDatosRepLegalFA.enable({ emitEvent: false });

        this.rduRucFC.disable({ emitEvent: false });
        this.rduAceptaRepPriFC.enable({ emitEvent: false });

        this.rduOficinaFC.enable({ emitEvent: false });
        this.rduPartidaFC.enable({ emitEvent: false });
        this.rduAsientoFC.enable({ emitEvent: false });

        this.rduTipoDocFC.setValue('DNI');
      }
      else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA) {
        this.valPerNatFG.disable({ emitEvent: false });
        this.valPerJurFG.disable({ emitEvent: false });
        this.valPerExtFG.enable({ emitEvent: false });

        this.regDatosEmpFG.disable({ emitEvent: false });
        this.regDatosUsuFG.enable({ emitEvent: false });
        this.regDatosRepLegalFA.disable({ emitEvent: false });

        this.rduRucFC.disable({ emitEvent: false });
        this.rduAceptaRepPriFC.disable({ emitEvent: false });

        this.rduOficinaFC.disable({ emitEvent: false });
        this.rduPartidaFC.disable({ emitEvent: false });
        this.rduAsientoFC.disable({ emitEvent: false });

        this.rduTipoDocFC.setValue('CE');
      }
      else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC) {
        this.valPerNatFG.disable({ emitEvent: false });
        this.valPerJurFG.enable({ emitEvent: false });
        this.valPerExtFG.disable({ emitEvent: false });

        this.regDatosEmpFG.disable({ emitEvent: false });
        this.regDatosUsuFG.enable({ emitEvent: false });
        this.regDatosRepLegalFA.disable({ emitEvent: false });

        this.rduRucFC.enable({ emitEvent: false });
        this.rduAceptaRepPriFC.disable({ emitEvent: false });

        this.rduOficinaFC.disable({ emitEvent: false });
        this.rduPartidaFC.disable({ emitEvent: false });
        this.rduAsientoFC.disable({ emitEvent: false });

        this.rduTipoDocFC.setValue('DNI');
      }
      else {
        this.valPerNatFG.disable({ emitEvent: false });
        this.valPerJurFG.disable({ emitEvent: false });
        this.valPerExtFG.disable({ emitEvent: false });

        this.regDatosEmpFG.disable({ emitEvent: false });
        this.regDatosUsuFG.disable({ emitEvent: false });
        this.regDatosRepLegalFA.disable({ emitEvent: false });

        this.rduRucFC.disable({ emitEvent: false });
        this.rduAceptaRepPriFC.disable({ emitEvent: false });

        this.rduOficinaFC.disable({ emitEvent: false });
        this.rduPartidaFC.disable({ emitEvent: false });
        this.rduAsientoFC.disable({ emitEvent: false });

        this.rduTipoDocFC.setValue('DNI');
      }

      this.valPerNatFG.reset();
      this.valPerJurFG.reset();
      this.valPerExtFG.reset();

      this.regDatosEmpFG.reset();
    });
  }

  onChangeTipoDoc(): void {
    this.rduTipoDocFC.valueChanges.subscribe((tipoDoc: string) => {
      if (tipoDoc?.trim().length > 0) {
        this.rduDniFC.reset('', { emitEvent: false });
        this.rduCeFC.reset('', { emitEvent: false });
        this.rduValidaDniFG.reset({ emitEvent: false });

        if (tipoDoc === 'DNI') {
          this.rduDniFC.enable({ emitEvent: false });
          this.rduCeFC.disable({ emitEvent: false });
          if (this.valTipoUsuarioFC.value === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA) {
            this.rduValidaDniFG.enable({ emitEvent: false });
          }
          else {
            this.rduValidaDniFG.disable({ emitEvent: false });
          }
          this.rduPaisFC.setValue('PE-Peru');
        }
        else if (tipoDoc === 'CE') {
          this.rduDniFC.disable({ emitEvent: false });
          this.rduCeFC.enable({ emitEvent: false });
          this.rduValidaDniFG.disable({ emitEvent: false });
          this.rduPaisFC.setValue('');
        }
        else {
          this.rduDniFC.disable({ emitEvent: false });
          this.rduCeFC.disable({ emitEvent: false });
          this.rduValidaDniFG.disable({ emitEvent: false });
          this.rduPaisFC.setValue('PE-Peru');
        }

        this.resetDatosUsuarioFormGroup();
      }
    });
  }

  onChangeDNIUsuario(): void {
    this.rduDniFC.valueChanges.subscribe(async (dni: string) => {
      if (dni?.trim().length === 8) {
        this.funcionesMtcService.mostrarCargando();

        this.resetDatosUsuarioFormGroup();

        try {
          const response = await this.reniecService.getDni(dni).toPromise();
          if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
          }
          const datosPersona = response.reniecConsultDniResponse.listaConsulta.datosPersona;

          this.rduNombresFC.setValue(datosPersona.prenombres);
          this.rduApPaternoFC.setValue(datosPersona.apPrimer);
          this.rduApMaternoFC.setValue(datosPersona.apSegundo);
          this.rduDomicilioFC.setValue(datosPersona.direccion);
          this.usFoto = datosPersona.foto;

          const vUbigeo = datosPersona.ubigeo.split('/', 3);
          await this.ubigeoComponent.setUbigeoByText(vUbigeo[0], vUbigeo[1], vUbigeo[2]);
        } catch (e) {
          this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos por DNI');
        }

        this.funcionesMtcService.ocultarCargando();
      }
    });
  }

  onChangeCEUsuario(): void {
    this.rduCeFC.valueChanges.subscribe(async (ce: string) => {
      if (ce?.trim().length === 9) {
        this.funcionesMtcService.mostrarCargando();

        this.resetDatosUsuarioFormGroup();

        try {
          const response = await this.extranjeriaService.getCE(ce).toPromise();
          if (response.CarnetExtranjeria.numRespuesta !== '0000') {
            return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
          }
          const datosPersona = response.CarnetExtranjeria;
          this.rduNombresFC.setValue(datosPersona.nombres);
          this.rduApPaternoFC.setValue(datosPersona.primerApellido);
          this.rduApMaternoFC.setValue(datosPersona.segundoApellido);
        } catch (e) {
          this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos CE');
        }
        this.funcionesMtcService.ocultarCargando();
      }
    });
  }

  onChangeParams(): void {
    this.route.queryParams.subscribe(params => {
      this.paramState = params?.state ?? null;
      this.paramCode = params?.code ?? null;

      this.loadDataPerJur();
    });
  }

  async buscarPCE(btnSubmit: HTMLButtonElement): Promise<void> {
    btnSubmit.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    try {
      const response = await this.extranjeriaService.getCE(this.vpjCeFC.value).toPromise();

      if (response.CarnetExtranjeria.numRespuesta !== '0000') {
        return this.funcionesMtcService.mensajeError('Número de documento no registrado en Migraciones');
      }

      this.rduCeFC.setValue(this.vpjCeFC.value, { emitEvent: false });

      const datosPersona = response.CarnetExtranjeria;
      this.rduNombresFC.setValue(datosPersona.nombres);
      this.rduApPaternoFC.setValue(datosPersona.primerApellido);
      this.rduApMaternoFC.setValue(datosPersona.segundoApellido);

      this.valPerExtFG.disable({ emitEvent: false });

      this.mostrarSegundoForm = true;
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos CE');
    } finally {
      btnSubmit.disabled = false;
      this.funcionesMtcService.ocultarCargando();
    }
  }

  loginOauthSunat(btnSubmit: HTMLButtonElement): void {
    btnSubmit.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    const idTipoPersona = CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA;

    const urlTree = this.router.createUrlTree(['/autenticacion/registro']);
    const path = this.location.prepareExternalUrl(urlTree.toString());
    const urlRedirect = `${window.location.origin}/${path}`;

    const encodedUrlRedirect = encodeURIComponent(urlRedirect);

    const url = this.sunatService.getUrlOauth(idTipoPersona, encodedUrlRedirect);
    window.location.href = url;
  }

  async loadDataPerJur(): Promise<void> {
    if (this.paramState && this.paramCode) {
      const isTokenValid = this.seguridadService.isTokenValid(this.paramCode);

      // TODO: Descomentar en produccion

      // if (!isTokenValid) {
      //   this.router.navigate(['/autenticacion/registro']);
      //   return;
      // }

      const decodeToken = this.seguridadService.getDecodedToken(this.paramCode);
      if (!decodeToken) {
        this.funcionesMtcService.mensajeError('El token de respuesta no es válido, inicie sesión nuevamente');
        this.router.navigate(['/autenticacion/registro']);
        return;
      }
      const numRuc: string = decodeToken.userdata?.numRUC ?? null;
      if (!numRuc) {
        this.funcionesMtcService.mensajeError('No se pudo obtener el numero de RUC');
        this.router.navigate(['/autenticacion/registro']);
        return;
      }

      this.funcionesMtcService.mostrarCargando();

      try {
        const response = await this.sunatService.getDatosPrincipales(numRuc).toPromise();
        if (response) {
          const codIniRuc = numRuc.substr(0, 2);
          if (codIniRuc === '10') {
            this.valTipoUsuarioFC.setValue(CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC);

            this.vpjRazonSocialFC.setValue(response.razonSocial);
            this.mostrarSegundoForm = true;

            this.rduRucFC.setValue(numRuc);

            const numDNI = numRuc.substr(2, 8);
            this.rduDniFC.setValue(numDNI);
          }
          else {
            this.valTipoUsuarioFC.setValue(CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA);

            this.vpjRazonSocialFC.setValue(response.razonSocial);
            this.mostrarSegundoForm = true;

            this.rdeDireccionFC.setValue(response.domicilioLegal);
            this.rdeEmailFC.setValue(response.correo);
            this.rdeCelularFC.setValue(isNaN(Number(response.celular)) ? '' : response.celular);
            this.rdeTelefonoFC.setValue(isNaN(Number(response.telefono)) ? '' : response.telefono);
          }

          this.vpjRazonSocialFC.disable({ emitEvent: false });
        }
        else {
          this.funcionesMtcService.mensajeError('No se pudo obtener el numero de RUC');
        }
      } catch (e) {
        this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos de la SUNAT');
      } finally {
        this.funcionesMtcService.ocultarCargando();
      }
    }
  }

  async validaPN(btnSubmit: HTMLButtonElement, dni: string, nombres: string, estadoCivil: string, ubigeo: string): Promise<number> {
    let result = 0;
    btnSubmit.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    try {
      const response = await this.reniecService.getDni(dni).toPromise();

      if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
        btnSubmit.disabled = false;
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
        return 1;
      }

      const datosPersona = response.reniecConsultDniResponse.listaConsulta.datosPersona;
      const nombresReniec = this.formatStringToCompare(datosPersona.prenombres);
      const estadoCivilReniec = this.formatStringToCompare(datosPersona.estadoCivil);
      const vUbigeo = datosPersona.ubigeo.split('/', 3);
      const ubigeoReniec = this.formatStringToCompare(vUbigeo[0]);

      if (nombres !== nombresReniec || estadoCivil !== estadoCivilReniec || ubigeo !== ubigeoReniec) {
        btnSubmit.disabled = false;
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('Los datos ingresados no coinciden con los esperados. Puede volver a intentar.');
        return 1;
      }

      this.mostrarSegundoForm = true;

      this.rduDniFC.setValue(dni, { emitEvent: false });

      this.resetDatosUsuarioFormGroup();

      this.rduNombresFC.setValue(datosPersona.prenombres);
      this.rduApPaternoFC.setValue(datosPersona.apPrimer);
      this.rduApMaternoFC.setValue(datosPersona.apSegundo);
      this.rduDomicilioFC.setValue(datosPersona.direccion);
      this.usFoto = datosPersona.foto;

      await this.ubigeoComponent.setUbigeoByText(vUbigeo[0], vUbigeo[1], vUbigeo[2]);

    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos por DNI');
      result = 1;
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }
    return result;
  }

  async validaDniPN(btnSubmit: HTMLButtonElement): Promise<void> {
    const dni = this.vpnDniFC.value;
    const nombres = this.formatStringToCompare(this.vpnNombresFC.value);
    const estadoCivil = this.formatStringToCompare(this.vpnEstadoCivilFC.value);
    const ubigeo = this.formatStringToCompare(this.vpnDepartamentoFC.value);

    const response = await this.validaPN(btnSubmit, dni, nombres, estadoCivil, ubigeo);

    if (response === 0) {
      this.valPerNatFG.disable({ emitEvent: false });
    }
    else {
      this.valPerNatFG.reset();
    }
  }

  async validaDniPJ(btnSubmit: HTMLButtonElement): Promise<void> {
    const dni = this.rduvDniFC.value;
    const nombres = this.formatStringToCompare(this.rduvNombresFC.value);
    const estadoCivil = this.formatStringToCompare(this.rduvEstadoCivilFC.value);
    const ubigeo = this.formatStringToCompare(this.rduvDepartamentoFC.value);

    const response = await this.validaPN(btnSubmit, dni, nombres, estadoCivil, ubigeo);

    if (response === 0) {
      this.rduValidaDniFG.disable({ emitEvent: false });
    }
    else {
      this.rduValidaDniFG.reset();
    }
  }

  async validaPNRL(
    btnSubmit: HTMLButtonElement, index: string, dni: string,
    nombres: string, estadoCivil: string, ubigeo: string
  ): Promise<number> {
    let result = 0;
    btnSubmit.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    try {
      const response = await this.reniecService.getDni(dni).toPromise();

      if (response.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
        btnSubmit.disabled = false;
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('Número de documento no registrado en Reniec');
        return 1;
      }

      const datosPersona = response.reniecConsultDniResponse.listaConsulta.datosPersona;
      const nombresReniec = this.formatStringToCompare(datosPersona.prenombres);
      const estadoCivilReniec = this.formatStringToCompare(datosPersona.estadoCivil);
      const vUbigeo = datosPersona.ubigeo.split('/', 3);
      const ubigeoReniec = this.formatStringToCompare(vUbigeo[0]);

      if (nombres !== nombresReniec || estadoCivil !== estadoCivilReniec || ubigeo !== ubigeoReniec) {
        btnSubmit.disabled = false;
        this.funcionesMtcService.ocultarCargando();
        this.funcionesMtcService.mensajeError('Los datos ingresados no coinciden con los esperados. Puede volver a intentar.');
        return 1;
      }

      this.rdrDniFC(index).setValue(dni, { emitEvent: false });

      this.resetDatosRepLegalFG(index);

      this.rdrNombresFC(index).setValue(datosPersona.prenombres);
      this.rdrApPaternoFC(index).setValue(datosPersona.apPrimer);
      this.rdrApMaternoFC(index).setValue(datosPersona.apSegundo);
      this.rdrDomicilioFC(index).setValue(datosPersona.direccion);
      this.rdrFotoFC(index).setValue(datosPersona.foto);

      await this.ubigeoRepLegalComponent
        .find((item, indx, array) => indx === Number(index))
        .setUbigeoByText(vUbigeo[0], vUbigeo[1], vUbigeo[2]);

    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos por DNI. ' + e);
      result = 1;
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }
    return result;
  }

  async validaDniRL(btnSubmit: HTMLButtonElement, index: string): Promise<void> {
    const dni = this.rdrvDniFC(index).value;
    const nombres = this.formatStringToCompare(this.rdrvNombresFC(index).value);
    const estadoCivil = this.formatStringToCompare(this.rdrvEstadoCivilFC(index).value);
    const ubigeo = this.formatStringToCompare(this.rdrvDepartamentoFC(index).value);

    const response = await this.validaPNRL(btnSubmit, index, dni, nombres, estadoCivil, ubigeo);

    if (response === 0) {
      this.rdrValidaDniFG(index).disable({ emitEvent: false });
    }
    else {
      this.rdrValidaDniFG(index).reset();
    }
  }

  addRepLegalFG(btnSubmit: HTMLButtonElement): void {
    btnSubmit.disabled = true;

    const regDatosRepLegalFG = this.formBuilder.group({
      rdrDniFC: ['', [Validators.required, Validators.maxLength(8)]],
      rdrValidaDniFG: this.formBuilder.group({
        rdrvDniFC: ['', [Validators.required, Validators.maxLength(8)]],
        rdrvNombresFC: ['', [Validators.required]],
        rdrvEstadoCivilFC: ['', [Validators.required]],
        rdrvDepartamentoFC: ['', [Validators.required]],
      }),
      rdrNombresFC: ['', [Validators.required]],
      rdrApPaternoFC: ['', [Validators.required]],
      rdrApMaternoFC: ['', [Validators.required]],
      rdrDomicilioFC: ['', [Validators.required]],
      rdrConfirmDomFC: ['', [Validators.requiredTrue]],
      rdrDepaFC: ['', [Validators.required]],
      rdrProvFC: ['', [Validators.required]],
      rdrDistFC: ['', [Validators.required]],
      rdrFotoFC: [''],
    });

    this.regDatosRepLegalFA.push(regDatosRepLegalFG);

    btnSubmit.disabled = false;
  }

  deleteRepLegal(btnSubmit: HTMLButtonElement, index: string): void {
    btnSubmit.disabled = true;
    this.regDatosRepLegalFA.removeAt(Number(index));
  }


  formatStringToCompare(value: string): string {
    // return value?.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return value?.trim().toUpperCase();
  }

  resetDatosUsuarioFormGroup(): void {
    this.rduNombresFC.reset('', { emitEvent: false });
    this.rduApPaternoFC.reset('', { emitEvent: false });
    this.rduApMaternoFC.reset('', { emitEvent: false });
    this.rduDomicilioFC.reset('', { emitEvent: false });
    this.rduConfirmDomFC.reset('', { emitEvent: false });
    this.rduAceptaRepPriFC.reset('', { emitEvent: false });
    this.rduGeneroFC.reset('', { emitEvent: false });
    this.rduDepaFC.reset('');
    this.rduEmailFC.reset('', { emitEvent: false });
    this.rduConfirmEmailFC.reset('', { emitEvent: false });
    this.rduPasswordFC.reset('', { emitEvent: false });
    this.rduConfirmPassFC.reset('', { emitEvent: false });
    this.rduCelularFC.reset('', { emitEvent: false });
    this.rduTelefonoFC.reset('', { emitEvent: false });
    this.rduOficinaFC.reset('', { emitEvent: false });
    this.rduPartidaFC.reset('', { emitEvent: false });
    this.rduAsientoFC.reset('', { emitEvent: false });

    this.regTerminosFC.reset('', { emitEvent: false });
    this.regNotificaFC.reset('', { emitEvent: false });

    this.usFoto = null;
  }

  resetDatosRepLegalFG(index: string): void {
    this.rdrNombresFC(index).reset('', { emitEvent: false });
    this.rdrApPaternoFC(index).reset('', { emitEvent: false });
    this.rdrApMaternoFC(index).reset('', { emitEvent: false });
    this.rdrDomicilioFC(index).reset('', { emitEvent: false });
    this.rdrConfirmDomFC(index).reset('', { emitEvent: false });
    this.rdrDepaFC(index).reset('');
  }

  openModal(content): void {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  openModalAyuda(nameImg: string): void {
    this.modal = this.modalService.open(AyudaModalComponent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
    });
    this.modal.componentInstance.nameImg = nameImg;
  }

  acceptDecJur(): void {
    this.vpjDecJurFC.setValue(true);
    this.modal.close();
  }

  acceptTerCon(): void {
    this.regTerminosFC.setValue(true);
    this.modal.close();
  }

  async submitRegistro(submitBtn: HTMLButtonElement): Promise<void> {
    if (this.registroFG.invalid) {
      return;
    }
    submitBtn.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    let model: RegistroUsuarioModel;

    const tipoUsuario = this.valTipoUsuarioFC.value;
    if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL) {
      model = this.mapModelPersonaN();
    }
    else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA) {
      model = this.mapModelPersonaJ();
    }
    else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA) {
      model = this.mapModelPersonaE();
    }
    else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC) {
      model = this.mapModelPersonaNR();
    }
    else {
      this.funcionesMtcService.mensajeError('Error el registro del tipo de usuario no esta implementado');
      return;
    }

    // this.messageError = JSON.stringify(model);

    try {
      const response = await this.seguridadService.postRegistrar(model).toPromise();
      if (response.success) {
        this.funcionesMtcService.mensajeOk(response.message);
        this.router.navigate(['/autenticacion/iniciar-sesion']);
        return;
      }
      else {
        this.funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de registrar nuevo usuario');
    } finally {
      this.valTipoUsuarioFC.reset('');
      this.funcionesMtcService.ocultarCargando();
    }
  }

  mapModelPersonaN(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.regDatosUsuFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.regDatosUsuFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.regDatosUsuFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.regDatosUsuFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.regDatosUsuFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.regDatosUsuFG.rduDniFC,
        email: formValue.regDatosUsuFG.rduEmailFC,
        password: formValue.regDatosUsuFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL,
        numeroDocumento: formValue.regDatosUsuFG.rduDniFC,
        nombre: formValue.regDatosUsuFG.rduNombresFC,
        apellidoPaterno: formValue.regDatosUsuFG.rduApPaternoFC,
        apellidoMaterno: formValue.regDatosUsuFG.rduApMaternoFC,
        direccion: formValue.regDatosUsuFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.regDatosUsuFG.rduEmailFC,
        foto: this.usFoto,
      }
    } as RegistroUsuarioModel;
  }

  mapModelPersonaJ(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.regDatosUsuFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.regDatosUsuFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.regDatosUsuFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.regDatosUsuFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduDniFC.trim();
    }
    else if (formValue.regDatosUsuFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.regDatosUsuFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.regDatosUsuFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }

    const repLegalArray = new Array<RepresentanteLegalModel>();
    formValue.regDatosRepLegalFA.forEach(regDatosRepLegalFG => {
      const rlDepartamento = formatNumber(regDatosRepLegalFG.rdrDepaFC.trim(), this.locale, '2.0-0').trim();
      const rlProvincia = formatNumber(regDatosRepLegalFG.rdrProvFC.trim(), this.locale, '2.0-0').trim();
      const rlDistrito = formatNumber(regDatosRepLegalFG.rdrDistFC.trim(), this.locale, '2.0-0').trim();
      const rlUbigeo = rlDepartamento + rlProvincia + rlDistrito;

      repLegalArray.push({
        numeroDocumento: regDatosRepLegalFG.rdrDniFC,
        nombre: regDatosRepLegalFG.rdrNombresFC,
        apellidoPaterno: regDatosRepLegalFG.rdrApPaternoFC,
        apellidoMaterno: regDatosRepLegalFG.rdrApMaternoFC,
        direccion: regDatosRepLegalFG.rdrDomicilioFC,
        departamento: rlDepartamento,
        provincia: rlProvincia,
        distrito: rlDistrito,
        ubigeo: rlUbigeo,
      } as RepresentanteLegalModel);
    });

    return {
      usuario: {
        userName: formValue.regDatosUsuFG.rduDniFC,
        email: formValue.regDatosUsuFG.rduEmailFC,
        password: formValue.regDatosUsuFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA,
        numeroDocumento,
        nombre: formValue.regDatosUsuFG.rduNombresFC,
        apellidoPaterno: formValue.regDatosUsuFG.rduApPaternoFC,
        apellidoMaterno: formValue.regDatosUsuFG.rduApMaternoFC,
        direccion: formValue.regDatosUsuFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.regDatosUsuFG.rduEmailFC,
        foto: this.usFoto,
      },
      empresa: {
        ruc: formValue.regDatosUsuFG.rduRucFC,
        razonSocial: this.vpjRazonSocialFC.value,
        direccion: formValue.regDatosEmpFG.rdeDireccionFC,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular,
        telefono,
        correoElectronico: formValue.regDatosEmpFG.rdeEmailFC,
        registroPartida: formValue.regDatosUsuFG.rduPartidaFC,
        registroAsiento: formValue.regDatosUsuFG.rduAsientoFC,
        registroOficina: formValue.regDatosUsuFG.rduOficinaFC,
      },
      repLegal: repLegalArray
    } as RegistroUsuarioModel;
  }

  mapModelPersonaE(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.regDatosUsuFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.regDatosUsuFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.regDatosUsuFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.regDatosUsuFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduDniFC.trim();
    }
    else if (formValue.regDatosUsuFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.regDatosUsuFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.regDatosUsuFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.regDatosUsuFG.rduDniFC,
        email: formValue.regDatosUsuFG.rduEmailFC,
        password: formValue.regDatosUsuFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA,
        numeroDocumento,
        nombre: formValue.regDatosUsuFG.rduNombresFC,
        apellidoPaterno: formValue.regDatosUsuFG.rduApPaternoFC,
        apellidoMaterno: formValue.regDatosUsuFG.rduApMaternoFC,
        direccion: formValue.regDatosUsuFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.regDatosUsuFG.rduEmailFC,
      }
    } as RegistroUsuarioModel;
  }

  mapModelPersonaNR(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.regDatosUsuFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.regDatosUsuFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.regDatosUsuFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.regDatosUsuFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.regDatosUsuFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.regDatosUsuFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.regDatosUsuFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.regDatosUsuFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduDniFC.trim();
    }
    else if (formValue.regDatosUsuFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.regDatosUsuFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.regDatosUsuFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.regDatosUsuFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.regDatosUsuFG.rduDniFC,
        email: formValue.regDatosUsuFG.rduEmailFC,
        password: formValue.regDatosUsuFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC,
        numeroDocumento,
        nombre: formValue.regDatosUsuFG.rduNombresFC,
        apellidoPaterno: formValue.regDatosUsuFG.rduApPaternoFC,
        apellidoMaterno: formValue.regDatosUsuFG.rduApMaternoFC,
        direccion: formValue.regDatosUsuFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.regDatosUsuFG.rduEmailFC,
        foto: this.usFoto,
      },
      empresa: {
        ruc: formValue.regDatosUsuFG.rduRucFC,
        razonSocial: this.vpjRazonSocialFC.value,
        direccion: formValue.regDatosEmpFG.rdeDireccionFC,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular,
        telefono,
        correoElectronico: formValue.regDatosEmpFG.rdeEmailFC,
        registroPartida: formValue.regDatosUsuFG.rduPartidaFC,
        registroAsiento: formValue.regDatosUsuFG.rduAsientoFC,
        registroOficina: formValue.regDatosUsuFG.rduOficinaFC,
      }
    } as RegistroUsuarioModel;
  }
}
