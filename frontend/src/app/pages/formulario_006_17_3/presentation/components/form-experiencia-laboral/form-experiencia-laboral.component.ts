import { Component, Input, OnInit, ViewChild, ViewEncapsulation, Injectable } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbAccordionDirective, NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef, NgbDateParserFormatter, NgbDatepickerI18n, } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { MetaData as MetaDataForm } from 'src/app/core/models/Formularios/Formulario001_27NT/MetaData';
import { Personal, Experiencia } from '../../../domain/anexo006_A17_3/anexo006_A17_3Request';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { TranslationWidth } from '@angular/common';

//#region  CONSIGURACION DE FORMATO DE FECHA

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

   readonly DELIMITER = '/';

   parse(value: string): NgbDateStruct | null {
      if (value) {
         let date = value.split(this.DELIMITER);
         return {
            day: parseInt(date[0], 10),
            month: parseInt(date[1], 10),
            year: parseInt(date[2], 10)
         };
      }
      return null;
   }

   format(date: NgbDateStruct | null): string {
      if (date) {
         const day = String(date.day).length > 1 ? date.day : "0" + date.day;
         const month = String(date.month).length > 1 ? date.month : "0" + date.month;
         return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
      } else {
         return "";
      }
   }
}

const I18N_VALUES = {
   'fr': {
      weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
   }
};

@Injectable()
export class I18n {
   language = 'fr';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

   constructor(private _i18n: I18n) {
      super();
   }

   getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
      return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
   }
   getWeekdayShortName(weekday: number): string {
      return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
   }
   getMonthShortName(month: number): string {
      return I18N_VALUES[this._i18n.language].months[month - 1];
   }
   getMonthFullName(month: number): string {
      return this.getMonthShortName(month);
   }

   getDayAriaLabel(date: NgbDateStruct): string {
      return `${date.day}-${date.month}-${date.year}`;
   }
}
//#endregion

@Component({
   selector: 'app-form-experiencia-laboral',
   templateUrl: './form-experiencia-laboral.component.html',
   styleUrls: ['./form-experiencia-laboral.component.css'],
   providers: [
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
      I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n } // define custom NgbDatepickerI18n provider
   ]
})
export class FormExperienciaLaboralComponent implements OnInit {
   @Input() public dataInput: any
   @Input() public dataIdx: number
   @Input() public dataPersonalIdx: number
   @Input() public experienciaLaboral: Experiencia
   @Input() public persona: Personal

   id: number = 0;
   uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
   tramiteReqId: number

   codigoProcedimientoTupa: string;
   descProcedimientoTupa: string;
   txtTitulo = 'ANEXO 006-A/27 - RELACIÓN DE PERSONAL TÉCNICO DE LA ENTIDAD VERIFICADORA'
   txtTituloHelp = 'Experiencia laboral'

   formulario: UntypedFormGroup;
   formularioDeclarante: UntypedFormGroup;

   @ViewChild('acc') acc: NgbAccordionDirective;
   modalRefDeclarante: NgbModalRef

   fechaInicial: string = "";
   fechaFinal: string = "";

   constructor(
      public fb: UntypedFormBuilder,
      private funcionesMtcService: FuncionesMtcService,
      public activeModal: NgbActiveModal,
      public tramiteService: TramiteService,
      private formularioTramiteService: FormularioTramiteService,
   ) {
      const tramiteSelected: any = JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa = tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
   }

   ngOnInit(): void {
      this.setForm();

      if (this.dataIdx !== null && this.dataIdx >= 0) {
         this.formulario.setValue(this.persona.listaExperiencia[this.dataIdx]);
         this.setDateValue(this.fechaIni, this.persona.listaExperiencia[this.dataIdx].fechaIni);
         this.setDateValue(this.fechaFin, this.persona.listaExperiencia[this.dataIdx].fechaFin);
      } else {
         this.funcionesMtcService.mostrarCargando();
         this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
            (dataForm: any) => {
               this.funcionesMtcService.ocultarCargando();
               const metaDataForm = JSON.parse(dataForm.metaData) as MetaDataForm;
            }, (error) => {
               this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para obtener los datos del formulario');
            }
         );
      }

   }

   setForm() {
      this.formulario = this.fb.group({
         lugar: ['', [Validators.required]],
         fechaIni: [null, [Validators.required]],
         fechaFin: [null, [Validators.required]],
         folio: ['', [Validators.required]],
      });
   }

   get lugar(): AbstractControl { return this.formulario.get('lugar'); }
   get fechaIni(): AbstractControl { return this.formulario.get('fechaIni'); }
   get fechaFin(): AbstractControl { return this.formulario.get('fechaFin'); }
   get folio(): AbstractControl { return this.formulario.get('folio'); }

   onSelectFechaInicial(event): void {
      let year = event.year.toString();
      let month = ('0' + event.month).slice(-2);
      let day = ('0' + event.day).slice(-2);
      this.fechaInicial = day + "/" + month + "/" + year;
   }

   onSelectFechaFinal(event): void {
      let year = event.year.toString();
      let month = ('0' + event.month).slice(-2);
      let day = ('0' + event.day).slice(-2);
      this.fechaFinal = day + "/" + month + "/" + year;
   }

   setDateValue(control: any, date: string): string {
      const fecha = date.trim().substring(0, 10);
      const fec = fecha.split("/");
      console.log(control);
      control.setValue({
         day: parseInt(fec[0]),
         month: parseInt(fec[1]),
         year: parseInt(fec[2])
      });
      return fecha;
   }


   agregarAnexo() {
      if (this.formulario.invalid) {
         this.formulario.markAllAsTouched();
         return this.funcionesMtcService.mensajeError('Complete todos los campos obligatorios');
      }

      let desde: string = "";
      let hasta: string = "";

      desde = (String(this.fechaIni.value.day).length > 1 ? this.fechaIni.value.day : "0" + this.fechaIni.value.day) + "/" + (String(this.fechaIni.value.month).length > 1 ? this.fechaIni.value.month : "0" + this.fechaIni.value.month) + "/" + this.fechaIni.value.year;
      hasta = (String(this.fechaFin.value.day).length > 1 ? this.fechaFin.value.day : "0" + this.fechaFin.value.day) + "/" + (String(this.fechaFin.value.month).length > 1 ? this.fechaFin.value.month : "0" + this.fechaFin.value.month) + "/" + this.fechaFin.value.year;

      let experiencia: Experiencia = new Experiencia();

      experiencia = this.formulario.value as Experiencia
      experiencia.fechaIni = desde;
      experiencia.fechaFin = hasta;
      console.log("Experiencia: ", experiencia)

      let msgPregunta: string = `¿Está seguro de ${this.dataIdx >= 0 ? 'modificar' : 'guardar'} los datos ingresados?`;
      this.activeModal.close(experiencia);
   }

   formInvalid(control: AbstractControl): boolean {
      if (control) {
         return control.invalid && (control.dirty || control.touched);
      }
   }

   soloNumeros(event: any) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 48 || charCode > 57)) {
         event.preventDefault();
         return false;
      } else {
         return true;
      }
   }

   campareStrings(str1: string, str2: string) {
      const cadena1 = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      const cadena2 = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      return cadena1 === cadena2 ? true : false;
   }

}
