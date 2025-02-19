/**
 * Formulario de registro de profesionales para el TUPA DIGITAL
 * @author André Bernabé Pérez
 * @version 1.0 12.08.2021
 */

import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TipoPersonaResponseModel } from 'src/app/core/models/Autenticacion/TipoPersonaResponseModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { MustMatch } from 'src/app/helpers/functions';
import { PasswordStrengthValidator } from 'src/app/helpers/validator';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';
import { ActivatedRoute, Router } from '@angular/router';
import { formatNumber, Location } from '@angular/common';
import { OficinaRegistralService } from 'src/app/core/services/servicios/oficinaregistral.service';
import { OficinaRegistralModel } from 'src/app/core/models/OficinaRegistralModel';
import { PaisService } from 'src/app/core/services/maestros/pais.service';
import { RepresentanteLegalModel } from 'src/app/core/models/Autenticacion/RepresentanteLegalModel';
import { RegistroUsuarioModel } from 'src/app/core/models/Autenticacion/RegistroUsuarioModel';
import { AyudaModalComponent } from 'src/app/pages/autenticacion/components/ayuda-modal/ayuda-modal.component';
import { RepresentanteLegal } from 'src/app/core/models/SunatModel';
import { SelectItemModel } from 'src/app/core/models/SelectItemModel';
import { ProfesionalService } from '../../../../../../core/services/profesional/profesional.service';
import { ItemValidadorDocModel } from 'src/app/core/models/Profesional/Autenticacion/ItemValidadorDocModel';
import { ValidarDocRequestModel } from 'src/app/core/models/Profesional/Autenticacion/ValidarDocRequestModel';

