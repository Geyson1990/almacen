import { Component, OnInit } from '@angular/core';
import { AbstractControl, MaxLengthValidator, Validators } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { LoginRequestModel } from 'src/app/core/models/Autenticacion/LoginRequestModel';
import { CONSTANTES } from 'src/app/enums/constants';
import { SeguridadService } from '../../../../core/services/seguridad.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoPersonaResponseModel } from '../../../../core/models/Autenticacion/TipoPersonaResponseModel';
import { FuncionesMtcService } from '../../../../core/services/funciones-mtc.service';
import { Location } from '@angular/common';
import { SunatService } from '../../../../core/services/servicios/sunat.service';
import { LoginSunatRequestModel } from 'src/app/core/models/Autenticacion/LoginSunatRequestModel';
import { exactLengthValidator, noWhitespaceValidator } from '../../../../helpers/validator';
import { CasillaService } from '../../../../core/services/servicios/casilla.service';
import { TipoDocumentoPersonaExtranjeraModel } from 'src/app/core/models/Autenticacion/TipoDocumentoPersonaExtranjeraModel';
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
	listaTipoPersona: Array<TipoPersonaResponseModel>;
	listaTipoDocumentoPE: Array<TipoDocumentoPersonaExtranjeraModel>;
	onlyNumber:boolean=true;

	messageError: string;

	dniCeLenght = '8';

	captchaResponse: string;
	siteKey: string;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private seguridadService: SeguridadService,
		private funcionesMtcService: FuncionesMtcService,
		private sunatService: SunatService,
		private casillaService: CasillaService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location
	) {
		this.siteKey = environment.endPoint.autenticacion.captchaSiteKey;
	}

	async ngOnInit(): Promise<void> {
		console.log(this.listaTipoDocumentoPE)
		this.funcionesMtcService.mostrarCargando();

		if (this.seguridadService.isAuthenticated()) {
			this.router.navigate(['/index']);
		}

		this.loginFormGroup = this.formBuilder.group({
			tipoUsuarioFormControl: ['', [Validators.required]],
			tipoDocumentoPEFormControl: [{ value: '', disabled: true }],
			rucFormControl: [{ value: '', disabled: true }, [Validators.required, exactLengthValidator([11])]],
			dniCeFormControl: [{ value: '', disabled: true }, [Validators.required, exactLengthValidator([8])]],
			passwordFormControl: [{ value: '', disabled: true }, [Validators.required, noWhitespaceValidator()]]
		});

		await this.poblarTipoPersona();

		this.seguridadService.getTipoDocumentosPersonaExtranjera().subscribe((response) => {
			this.listaTipoDocumentoPE = response.data;
		});

		this.funcionesMtcService.ocultarCargando();

		this.onChangeTipoUsuario();
		this.onChangeParams();
	}

	get tipoUsuarioFormControl(): AbstractControl { return this.loginFormGroup.get('tipoUsuarioFormControl'); }
	get tipoDocumentoPEFormControl(): AbstractControl { return this.loginFormGroup.get('tipoDocumentoPEFormControl'); }
	get rucFormControl(): AbstractControl { return this.loginFormGroup.get('rucFormControl'); }
	get dniCeFormControl(): AbstractControl { return this.loginFormGroup.get('dniCeFormControl'); }
	get passwordFormControl(): AbstractControl { return this.loginFormGroup.get('passwordFormControl'); }

	get urlRegistroCasilla(): string { return this.casillaService.getUrlRegistro(); }
	get urlRecuperarPassCasilla(): string { return this.casillaService.getUrlRecuperarPass(); }

	async poblarTipoPersona(): Promise<void> {
		try {
			//debugger;
			await this.seguridadService.getTipoPersonas().subscribe(res => {
				
				if (res.success) this.listaTipoPersona = res.data;
			});
		} catch (e) {
			this.messageError = 'Error en el servicio de obtener los tipos de persona';
		}
	}

	onChangeTipoUsuario(): void {
		this.tipoUsuarioFormControl.valueChanges.subscribe((tipoUsuario: string) => {
			if (tipoUsuario) {
				this.dniCeFormControl.enable();
				this.passwordFormControl.enable();

				if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_CARNE_SOLICITANTE_REFUGIO) {
					this.rucFormControl.disable();
					this.tipoDocumentoPEFormControl.disable();
					this.tipoDocumentoPEFormControl.clearValidators();
					this.tipoDocumentoPEFormControl.reset('');
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([9])]);
					this.dniCeLenght = '9';
					this.dniCePlaceHolder = 'CARNE S.R';
					this.onlyNumber = true;
				}
				else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL) {
					this.rucFormControl.disable();
					this.tipoDocumentoPEFormControl.setValue(CONSTANTES.TipoDocPersona.DNI);
					this.tipoDocumentoPEFormControl.disable();
					this.tipoDocumentoPEFormControl.clearValidators();
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([8])]);
					this.dniCeLenght = '8';
					this.dniCePlaceHolder = 'DNI';
					this.onlyNumber = true;
				}
				else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA) {
					this.rucFormControl.enable();
					this.tipoDocumentoPEFormControl.setValue(CONSTANTES.TipoDocPersona.RUC);
					this.tipoDocumentoPEFormControl.disable();
					this.tipoDocumentoPEFormControl.clearValidators();
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([8, 9])]);
					this.dniCeLenght = '8 u 9';
					this.dniCePlaceHolder = 'DNI/CE';
					this.onlyNumber = true;
				}
				else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_EXTRANJERA) {
					this.rucFormControl.disable();
					this.tipoDocumentoPEFormControl.enable();
					this.tipoDocumentoPEFormControl.setValidators([Validators.required]);
					this.tipoDocumentoPEFormControl.reset('');
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([9])]);
					this.dniCeLenght = '';
					this.dniCePlaceHolder = '-';
				}
				else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_NATURAL_CON_RUC) {
					this.rucFormControl.enable();
					this.tipoDocumentoPEFormControl.setValue(CONSTANTES.TipoDocPersona.RUC);
					this.tipoDocumentoPEFormControl.disable();
					this.tipoDocumentoPEFormControl.clearValidators();
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([8, 9])]);
					this.dniCeLenght = '8 u 9';
					this.dniCePlaceHolder = 'DNI/CE';
					this.onlyNumber = true;
				}
				else if (tipoUsuario === CONSTANTES.CodTabTipoPersona.PERSONA_JURIDICA_O_PERSONA_NATURAL_CON_RUC) {
					this.rucFormControl.enable();
					this.tipoDocumentoPEFormControl.disable();
					this.tipoDocumentoPEFormControl.clearValidators();
					this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([8, 9])]);
					this.dniCeLenght = '8 u 9';
					this.dniCePlaceHolder = 'DNI/CE';
					this.onlyNumber = true;
				}
			}
			else {
				this.rucFormControl.disable();
				this.tipoDocumentoPEFormControl.disable();
				this.dniCeFormControl.disable();
				this.passwordFormControl.disable();
			}

			this.messageError = '';

			this.rucFormControl.reset('');
			this.dniCeFormControl.reset('');
			this.passwordFormControl.reset('');

		});
	}

	onChangeTipoDocumentoPE(tipoDocumento: string): void {
		console.log("TipoDocumento: ", tipoDocumento)
		this.dniCeFormControl.setValue("")
		switch (tipoDocumento) {
			case CONSTANTES.TipoDocPersonaExtranjera.CARNET_EXTRANJERIA:
				this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([9])]);
				this.dniCeLenght = '9';
				this.dniCePlaceHolder = 'CE';
				this.onlyNumber = true;
				break
			case CONSTANTES.TipoDocPersonaExtranjera.CARNET_SOLICITANTE_REFUGIO:
				this.dniCeFormControl.setValidators([Validators.required, Validators.maxLength(9)]);
				this.dniCeLenght = '9';
				this.dniCePlaceHolder = 'CSR';
				this.onlyNumber = true;
				break
			case CONSTANTES.TipoDocPersonaExtranjera.CARNET_PERMISO_TEMPORAL_PERMANENCIA:
				this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([9])]);
				this.dniCeLenght = '9';
				this.dniCePlaceHolder = 'PTP/CPP';
				this.onlyNumber = true;
				break
			case CONSTANTES.TipoDocPersonaExtranjera.CARNET_IDENTIFICACION:
				this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([8, 9])]);
				this.dniCeLenght = '8 u 9';
				this.dniCePlaceHolder = 'CI';
				this.onlyNumber = true;
				break
			case CONSTANTES.TipoDocPersonaExtranjera.PASAPORTE:
				this.dniCeFormControl.setValidators([Validators.required, exactLengthValidator([9, 10, 11, 12])]);
				this.dniCeLenght = '9 o 12';
				this.dniCePlaceHolder = 'Pasaporte';
				this.onlyNumber = false;
				console.log(this.onlyNumber);
				break
			default:
				this.dniCeFormControl.setValidators([Validators.required]);
				this.dniCeLenght = '';
				this.dniCePlaceHolder = '-';
				this.onlyNumber = true;
				break
		}
	}

	onChangeParams(): void {
		this.route.queryParams.subscribe(params => {

			// Login SUNAT
			const paramState = params?.state ?? null;
			const paramCode = params?.code ?? null;

			if (paramState && paramCode) {
				this.validarTokenSunat(paramState, paramCode);
			}

			// Login Casilla
			const paramToken = params?.token ?? null;

			if (paramToken) {
				this.validarTokenCasilla(paramToken);
			}

		});
	}

	async validarTokenCasilla(paramToken: string): Promise<void> {
		if (paramToken) {
			const isTokenValid = this.seguridadService.isTokenValid(paramToken);

			if (!isTokenValid) {
				this.funcionesMtcService.mensajeError('El token de respuesta ha expirado, inicie sesión nuevamente');
				this.router.navigate(['/autenticacion/iniciar-sesion']);
				return;
			}

			const decodeToken = this.seguridadService.getDecodedToken(paramToken);
			if (!decodeToken) {
				this.funcionesMtcService.mensajeError('Error en el token de respuesta, inicie sesión nuevamente');
				this.router.navigate(['/autenticacion/iniciar-sesion']);
				return;
			}

			// Enviar el token al servicio del Backend
			this.funcionesMtcService.mostrarCargando();

			const model = {
				TipoPersona: decodeToken.tipoUsuario,
				Username: decodeToken.username,
				Ruc: decodeToken.ruc,
				TokenCasilla: paramToken
			} as LoginRequestModel;
			try {
				const response = await this.seguridadService.postLogin(model).toPromise();

				if (response.success) {
					sessionStorage.setItem('accessToken', response.accessToken);
					this.router.navigate(['/index']);
				}
				else {
					this.funcionesMtcService.mensajeErrorHtml(response.errorMessage);
				}
			} catch (e) {
				console.log("error 1");
				this.funcionesMtcService.mensajeError('Error en el servicio de iniciar sesión');
			} finally {
				this.funcionesMtcService.ocultarCargando();
			}
		}
	}

	async validarTokenSunat(paramState: string, paramCode: string): Promise<void> {
		if (paramState && paramCode) {
			const isTokenValid = this.seguridadService.isTokenValid(paramCode);

			if (!isTokenValid) {
				this.funcionesMtcService.mensajeError('El token de respuesta ha expirado, inicie sesión nuevamente');
				this.router.navigate(['/autenticacion/iniciar-sesion']);
				return;
			}

			const decodeToken = this.seguridadService.getDecodedToken(paramCode);
			if (!decodeToken) {
				this.funcionesMtcService.mensajeError('El token de respuesta ha expirado, inicie sesión nuevamente');
				this.router.navigate(['/autenticacion/iniciar-sesion']);
				return;
			}

			// Enviar el token al servicio del Backend
			this.funcionesMtcService.mostrarCargando();

			const model = {
				code: paramCode,
				state: paramState
			} as LoginSunatRequestModel;
			try {
				const response = await this.seguridadService.postLoginSunat(model).toPromise();

				if (response.success) {
					sessionStorage.setItem('accessToken', response.accessToken);
					this.router.navigate(['/index']);
				}
				else {
					this.funcionesMtcService.mensajeErrorHtml(response.errorMessage);
				}
			} catch (e) {
				console.log("error 2");
				this.funcionesMtcService.mensajeError('Error en el servicio de iniciar sesión');
			} finally {
				this.funcionesMtcService.ocultarCargando();
			}
		}
	}

	loginOauthSunat(btnSubmit: HTMLButtonElement): void {
		btnSubmit.disabled = true;
		this.funcionesMtcService.mostrarCargando();

		const urlTree = this.router.createUrlTree(['/autenticacion/iniciar-sesion']);
		const path = this.location.prepareExternalUrl(urlTree.toString());
		const urlRedirect = `${window.location.origin}/${path}`;

		const encodedUrlRedirect = encodeURIComponent(urlRedirect);

		const url = this.sunatService.getUrlOauth('s', encodedUrlRedirect);
		window.location.href = url;
	}

	resolved(captchaResponse: string) {
		console.log(`Resolved captcha with response: ${captchaResponse}`);
		this.captchaResponse = captchaResponse;
	}

	async submitLogin(formValue: any, submitBtn: HTMLButtonElement): Promise<void> {
		if (!this.loginFormGroup.valid) {
			return;
		}

		// if (!this.captchaResponse) {
		// 	this.funcionesMtcService.mensajeError('Por favor verifica que no eres un robot.');
		// 	return;
		// }

		submitBtn.disabled = true;
		this.funcionesMtcService.mostrarCargando();
		
		const model = {
			TipoPersona: formValue.tipoUsuarioFormControl ?? '',
			Username: formValue.dniCeFormControl ?? '',
			Ruc: formValue.rucFormControl ?? '',
			Password: formValue.passwordFormControl ?? '',
			//TipoPersona: formValue.tipoDocumentoPEFormControl ?? this.tipoDocumentoPEFormControl.value,
			//TipoDocumento: (formValue.tipoUsuarioFormControl ==="00002" ? "00002" : this.tipoDocumentoPEFormControl.value) ?? this.tipoDocumentoPEFormControl.value,
			TipoDocumento: this.tipoDocumentoPEFormControl.value ?? this.tipoDocumentoPEFormControl.value,
			Recaptcha: this.captchaResponse ?? ''
		} as LoginRequestModel;

		try {
			const response = await this.seguridadService.postLogin(model).toPromise();

			if (response.success) {
				console.log(response);
				sessionStorage.setItem('accessToken', response.accessToken);
				this.router.navigate(['/index']);
			}
			else {
				this.funcionesMtcService.mensajeErrorHtml(response.errorMessage);
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
