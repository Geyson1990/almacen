import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidenciaRequestModel } from 'src/app/core/models/Tramite/IncidenciaRequestModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { fileSizeValidator, requiredFileType, ValidateFileSize_Formulario } from 'src/app/helpers/file';
import { emailValidator, exactLengthValidator, noWhitespaceValidator } from 'src/app/helpers/validator';
import { numberValidator } from '../../../../helpers/validator';

@Component({
  selector: 'app-ayuda-incidencia',
  templateUrl: './ayuda-incidencia.component.html',
  styleUrls: ['./ayuda-incidencia.component.css'],
})
export class AyudaIncidenciaComponent implements OnInit {
  registroIncidenciaFG: UntypedFormGroup;

  constructor(
    private router: Router,
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.registroIncidenciaFG = this.formBuilder.group({
      rinNombresFC: ['', [Validators.required, noWhitespaceValidator(), Validators.pattern('[ A-zÀ-ú]*'), Validators.maxLength(240)]],
      rinDocIdentidadFC: ['', [Validators.required, exactLengthValidator([8, 11])]],
      rinCelularFC: ['', [Validators.required, exactLengthValidator([9])]],
      rinEmailFC: ['', [Validators.required, Validators.email, Validators.maxLength(240)]],
      rinDescripcionFC: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(240)]],
      rinFileAdjuntoFC: [null, [fileSizeValidator(0, 3145728), requiredFileType(['pdf', 'png', 'jpg', 'jpeg'])]]
    });
  }

  get rinNombresFC(): AbstractControl { return this.registroIncidenciaFG.get('rinNombresFC'); }
  get rinDocIdentidadFC(): AbstractControl { return this.registroIncidenciaFG.get('rinDocIdentidadFC'); }
  get rinCelularFC(): AbstractControl { return this.registroIncidenciaFG.get('rinCelularFC'); }
  get rinEmailFC(): AbstractControl { return this.registroIncidenciaFG.get('rinEmailFC'); }
  get rinDescripcionFC(): AbstractControl { return this.registroIncidenciaFG.get('rinDescripcionFC'); }
  get rinFileAdjuntoFC(): AbstractControl { return this.registroIncidenciaFG.get('rinFileAdjuntoFC'); }

  async submitIncidencia(btnSubmit: HTMLButtonElement): Promise<void> {
    if (this.registroIncidenciaFG.invalid) {
      return;
    }
    btnSubmit.disabled = true;

    const formValue = this.registroIncidenciaFG.value;

    const ubicacionURL = this.router.url;
    const incidenciaRequestModel: IncidenciaRequestModel = {
      tupaId: null,
      ubicacionURL,
      procedimiento: null,
      descripcion: formValue.rinDescripcionFC.trim(),
      nombre: formValue.rinNombresFC.trim(),
      numeroDocumento: formValue.rinDocIdentidadFC.trim(),
      celular: formValue.rinCelularFC.trim(),
      correo: formValue.rinEmailFC.trim(),
      adjunto: formValue.rinFileAdjuntoFC
    };

    const incidenciaFormData = this.funcionesMtcService.jsonToFormData(
      incidenciaRequestModel
    );
    try {
      this.funcionesMtcService.mostrarCargando();
      const response = await this.tramiteService
        .postRegistrarIncidenciaOtro(incidenciaFormData)
        .toPromise();
      this.funcionesMtcService.ocultarCargando();
      if (response.success) {
        await this.funcionesMtcService.mensajeOk(response.message);
      } else {
        await this.funcionesMtcService.mensajeError(response.message);
      }
    } catch (e) {
      console.log(e);
      this.funcionesMtcService.ocultarCargando();
      await this.funcionesMtcService.mensajeError(
        'No se pudo registrar la incidencia.'
      );
    } finally {
      this.registroIncidenciaFG.reset();
    }
  }
}
