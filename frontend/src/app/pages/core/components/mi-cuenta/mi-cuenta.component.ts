import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroUsuarioModel } from 'src/app/core/models/Autenticacion/RegistroUsuarioModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { UbigeoService } from 'src/app/core/services/maestros/ubigeo.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { ExtranjeriaService } from 'src/app/core/services/servicios/extranjeria.service';
import { ReniecService } from 'src/app/core/services/servicios/reniec.service';
import { SunatService } from 'src/app/core/services/servicios/sunat.service';
import { CONSTANTES } from 'src/app/enums/constants';
import { UbigeoComponent } from 'src/app/shared/components/forms/ubigeo/ubigeo.component';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {

  @ViewChild('ubigeoCmp') ubigeoComponent: UbigeoComponent;

  registroFormGroup: UntypedFormGroup;

  messageError: string;

  usFoto: string;

  tipoUsuario: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private seguridadService: SeguridadService,
    private router: Router,
    private funcionesMtcService: FuncionesMtcService,
    private extranjeriaService: ExtranjeriaService,
    private sunatService: SunatService,
    private reniecService: ReniecService,
    private ubigeoService: UbigeoService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit(): Promise<void> {
    this.funcionesMtcService.mostrarCargando();

    this.registroFormGroup = this.formBuilder.group({
      datosEmpresa: this.formBuilder.group({
        rucFormControl: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(11)]],
        razonSocialFormControl: [{ value: '', disabled: true }, [Validators.required]],
        emailFormControl: ['', [Validators.required, Validators.email]],
        direccionFormControl: ['', [Validators.required]],
        confirmDirEmpFormControl: ['', [Validators.requiredTrue]],
      }),
      datosUsuario: this.formBuilder.group({
        rucFormControl: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(11)]],
        dniFormControl: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(8)]],
        nombresFormControl: [{ value: '', disabled: true }, [Validators.required]],
        apPaternoFormControl: [{ value: '', disabled: true }, [Validators.required]],
        apMaternoFormControl: [{ value: '', disabled: true }, [Validators.required]],
        domicilioFormControl: ['', [Validators.required]],
        confirmDomLegFormControl: ['', [Validators.requiredTrue]],
        depaFormControl: ['', [Validators.required]],
        provFormControl: ['', [Validators.required]],
        distFormControl: ['', [Validators.required]],
        emailFormControl: ['', [Validators.required, Validators.email]],
        celularFormControl: [''],
        notCelularFormControl: [''],
        codTelFijoFormControl: [''],
        telFijoFormControl: [''],
      }),
    });

    this.funcionesMtcService.ocultarCargando();
  }

  get rucFormControl(): AbstractControl { return this.registroFormGroup.get(['datosEmpresa', 'rucFormControl']); }
  get razonSocialFormControl(): AbstractControl { return this.registroFormGroup.get(['datosEmpresa', 'razonSocialFormControl']); }
  get emailFormControl(): AbstractControl { return this.registroFormGroup.get(['datosEmpresa', 'emailFormControl']); }
  get direccionFormControl(): AbstractControl { return this.registroFormGroup.get(['datosEmpresa', 'direccionFormControl']); }
  get confirmDirEmpFormControl(): AbstractControl { return this.registroFormGroup.get(['datosEmpresa', 'confirmDirEmpFormControl']); }

  get usRucFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'rucFormControl']); }
  get usDniFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'dniFormControl']); }
  get nombresFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'nombresFormControl']); }
  get apPaternoFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'apPaternoFormControl']); }
  get apMaternoFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'apMaternoFormControl']); }
  get domicilioFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'domicilioFormControl']); }
  get confirmDomLegFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'confirmDomLegFormControl']); }
  get depaFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'depaFormControl']); }
  get provFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'provFormControl']); }
  get distFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'distFormControl']); }
  get usEmailFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'emailFormControl']); }
  get celularFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'celularFormControl']); }
  get notCelularFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'notCelularFormControl']); }
  get codTelFijoFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'codTelFijoFormControl']); }
  get telFijoFormControl(): AbstractControl { return this.registroFormGroup.get(['datosUsuario', 'telFijoFormControl']); }

  get mostrarPersonaJ(): boolean {
    return (this.tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA);
  }
  get mostrarPersonaN(): boolean {
    return (this.tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL);
  }
  get mostrarPersonaE(): boolean {
    return (this.tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA);
  }
  get mostrarPersonaNR(): boolean {
    return (this.tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC);
  }

  async submitRegistro(submitBtn: HTMLButtonElement): Promise<void> {
    if (this.registroFormGroup.invalid) {
      return;
    }

    submitBtn.disabled = true;

    let model = this.mapModelPersona();

    model.persona.tipoPersona = this.tipoUsuario;

    this.messageError = JSON.stringify(model);

    // try {
    //   const response = await this.seguridadService.postActualizar(model).toPromise();
    //   if (response.success) {
    //     this.funcionesMtcService.mensajeOk(response.result);
    //   }
    //   else {
    //     this.funcionesMtcService.mensajeError(response.result);
    //   }
    // } catch (e) {
    //   this.funcionesMtcService.mensajeError('Error en el servicio de actualizar usuario');
    // }
  }

  mapModelPersona(): RegistroUsuarioModel {
    const formValue = this.registroFormGroup.value;
    let telefono: string;
    if (formValue.datosUsuario.telFijoFormControl?.trim().length > 0) {
      telefono = (formValue.datosUsuario.codTelFijoFormControl?.trim() ?? '') + formValue.datosUsuario.telFijoFormControl.trim();
    }
    let celular: string;
    if (formValue.datosUsuario.celularFormControl?.trim().length > 0) {
      celular = formValue.datosUsuario.celularFormControl.trim();
    }
    return {
      usuario: {
        email: formValue.datosUsuario.emailFormControl,
      },
      persona: {
        direccion: formValue.datosUsuario.domicilioFormControl,
        departamento: formValue.datosUsuario.depaFormControl,
        provincia: formValue.datosUsuario.provFormControl,
        distrito: formValue.datosUsuario.distFormControl,
        celular,
        telefono,
        correoElectronico: formValue.datosUsuario.emailFormControl,
        foto: this.usFoto,
      },
      empresa: {
        direccion: formValue.datosEmpresa.direccionFormControl,
        departamento: formValue.datosUsuario.depaFormControl,
        provincia: formValue.datosUsuario.provFormControl,
        distrito: formValue.datosUsuario.distFormControl,
        celular,
        telefono,
        correoElectronico: formValue.datosEmpresa.emailFormControl,
      },
      repLegal: [{
        direccion: formValue.datosUsuario.domicilioFormControl,
        departamento: formValue.datosUsuario.depaFormControl,
        provincia: formValue.datosUsuario.provFormControl,
        distrito: formValue.datosUsuario.distFormControl,
      }]
    } as RegistroUsuarioModel;
  }

}