@Component({
  selector: 'app-profesional-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, AfterViewInit {

  @ViewChild('ubigeoEmpresaCmp') ubigeoEmpresaComponent: UbigeoComponent;
  @ViewChild('ubigeoProfesionalCmp') ubigeoProfesionalComponent: UbigeoComponent;

  validacionFG: UntypedFormGroup;
  registroFG: UntypedFormGroup;

  listaTipoPersona: SelectItemModel[];
  listaOficinaRegistral: SelectItemModel[];
  listaProfesion: any[];
  listaValidadorPN: ItemValidadorDocModel[];
  listaValidadorRepLeg: ItemValidadorDocModel[];
  listaRepLeg: RepresentanteLegal[];
  listaTipoDoc: SelectItemModel[];

  messageError: string;

  isDatosValidos = false;
  isDatosRepLegValidos = false;

  usFoto: string;

  modal: NgbModalRef;

  paramState: string;
  paramCode: string;

  constructor(
    private fb: UntypedFormBuilder,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private reniecService: ReniecService,
    private oficinaRegistralService: OficinaRegistralService,
    private paisService: PaisService,
    private profesionalService: ProfesionalService,
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

    this.validacionFG = this.fb.group({
      v_TipoUsuarioFC: ['', [Validators.required]],
      v_PerNatFG: this.fb.group({
        v_pn_TipoDocFC: ['', [Validators.required]],
        v_pn_NumDocFC: ['', [Validators.required, Validators.maxLength(8)]],
        v_pn_ValidaFA: this.fb.array([], [Validators.required]),
      }),
      v_PerJurFG: this.fb.group({
        v_pj_RazonSocialFC: ['', [Validators.required]],
        v_pj_DecJurFC: [false, [Validators.requiredTrue]],
      })
    });

    this.registroFG = this.fb.group({
      r_DatosEmpresaFG: this.fb.group({
        r_de_RucFC: ['', [Validators.required]],
        r_de_DireccionFC: ['', [Validators.required]],
        r_de_DepartamentoFC: ['', [Validators.required]],
        r_de_ProvinciaFC: ['', [Validators.required]],
        r_de_DistritoFC: ['', [Validators.required]],
      }),
      r_DatosProfesionalFG: this.fb.group({
        r_dp_TipoDocFC: ['', [Validators.required]],
        r_dp_ValidaRepLegFG: this.fb.group({
          r_dp_vrl_TipoDocFC: ['', [Validators.required]],
          r_dp_vrl_NumDocFC: ['', [Validators.required, Validators.maxLength(8)]],
          r_dp_vrl_ValidaFA: this.fb.array([], [Validators.required]),
        }),
        r_dp_NombresFC: ['', [Validators.required]],
        r_dp_ApPaternoFC: ['', [Validators.required, Validators.maxLength(8)]],
        r_dp_ApMaternoFC: ['', [Validators.required, Validators.maxLength(9)]],
        r_dp_DepartamentoFC: ['', [Validators.required]],
        r_dp_ProvinciaFC: ['', [Validators.required]],
        r_dp_DistritoFC: ['', [Validators.required]],
        r_dp_DomLegalFC: ['', [Validators.required]],
        r_dp_ConDomLegalFC: [false, [Validators.requiredTrue]],
        r_dp_GeneroFC: [false, [Validators.requiredTrue]],
        r_dp_FotoFC: ['', [Validators.required]],
        r_dp_DigVerificaFC: ['', [Validators.required]],
        r_dp_ProfesionFC: ['', [Validators.required]],
        r_dp_CelularFC: ['', [Validators.required]],
        r_dp_TelefonoFC: ['', [Validators.required]],
        r_dp_EmailFC: ['', [Validators.required, Validators.email]],
        r_dp_PasswordFC: ['', [Validators.required, PasswordStrengthValidator]],
        r_dp_ConPasswordFC: ['', [Validators.required]],
        r_dp_RepLegalFG: this.fb.group({
          r_dp_rl_OficinaFC: ['', [Validators.required, Validators.maxLength(9)]],
          r_dp_rl_PartidaFC: ['', [Validators.maxLength(7)]],
          r_dp_rl_AsientoFC: ['', [Validators.required]],
        })
      },
        {
          validators: [
            MustMatch('r_dp_PasswordFC', 'r_dp_ConPasswordFC')
          ],
        } as AbstractControlOptions),
      r_TerminosFC: [false, [Validators.requiredTrue]],
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await this.poblarTipoPersona();
    await this.poblarOficinaRegistral();

    this.v_PerNatFG.disable({ emitEvent: false });
    this.v_PerJurFG.disable({ emitEvent: false });

    this.onChangeTipoUsuario();
    this.onChangeTipoDocPN();
    this.onChangeParams();

    this.funcionesMtcService.ocultarCargando();
  }

  // GET FORM validacionFG
  get v_TipoUsuarioFC(): AbstractControl { return this.validacionFG.get('v_TipoUsuarioFC'); }

  get v_PerNatFG(): UntypedFormGroup { return this.validacionFG.get('v_PerNatFG') as UntypedFormGroup; }
  get v_pn_TipoDocFC(): UntypedFormControl { return this.v_PerNatFG.get(['v_pn_TipoDocFC']) as UntypedFormControl; }
  get v_pn_NumDocFC(): UntypedFormControl { return this.v_PerNatFG.get(['v_pn_NumDocFC']) as UntypedFormControl; }
  get v_pn_ValidaFA(): UntypedFormArray { return this.v_PerNatFG.get(['v_pn_ValidaFA']) as UntypedFormArray; }
  vpn_NameId(index: string): UntypedFormControl { return this.v_pn_ValidaFA.get([index, 'vpn_NameId']) as UntypedFormControl; }
  vpn_Value(index: string): UntypedFormControl { return this.v_pn_ValidaFA.get([index, 'vpn_Value']) as UntypedFormControl; }

  get v_PerJurFG(): UntypedFormGroup { return this.validacionFG.get('v_PerJurFG') as UntypedFormGroup; }
  get v_pj_RazonSocialFC(): AbstractControl { return this.v_PerJurFG.get(['v_pj_RazonSocialFC']); }
  get v_pj_DecJurFC(): AbstractControl { return this.v_PerJurFG.get(['v_pj_DecJurFC']); }
  // GET FORM validacionFG

  // GET FORM registroFG
  get r_DatosEmpresaFG(): UntypedFormGroup { return this.registroFG.get('r_DatosEmpresaFG') as UntypedFormGroup; }
  get r_de_RucFC(): UntypedFormControl { return this.r_DatosEmpresaFG.get(['r_de_RucFC']) as UntypedFormControl; }
  get r_de_DireccionFC(): UntypedFormControl { return this.r_DatosEmpresaFG.get(['r_de_DireccionFC']) as UntypedFormControl; }
  get r_de_DepartamentoFC(): UntypedFormControl { return this.r_DatosEmpresaFG.get(['r_de_DepartamentoFC']) as UntypedFormControl; }
  get r_de_ProvinciaFC(): UntypedFormControl { return this.r_DatosEmpresaFG.get(['r_de_ProvinciaFC']) as UntypedFormControl; }
  get r_de_DistritoFC(): UntypedFormControl { return this.r_DatosEmpresaFG.get(['r_de_DistritoFC']) as UntypedFormControl; }

  get r_DatosProfesionalFG(): UntypedFormGroup { return this.registroFG.get('r_DatosProfesionalFG') as UntypedFormGroup; }
  get r_dp_TipoDocFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_TipoDocFC']) as UntypedFormControl; }
  get r_dp_ValidaRepLegFG(): UntypedFormGroup { return this.r_DatosProfesionalFG.get('r_dp_ValidaRepLegFG') as UntypedFormGroup; }
  get r_dp_vrl_TipoDocFC(): UntypedFormControl { return this.r_dp_ValidaRepLegFG.get(['r_dp_vrl_TipoDocFC']) as UntypedFormControl; }
  get r_dp_vrl_NumDocFC(): UntypedFormControl { return this.r_dp_ValidaRepLegFG.get(['r_dp_vrl_NumDocFC']) as UntypedFormControl; }
  get r_dp_vrl_ValidaFA(): UntypedFormArray { return this.r_dp_ValidaRepLegFG.get(['r_dp_vrl_ValidaFA']) as UntypedFormArray; }
  vrl_NameId(index: string): UntypedFormControl { return this.r_dp_vrl_ValidaFA.get([index, 'vrl_NameId']) as UntypedFormControl; }
  vrl_Value(index: string): UntypedFormControl { return this.r_dp_vrl_ValidaFA.get([index, 'vrl_Value']) as UntypedFormControl; }
  get r_dp_NombresFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_NombresFC']) as UntypedFormControl; }
  get r_dp_ApPaternoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ApPaternoFC']) as UntypedFormControl; }
  get r_dp_ApMaternoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ApMaternoFC']) as UntypedFormControl; }
  get r_dp_DepartamentoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_DepartamentoFC']) as UntypedFormControl; }
  get r_dp_ProvinciaFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ProvinciaFC']) as UntypedFormControl; }
  get r_dp_DistritoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_DistritoFC']) as UntypedFormControl; }
  get r_dp_DomLegalFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_DomLegalFC']) as UntypedFormControl; }
  get r_dp_ConDomLegalFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ConDomLegalFC']) as UntypedFormControl; }
  get r_dp_GeneroFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_GeneroFC']) as UntypedFormControl; }
  get r_dp_FotoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_FotoFC']) as UntypedFormControl; }
  get r_dp_DigVerificaFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_DigVerificaFC']) as UntypedFormControl; }
  get r_dp_ProfesionFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ProfesionFC']) as UntypedFormControl; }
  get r_dp_CelularFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_CelularFC']) as UntypedFormControl; }
  get r_dp_TelefonoFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_TelefonoFC']) as UntypedFormControl; }
  get r_dp_EmailFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_EmailFC']) as UntypedFormControl; }
  get r_dp_PasswordFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_PasswordFC']) as UntypedFormControl; }
  get r_dp_ConPasswordFC(): UntypedFormControl { return this.r_DatosProfesionalFG.get(['r_dp_ConPasswordFC']) as UntypedFormControl; }
  get r_dp_RepLegalFG(): UntypedFormGroup { return this.r_DatosProfesionalFG.get(['r_dp_RepLegalFG']) as UntypedFormGroup; }
  get r_dp_rl_OficinaFC(): UntypedFormControl { return this.r_dp_RepLegalFG.get(['r_dp_rl_OficinaFC']) as UntypedFormControl; }
  get r_dp_rl_PartidaFC(): UntypedFormControl { return this.r_dp_RepLegalFG.get(['r_dp_rl_PartidaFC']) as UntypedFormControl; }
  get r_dp_rl_AsientoFC(): UntypedFormControl { return this.r_dp_RepLegalFG.get(['r_dp_rl_AsientoFC']) as UntypedFormControl; }

  get r_TerminosFC(): UntypedFormControl { return this.registroFG.get('r_TerminosFC') as UntypedFormControl; }
  // GET FORM registroFG

  get isPerJur(): boolean {
    return (this.v_TipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA);
  }
  get isPerNat(): boolean {
    return (this.v_TipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL);
  }
  get isPerExt(): boolean {
    return (this.v_TipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA);
  }
  get isPerNatRuc(): boolean {
    return (this.v_TipoUsuarioFC?.value === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC);
  }

  addValidadorPNFG(itemValidadorPN: ItemValidadorDocModel): void {
    const validadorPNFG = this.fb.group({
      vpn_NameId: [itemValidadorPN.nameId, [Validators.required]],
      vpn_Value: ['', [Validators.required]],
    });
    this.v_pn_ValidaFA.push(validadorPNFG);
  }

  addValidadorRepLegFG(itemValidadorPN: ItemValidadorDocModel): void {
    const validadorRepLegFG = this.fb.group({
      vrl_NameId: [itemValidadorPN.nameId, [Validators.required]],
      vrl_Value: ['', [Validators.required]],
    });
    this.r_dp_vrl_ValidaFA.push(validadorRepLegFG);
  }

  async poblarTipoPersona(): Promise<void> {
    try {
      const response = await this.seguridadService.getTipoPersonas().toPromise();
      this.listaTipoPersona = response.map((item) => {
        return { value: item.codigo, text: item.descripcion } as SelectItemModel;
      });
      console.log('listaTipoPersona: ', this.listaTipoPersona);
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los tipos de persona');
    }
  }

  async poblarTipoDocumentoPE(): Promise<void> {
    try {
      const response = await this.seguridadService.getTipoDocumentosPersonaExtranjera().toPromise();
      this.listaTipoDoc = response.map((item) => {
        return { value: item.codigo, text: item.descripcion } as SelectItemModel;
      });
      console.log('listaTipoDoc: ', this.listaTipoDoc);
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener los tipos de documentos');
    }
  }

  async poblarTipoDocumentoPN(): Promise<void> {
    this.listaTipoDoc = new Array<SelectItemModel>();
    this.listaTipoDoc.push({
      value: '00002',
      text: 'DNI'
    } as SelectItemModel);
  }

  async poblarOficinaRegistral(): Promise<void> {
    try {
      this.listaOficinaRegistral = await this.oficinaRegistralService.oficinaRegistral().toPromise();
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de obtener las oficinas registrales');
    }
  }

  // async poblarPaises(): Promise<void> {
  //   try {
  //     this.listaProfesion = await this.paisService.getAll<any>().toPromise();
  //   } catch (e) {
  //     this.funcionesMtcService.mensajeError('Error en el servicio de obtener los paises');
  //   }
  // }

  onChangeTipoUsuario(): void {
    this.v_TipoUsuarioFC.valueChanges.subscribe(async (tipoUsuario: string) => {
      console.log('tipoUsuario valuechanges: ', tipoUsuario);

      this.isDatosValidos = false;
      this.messageError = '';

      this.v_PerNatFG.reset();
      this.v_PerJurFG.reset();
      this.registroFG.reset();

      switch (tipoUsuario) {
        case CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL:
          this.v_PerNatFG.enable({ emitEvent: false });
          this.v_PerJurFG.disable({ emitEvent: false });

          this.r_DatosEmpresaFG.disable({ emitEvent: false });
          this.r_DatosProfesionalFG.enable({ emitEvent: false });

          this.r_dp_RepLegalFG.disable({ emitEvent: false });

          await this.poblarTipoDocumentoPN();
          this.v_pn_TipoDocFC.setValue('00002');
          this.v_pn_TipoDocFC.disable({ emitEvent: false });
          break;
        case CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA:
          this.v_PerNatFG.disable({ emitEvent: false });
          this.v_PerJurFG.enable({ emitEvent: false });

          this.r_DatosEmpresaFG.enable({ emitEvent: false });
          this.r_DatosProfesionalFG.enable({ emitEvent: false });

          this.r_dp_RepLegalFG.enable({ emitEvent: false });
          break;
        case CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA:
          this.v_PerNatFG.enable({ emitEvent: false });
          this.v_PerJurFG.disable({ emitEvent: false });

          this.r_DatosEmpresaFG.disable({ emitEvent: false });
          this.r_DatosProfesionalFG.enable({ emitEvent: false });

          this.r_dp_RepLegalFG.disable({ emitEvent: false });

          await this.poblarTipoDocumentoPE();
          this.v_pn_TipoDocFC.setValue('');
          break;
        case CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC:
          this.v_PerNatFG.disable({ emitEvent: false });
          this.v_PerJurFG.enable({ emitEvent: false });

          this.r_DatosEmpresaFG.enable({ emitEvent: false });
          this.r_DatosProfesionalFG.enable({ emitEvent: false });

          this.r_dp_RepLegalFG.disable({ emitEvent: false });
          break;
        default:
          this.v_PerNatFG.disable({ emitEvent: false });
          this.v_PerJurFG.disable({ emitEvent: false });
          this.registroFG.disable({ emitEvent: false });
          break;
      }
    });
  }

  onChangeTipoDocPN(): void {
    this.v_pn_TipoDocFC.valueChanges.subscribe(async (tipoDoc: string) => {
      console.log('tipoDoc valuechanges: ', tipoDoc);

      this.v_pn_NumDocFC.reset('', { emitEvent: false });
      this.v_pn_ValidaFA.reset('', { emitEvent: false });

      if (!tipoDoc) {
        this.v_pn_NumDocFC.disable({ emitEvent: false });
        this.v_pn_ValidaFA.disable({ emitEvent: false });
        return;
      }

      this.v_pn_NumDocFC.enable({ emitEvent: false });
      this.v_pn_ValidaFA.enable({ emitEvent: false });

      try {
        const response = await this.profesionalService.getObtenerValidadorList(tipoDoc).toPromise();
        this.listaValidadorPN = response;
      } catch (error) {
        console.log(error);
      }
    });
  }

  onChangeTipoDocRepLeg(): void {
    this.r_dp_TipoDocFC.valueChanges.subscribe(async (tipoDoc: string) => {

      this.r_dp_vrl_NumDocFC.reset('', { emitEvent: false });
      this.r_dp_vrl_ValidaFA.reset('', { emitEvent: false });

      if (tipoDoc?.length <= 0) {
        this.r_dp_vrl_NumDocFC.disable({ emitEvent: false });
        this.r_dp_vrl_ValidaFA.disable({ emitEvent: false });
        return;
      }

      this.r_dp_vrl_NumDocFC.enable({ emitEvent: false });
      this.r_dp_vrl_ValidaFA.enable({ emitEvent: false });

      try {
        const response = await this.profesionalService.getObtenerValidadorList(tipoDoc).toPromise();
        this.listaValidadorRepLeg = response;
      } catch (error) {
        console.log(error);
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

  validaPJ(btnSubmit: HTMLButtonElement): void {
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
        if (!response) {
          this.funcionesMtcService.mensajeError('No se pudo obtener el numero de RUC');
          return;
        }

        this.v_pj_RazonSocialFC.setValue(response.razonSocial);
        this.isDatosValidos = true;

        this.r_de_RucFC.setValue(response.nroDocumento);
        this.r_de_DireccionFC.setValue(response.domicilioLegal);

        this.ubigeoEmpresaComponent.setUbigeoByText(
          response.nombreDepartamento,
          response.nombreProvincia,
          response.nombreDistrito);

        this.r_dp_CelularFC.setValue(response.celular);
        this.r_dp_TelefonoFC.setValue(response.telefono);
        this.r_dp_EmailFC.setValue(response.correo);

        const codIniRuc = response.nroDocumento.substring(0, 2);
        if (codIniRuc === '10') {
          this.v_TipoUsuarioFC.setValue(CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC);

          this.r_dp_TipoDocFC.setValue('01');

          const numDNI = response.nroDocumento.substring(2, 10);
          // this.r_dp_NumDocFC.setValue(numDNI);
        }
        else {
          this.v_TipoUsuarioFC.setValue(CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA);

          this.listaRepLeg = response.representanteLegal;
          if (this.listaRepLeg?.length > 0) {
            const repLegal = this.listaRepLeg[0];
            if (repLegal.tipoDocumento === '1') {  // DNI
              this.r_dp_TipoDocFC.setValue('01');
            }
            else {
              this.r_dp_TipoDocFC.setValue('04');
            }
            // this.r_dp_NumDocFC.setValue(repLegal.nroDocumento);
          }
        }
        // this.buscarNumeroDocumentoRepLeg();
      } catch (e) {
        this.funcionesMtcService.mensajeError('Error en el servicio de obtener datos de la SUNAT');
      } finally {
        this.funcionesMtcService.ocultarCargando();
      }
    }
  }
  // El mismo servicio de VAlidar Datos tendra que devolver la info del profesional
  // async buscarNumeroDocumentoRepLeg(): Promise<void> {
  //   const tipoDocumento: string = this.r_dp_TipoDocFC.value;
  //   const numeroDocumento: string = this.r_dp_NumDocFC.value;

  //   this.funcionesMtcService.mostrarCargando();

  //   if (tipoDocumento === '01') {// DNI
  //     try {
  //       const respuesta = await this.reniecService.getDni(numeroDocumento).toPromise();

  //       this.funcionesMtcService.ocultarCargando();

  //       if (respuesta.reniecConsultDniResponse.listaConsulta.coResultado !== '0000') {
  //         return this.funcionesMtcService.mensajeError('Número de documento no registrado en RENIEC');
  //       }

  //       const { prenombres, apPrimer, apSegundo, direccion, ubigeo } = respuesta.reniecConsultDniResponse.listaConsulta.datosPersona;
  //       const [departamento, provincia, distrito] = ubigeo.split('/');

  //       this.setRepLegal(
  //         prenombres,
  //         apPrimer,
  //         apSegundo,
  //         direccion,
  //         departamento,
  //         provincia,
  //         distrito
  //       );
  //     }
  //     catch (e) {
  //       console.error(e);
  //       this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Reniec);
  //     }
  //   } else if (tipoDocumento === '04') {// CARNÉ DE EXTRANJERÍA
  //     try {
  //       const { CarnetExtranjeria } = await this.extranjeriaService.getCE(numeroDocumento).toPromise();
  //       console.log(CarnetExtranjeria);
  //       const { numRespuesta, nombres, primerApellido, segundoApellido } = CarnetExtranjeria;

  //       this.funcionesMtcService.ocultarCargando();

  //       if (numRespuesta !== '0000') {
  //         return this.funcionesMtcService.mensajeError('Número de documento no registrado en MIGRACIONES');
  //       }

  //       this.setRepLegal(
  //         nombres,
  //         primerApellido,
  //         segundoApellido,
  //         '',
  //         '',
  //         '',
  //         ''
  //       );
  //     }
  //     catch (e) {
  //       console.error(e);
  //       this.funcionesMtcService.ocultarCargando().mensajeError(CONSTANTES.MensajeError.Migraciones);
  //     }
  //   }
  // }

  async setRepLegal(
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    direccion: string,
    departamento: string,
    provincia: string,
    distrito: string): Promise<void> {

    this.r_dp_NombresFC.setValue(nombres);
    this.r_dp_ApPaternoFC.setValue(apPaterno);
    this.r_dp_ApMaternoFC.setValue(apMaterno);
    this.r_dp_DomLegalFC.setValue(direccion);

    await this.ubigeoProfesionalComponent?.setUbigeoByText(
      departamento,
      provincia,
      distrito);
  }

  async validaPN(btnSubmit: HTMLButtonElement): Promise<void> {
    btnSubmit.disabled = true;

    const request = new ValidarDocRequestModel();
    request.tipoDoc = this.v_pn_TipoDocFC.value;
    request.numDocumento = this.v_pn_NumDocFC.value;
    request.listaItemValidador = new Array<ItemValidadorDocModel>();

    for (const item of this.v_pn_ValidaFA.value) {
      const validador = new ItemValidadorDocModel();
      validador.nameId = item.vpn_NameId;
      validador.value = item.vpn_Value;
      request.listaItemValidador.push(validador);
    }

    try {
      const response = await this.profesionalService.postValidarDocumento(request).toPromise();
      if (!response.success) {
        this.funcionesMtcService.mensajeError(response.message);
      }

      const { reniecResponse, migracionResponse } = response;
      if (this.v_pn_TipoDocFC.value === CONSTANTES.TipoDocPersona.DNI) {
        this.r_dp_NombresFC.setValue(reniecResponse.prenombres);
        this.r_dp_ApPaternoFC.setValue(reniecResponse.apPrimer);
        this.r_dp_ApMaternoFC.setValue(reniecResponse.apSegundo);

        const [departamento, provincia, distrito] = reniecResponse.ubigeo.split('/');
        this.ubigeoProfesionalComponent.setUbigeoByText(departamento, provincia, distrito);

        this.usFoto = reniecResponse.foto;
      }
      if (this.v_pn_TipoDocFC.value === CONSTANTES.TipoDocPersona.CARNET_EXTRANJERIA) {
        this.r_dp_NombresFC.setValue(migracionResponse.nombres);
        this.r_dp_ApPaternoFC.setValue(migracionResponse.primerApellido);
        this.r_dp_ApMaternoFC.setValue(migracionResponse.segundoApellido);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async validaProf(btnSubmit: HTMLButtonElement): Promise<void> {
    btnSubmit.disabled = true;

    const tipoDoc: string = this.r_dp_vrl_TipoDocFC.value;
    const numDoc: string = this.r_dp_vrl_NumDocFC.value;
    const listValidador = new Array<ItemValidadorDocModel>();

    for (const item of this.r_dp_vrl_ValidaFA.value) {
      const validador = new ItemValidadorDocModel();
      validador.nameId = item.vpn_NameId;
      validador.value = item.vpn_Value;
      listValidador.push(validador);
    }

    // Evaluar si el tipo de docuemtno es DNI o CE
    // try {
    //   const response = await this.servicio.validaPN();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  formatStringToCompare(value: string): string {
    // return value?.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return value?.trim().toUpperCase();
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
    this.v_pj_DecJurFC.setValue(true);
    this.modal.close();
  }

  acceptTerCon(): void {
    this.r_TerminosFC.setValue(true);
    this.modal.close();
  }

  async submitRegistro(submitBtn: HTMLButtonElement): Promise<void> {
    if (this.registroFG.invalid) {
      return;
    }
    submitBtn.disabled = true;
    this.funcionesMtcService.mostrarCargando();

    let model: RegistroUsuarioModel;

    const tipoUsuario = this.v_TipoUsuarioFC.value;
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
      this.v_TipoUsuarioFC.reset('');
      this.funcionesMtcService.ocultarCargando();
    }
  }

  mapModelPersonaN(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.r_DatosProfesionalFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.r_DatosProfesionalFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.r_DatosProfesionalFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.r_DatosProfesionalFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.r_DatosProfesionalFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.r_DatosProfesionalFG.rduDniFC,
        email: formValue.r_DatosProfesionalFG.rduEmailFC,
        password: formValue.r_DatosProfesionalFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL,
        numeroDocumento: formValue.r_DatosProfesionalFG.rduDniFC,
        nombre: formValue.r_DatosProfesionalFG.rduNombresFC,
        apellidoPaterno: formValue.r_DatosProfesionalFG.rduApPaternoFC,
        apellidoMaterno: formValue.r_DatosProfesionalFG.rduApMaternoFC,
        direccion: formValue.r_DatosProfesionalFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.r_DatosProfesionalFG.rduEmailFC,
        foto: this.usFoto,
      }
    } as RegistroUsuarioModel;
  }

  mapModelPersonaJ(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.r_DatosProfesionalFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.r_DatosProfesionalFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.r_DatosProfesionalFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.r_DatosProfesionalFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduDniFC.trim();
    }
    else if (formValue.r_DatosProfesionalFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.r_DatosProfesionalFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.r_DatosProfesionalFG.rduPaisFC.trim().split('-', 2);
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
        userName: formValue.r_DatosProfesionalFG.rduDniFC,
        email: formValue.r_DatosProfesionalFG.rduEmailFC,
        password: formValue.r_DatosProfesionalFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA,
        numeroDocumento,
        nombre: formValue.r_DatosProfesionalFG.rduNombresFC,
        apellidoPaterno: formValue.r_DatosProfesionalFG.rduApPaternoFC,
        apellidoMaterno: formValue.r_DatosProfesionalFG.rduApMaternoFC,
        direccion: formValue.r_DatosProfesionalFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.r_DatosProfesionalFG.rduEmailFC,
        foto: this.usFoto,
      },
      empresa: {
        ruc: formValue.r_DatosProfesionalFG.rduRucFC,
        razonSocial: this.v_pj_RazonSocialFC.value,
        direccion: formValue.r_DatosEmpresaFG.r_de_DireccionFC,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular,
        telefono,
        correoElectronico: formValue.r_DatosEmpresaFG.r_de_RucFC,
        registroPartida: formValue.r_DatosProfesionalFG.rduPartidaFC,
        registroAsiento: formValue.r_DatosProfesionalFG.rduAsientoFC,
        registroOficina: formValue.r_DatosProfesionalFG.rduOficinaFC,
      },
      repLegal: repLegalArray
    } as RegistroUsuarioModel;
  }

  mapModelPersonaE(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.r_DatosProfesionalFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.r_DatosProfesionalFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.r_DatosProfesionalFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.r_DatosProfesionalFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduDniFC.trim();
    }
    else if (formValue.r_DatosProfesionalFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.r_DatosProfesionalFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.r_DatosProfesionalFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.r_DatosProfesionalFG.rduDniFC,
        email: formValue.r_DatosProfesionalFG.rduEmailFC,
        password: formValue.r_DatosProfesionalFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA,
        numeroDocumento,
        nombre: formValue.r_DatosProfesionalFG.rduNombresFC,
        apellidoPaterno: formValue.r_DatosProfesionalFG.rduApPaternoFC,
        apellidoMaterno: formValue.r_DatosProfesionalFG.rduApMaternoFC,
        direccion: formValue.r_DatosProfesionalFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.r_DatosProfesionalFG.rduEmailFC,
      }
    } as RegistroUsuarioModel;
  }

  mapModelPersonaNR(): RegistroUsuarioModel {
    const formValue = this.registroFG.value;
    let usTelefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      usTelefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let usCelular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      usCelular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    const usDepartamento = formatNumber(formValue.r_DatosProfesionalFG.rduDepaFC.trim(), this.locale, '2.0-0');
    const usProvincia = formatNumber(formValue.r_DatosProfesionalFG.rduProvFC.trim(), this.locale, '2.0-0');
    const usDistrito = formatNumber(formValue.r_DatosProfesionalFG.rduDistFC.trim(), this.locale, '2.0-0');
    const usUbigeo = usDepartamento + usProvincia + usDistrito;

    let telefono: string;
    if (formValue.r_DatosProfesionalFG.rduTelefonoFC?.trim().length > 0) {
      telefono = formValue.r_DatosProfesionalFG.rduTelefonoFC.trim();
    }
    let celular: string;
    if (formValue.r_DatosProfesionalFG.rduCelularFC?.trim().length > 0) {
      celular = formValue.r_DatosProfesionalFG.rduCelularFC.trim();
    }
    let numeroDocumento: string;
    if (formValue.r_DatosProfesionalFG.rduDniFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduDniFC.trim();
    }
    else if (formValue.r_DatosProfesionalFG.rduCeFC?.trim().length > 0) {
      numeroDocumento = formValue.r_DatosProfesionalFG.rduCeFC.trim();
    }
    let paisCodigo: string;
    let paisNombre: string;
    if (formValue.r_DatosProfesionalFG.rduPaisFC?.trim().length > 0) {
      const pais = formValue.r_DatosProfesionalFG.rduPaisFC.trim().split('-', 2);
      paisCodigo = pais[0];
      paisNombre = pais[1];
    }
    return {
      usuario: {
        userName: formValue.r_DatosProfesionalFG.rduDniFC,
        email: formValue.r_DatosProfesionalFG.rduEmailFC,
        password: formValue.r_DatosProfesionalFG.rduPasswordFC,
      },
      persona: {
        tipoPersona: CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC,
        numeroDocumento,
        nombre: formValue.r_DatosProfesionalFG.rduNombresFC,
        apellidoPaterno: formValue.r_DatosProfesionalFG.rduApPaternoFC,
        apellidoMaterno: formValue.r_DatosProfesionalFG.rduApMaternoFC,
        direccion: formValue.r_DatosProfesionalFG.rduDomicilioFC,
        paisCodigo,
        paisNombre,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular: usCelular,
        telefono: usTelefono,
        correoElectronico: formValue.r_DatosProfesionalFG.rduEmailFC,
        foto: this.usFoto,
      },
      empresa: {
        ruc: formValue.r_DatosProfesionalFG.rduRucFC,
        razonSocial: this.v_pj_RazonSocialFC.value,
        direccion: formValue.r_DatosEmpresaFG.r_de_DireccionFC,
        departamento: usDepartamento,
        provincia: usProvincia,
        distrito: usDistrito,
        ubigeo: usUbigeo,
        celular,
        telefono,
        correoElectronico: formValue.r_DatosEmpresaFG.r_de_RucFC,
        registroPartida: formValue.r_DatosProfesionalFG.rduPartidaFC,
        registroAsiento: formValue.r_DatosProfesionalFG.rduAsientoFC,
        registroOficina: formValue.r_DatosProfesionalFG.rduOficinaFC,
      }
    } as RegistroUsuarioModel;
  }
}
