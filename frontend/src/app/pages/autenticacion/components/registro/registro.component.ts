import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, AbstractControlOptions, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
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
import { RegistroRequestModel } from 'src/app/core/models/Autenticacion/LoginRequestModel';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registroFG: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private seguridadService: SeguridadService,
    private funcionesMtcService: FuncionesMtcService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registroFG = this.formBuilder.group({
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      numeroDocumento: ['', [Validators.required, Validators.maxLength(8)]]
    });
  }

  
  async submitRegistro(): Promise<void> {
    if (this.registroFG.invalid) {
      return;
    }

    this.funcionesMtcService.mostrarCargando();

    const formValue = this.registroFG.value;
    const model: RegistroRequestModel = {
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      nombres: formValue.nombres,
      contrasenia: formValue.contrasenia,
      numeroDocumento: formValue.numeroDocumento,
      correoElectronico: formValue.correoElectronico
    };

    try {
      const response = await this.seguridadService.postRegistrar(model).toPromise();
      if (response.success) {
        this.funcionesMtcService.mensajeOk(response.message);
        this.router.navigate(['/autenticacion/iniciar-sesion']);
      } else {
        this.funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      this.funcionesMtcService.mensajeError('Error en el servicio de registrar nuevo usuario');
    } finally {
      this.funcionesMtcService.ocultarCargando();
    }
  }


}
