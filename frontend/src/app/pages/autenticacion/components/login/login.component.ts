import { Component, OnInit } from '@angular/core';
import { AbstractControl, MaxLengthValidator, Validators } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { LoginRequestModel } from 'src/app/core/models/Autenticacion/LoginRequestModel';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { Location } from '@angular/common';
import { exactLengthValidator, noWhitespaceValidator } from '../../../../helpers/validator';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginFormGroup: UntypedFormGroup;

	minLenghtApodo = 6;
	dniCePlaceHolder = 'DNI/CE';
	onlyNumber:boolean=true;

	messageError: string;

	dniCeLenght = '8';

	captchaResponse: string;
	siteKey: string;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private seguridadService: SeguridadService,
		private funcionesMtcService: FuncionesMtcService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location
	) {
		this.siteKey = environment.endPoint.autenticacion.captchaSiteKey;
	}

	async ngOnInit(): Promise<void> {
		this.funcionesMtcService.mostrarCargando();
		this.loginFormGroup = this.formBuilder.group({
			dniCeFormControl: [{ value: '', disabled: false }, [Validators.required, exactLengthValidator([8])]],
			passwordFormControl: [{ value: '', disabled: false }, [Validators.required, noWhitespaceValidator()]]
		});

		this.funcionesMtcService.ocultarCargando();

	}

	//Obtener los valores de las cajas de texto.
	get dniCeFormControl(): AbstractControl { return this.loginFormGroup.get('dniCeFormControl'); }
	get passwordFormControl(): AbstractControl { return this.loginFormGroup.get('passwordFormControl'); }

	async submitLogin(formValue: any, submitBtn: HTMLButtonElement): Promise<void> {
		if (!this.loginFormGroup.valid) {
			return;
		}

	
		submitBtn.disabled = true;
		this.funcionesMtcService.mostrarCargando();
		
		const model = {
			alias: formValue.dniCeFormControl ?? '',
			contrasenia: formValue.passwordFormControl ?? ''
		} as LoginRequestModel;

		try {
			debugger;
			const response = await this.seguridadService.postLogin(model).toPromise();
debugger;
			if (response.success) {
				sessionStorage.setItem('usuario', JSON.stringify(response.data));
				sessionStorage.setItem('accessToken', response.data.accessToken);
				this.router.navigate(['/index']);
			}
			else {
				this.funcionesMtcService.mensajeErrorHtml(response.message);
			}
		} catch (e) {
			console.log("error 3");
			this.funcionesMtcService.mensajeError('Error en el servicio de iniciar sesión');
		} finally {
			submitBtn.disabled = false;
			this.loginFormGroup.reset({
				tipoUsuarioFormControl: ''
			});
			this.funcionesMtcService.ocultarCargando();
		}
	}
}
