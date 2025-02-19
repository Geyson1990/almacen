import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/core/models/Autenticacion/UsuarioModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.css']
})
export class RecuperarPassComponent implements OnInit {

  recuperarPassFormGroup: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.funcionesMtcService.mostrarCargando();

    this.recuperarPassFormGroup = this.formBuilder.group({
      emailFormControl: ['', [Validators.required, Validators.email]],
    });

    this.funcionesMtcService.ocultarCargando();
  }

  get emailFormControl(): AbstractControl { return this.recuperarPassFormGroup.get('emailFormControl'); }

  async submitRecuperarPass(formValue: any, submitBtn: HTMLButtonElement): Promise<void> {
    if (!this.recuperarPassFormGroup.valid) {
      return;
    }
    submitBtn.disabled = true;

    const usuarioModel = {
      email: formValue.emailFormControl
    } as UsuarioModel;

    try {
      const response = await this.seguridadService.postRecuperarPass(usuarioModel).toPromise();

      if (response.success) {
        try {
          await this.funcionesMtcService.mensajeOk(response.message);
          this.router.navigate(['/autenticacion/iniciar-sesion']);
          return;
        } catch (e) { }
      }
      else {
        this.funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de recuperar contraseña');
    } finally {
      submitBtn.disabled = false;
      this.recuperarPassFormGroup.reset();
    }
  }
}
