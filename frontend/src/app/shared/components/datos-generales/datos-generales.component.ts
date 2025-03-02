import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { SeguridadService } from 'src/app/core/services/seguridad.service';
import { noWhitespaceValidator, exactLengthValidator } from 'src/app/helpers/validator';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.css']
})
export class DatosGeneralesComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}