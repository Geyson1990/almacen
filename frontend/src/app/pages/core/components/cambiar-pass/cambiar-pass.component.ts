import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/core/models/Autenticacion/UsuarioModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { MustMatch } from 'src/app/helpers/functions';
import { PasswordStrengthValidator } from '../../../../helpers/validator';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.component.html',
  styleUrls: ['./cambiar-pass.component.css']
})
export class CambiarPassComponent implements OnInit {

  cambiarPassFormGroup: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.funcionesMtcService.mostrarCargando();

    this.cambiarPassFormGroup = this.formBuilder.group({
      passActualFormGroup: ['', [Validators.required]],
      passNuevoFormGroup: ['', [Validators.required, PasswordStrengthValidator]],
      confirmPassNuevoFormGroup: ['', [Validators.required, PasswordStrengthValidator]],
    }, {
      validators: [
        MustMatch('passNuevoFormGroup', 'confirmPassNuevoFormGroup'),
      ],
    } as AbstractControlOptions);

    this.funcionesMtcService.ocultarCargando();
  }

  get passActualFormGroup(): AbstractControl { return this.cambiarPassFormGroup.get('passActualFormGroup'); }

  async submitRecuperarPass(submitBtn: HTMLButtonElement): Promise<void> {
    if (!this.cambiarPassFormGroup.valid) {
      return;
    }
    submitBtn.disabled = true;

    const formValue = this.cambiarPassFormGroup.value;

    const usuarioModel = {
      password: formValue.passActualFormGroup,
      newPassword: formValue.passNuevoFormGroup
    } as UsuarioModel;

    try {
      const response = await this.seguridadService.postCambiarPass(usuarioModel).toPromise();

      if (response.success) {
        await this.funcionesMtcService.mensajeOk(response.message);
        this.router.navigate(['/autenticacion/iniciar-sesion']);
        return;
      }
      else {
        this.funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de cambiar contraseña');
    } finally {
      submitBtn.disabled = false;
      this.cambiarPassFormGroup.reset();
    }
  }
}
