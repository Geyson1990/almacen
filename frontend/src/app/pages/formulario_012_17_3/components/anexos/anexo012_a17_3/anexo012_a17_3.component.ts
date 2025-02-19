import { Component, Injectable, OnInit, ViewChild, Input   } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal ,NgbActiveModal,NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from 'src/app/core/models/SelectionModel';

import {FormArray,FormGroup,UntypedFormBuilder,FormControl,Validators} from '@angular/forms'
import {debounceTime} from 'rxjs/operators';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo012A173Service } from 'src/app/core/services/anexos/anexo012-a173.service';
import { AnexoResponse } from 'src/app/core/models/Anexos/Anexo012_A17_3/AnexoResponse';
import { AnexoRequestPost } from 'src/app/core/models/Anexos/Anexo012_A17_3/AnexoRequestPost';
import { Seccion1, Seccion2, Seccion3, Seccion4 } from 'src/app/core/models/Anexos/Anexo012_A17_3/Secciones';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';
import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
import { DropdownService } from 'src/app/core/models/Anexos/Anexo012_A17_3/dropdown.service';
import { TranslationWidth } from '@angular/common';
////Configurar Fechas ///////////////////////////////////////////////////////
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}


const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
// Define custom service providing the months and weekdays translations
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


///Fin de configurar Fechas//////////////////////////////////////////




@Component({
  selector: 'app-anexo012_a17_3',
  templateUrl: './anexo012_a17_3.component.html',
  styleUrls: ['./anexo012_a17_3.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n} // define custom NgbDatepickerI18n provider
  ]
})
export class Anexo012A173Component implements OnInit {
  
  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
//AUMENTANDO INTEGRACION___
uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO
codigoTupa: string = "DSTT-030" ;

graboUsuario: boolean = false;
//__________________________
@Input() public dataInput: any;
active = 1;
idAnexoMovimiento: number = 0;
indexEditTabla: number = -1;
disabledAcordion: number = 2;
  @ViewChild('acc') acc: NgbAccordionDirective ;



  newsletterOp:any[];
  newsletterOp1:any[];
  newsletterOp3:any[];

  //Validando Campos///////////////////
  contactForm = this.fb.group({
    Documento_Identidad: ['', [Validators.required, Validators.minLength(3)]],
    Nombres_Apellidos: ['', [Validators.required, Validators.minLength(3)]],
    Domicilio_Legal: ['', [Validators.required, Validators.minLength(3)]],
    Region: ['', [Validators.required, Validators.minLength(3)]],
    Provincia: ['', [Validators.required, Validators.minLength(3)]],
    Distrito:['', [Validators.required, Validators.minLength(3)]],
  //  Grado_Militar: ['', [Validators.required, Validators.minLength(3)]],
    
    Grado_Militar: ['0'],
    Factor_grupo_sanguineo: ['0'],
    newsletter1: ['0'],
    Vigencia_Licencia_Conducir: ['', [Validators.required, Validators.minLength(3)]],
    Fecha_Caducidad: ['', [Validators.required, Validators.minLength(3)]],

    correo:['', [Validators.required, Validators.email]],
    telefono: this.fb.control(''),
    celular: this.fb.control(''),
    Numero_Certificado_Salud: ['', [Validators.required, Validators.minLength(3)]],
    Fecha_Certificado: ['', [Validators.required, Validators.minLength(3)]],

    nro_resolucion: ['', [Validators.required, Validators.minLength(3)]],
    fecha_resolucion: ['', [Validators.required, Validators.minLength(3)]],

    
    
    Vehiculo_Transmision_automatica: this.fb.control(false),
    Vehiculo_acondicionado: this.fb.control(false),
    Con_lentes: this.fb.control(false),
    Con_Audifonos: this.fb.control(false),
    Con_espejos_laterales: this.fb.control(false),
    Sin_restricciones: this.fb.control(false),
    aceptacion: this.fb.control(false),
   // Factor_grupo_sanguineo: this.fb.control('')

  });

  constructor( public fb:UntypedFormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioService: Anexo012A173Service,
    private anexoTramiteService: AnexoTramiteService,
    private dropdownService:DropdownService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private formularioTramiteService: FormularioTramiteService,
    private funcionesMtcService: FuncionesMtcService
    ) { }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento;
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

    //this.recuperarInformacion();
    this.newsletterOp = this.dropdownService.getNewsletter();
    this.newsletterOp1 = this.dropdownService.getNewsletter1();
    this.newsletterOp3 = this.dropdownService.getNewsletter3();
   

    setTimeout(() => {
      this.funcionesMtcService.mostrarCargando();
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //RECUPERAMOS DATOS DEL FORMULARIO
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
        (dataForm: any) => {

          this.funcionesMtcService.ocultarCargando();
          const metaDataForm: any = JSON.parse(dataForm.metaData);

          this.contactForm.get("Nombres_Apellidos").setValue(metaDataForm?.seccion1?.nombres);
          this.contactForm.get("Domicilio_Legal").setValue(metaDataForm?.seccion1?.domicilio);
                   
          this.contactForm.get("Documento_Identidad").setValue(metaDataForm?.seccion1?.numeroDocIdentidad);

          this.contactForm.get("Region").setValue(metaDataForm?.seccion1?.region);
          this.contactForm.get("Provincia").setValue(metaDataForm?.seccion1?.provincia);
          this.contactForm.get("Distrito").setValue(metaDataForm?.seccion1?.distrito);


          if(metaDataForm?.seccion1?.categoria==="1"){
            this.contactForm.get("newsletter1").setValue("1");
          }
          if(metaDataForm?.seccion1?.categoria==="2"){
            this.contactForm.get("newsletter1").setValue("2");
          }
          if(metaDataForm?.seccion1?.categoria==="3"){
            this.contactForm.get("newsletter1").setValue("3");
          }
          if(metaDataForm?.seccion1?.categoria==="4"){
            this.contactForm.get("newsletter1").setValue("4");
          }
          if(metaDataForm?.seccion1?.categoria==="5"){
            this.contactForm.get("newsletter1").setValue("5");
          }
          if(metaDataForm?.seccion1?.categoria==="6"){
            this.contactForm.get("newsletter1").setValue("6");
          }
       //   this.contactForm.get("telefono").setValue(metaDataForm?.seccion1?.telefono);
        //  this.contactForm.get("celular").setValue(metaDataForm?.seccion1?.celular);
          this.contactForm.get("correo").setValue(metaDataForm?.seccion1?.correo);
          if (this.dataInput.rutaDocumento) {
            //RECUPERAMOS LOS DATOS
            this.recuperarInformacion();
          }
        },
        error => {
          this.funcionesMtcService
            .ocultarCargando()
            .mensajeError('Problemas para conectarnos con el servicio y recuperar datos del representante');
        }
      );
    });
  }

     
  onSubmit(): void {
    console.log('Form->' + JSON.stringify(this.contactForm.value));
  }

  isValidField(name: string): boolean {
    const fieldName = this.contactForm.get(name);
    return fieldName.invalid && fieldName.touched;
  }

 
  inputNumeroDocumento(event = undefined) {
    if (event)
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }



  inhabilitar(){

    if (this.contactForm.controls['Sin_restricciones'].value === true)
    {
     // this.funcionesMtcService.mensajeError('Se inhabilitara todas las demas restricciones');  
      this.contactForm.get("Vehiculo_Transmision_automatica").disable();
      this.contactForm.get("Vehiculo_acondicionado").disable();
      this.contactForm.get("Con_lentes").disable();
      this.contactForm.get("Con_Audifonos").disable();
      this.contactForm.get("Con_espejos_laterales").disable();
    }else if (this.contactForm.controls['Sin_restricciones'].value === false)
    {
      this.contactForm.get("Vehiculo_Transmision_automatica").enable();
      this.contactForm.get("Vehiculo_acondicionado").enable();
      this.contactForm.get("Con_lentes").enable();
      this.contactForm.get("Con_Audifonos").enable();
      this.contactForm.get("Con_espejos_laterales").enable();
    }
  }

//Metodo para Guardar
guardarAnexo() {


  if (this.contactForm.controls['Grado_Militar'].value === "0")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Grado Militar');
  
  if (this.contactForm.controls['Factor_grupo_sanguineo'].value === "0")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Grupo Sanguineo');

  if (this.contactForm.controls['Vehiculo_Transmision_automatica'].value === true 
  && this.contactForm.controls['Vehiculo_acondicionado'].value === true 
  && this.contactForm.controls['Con_lentes'].value === true
  && this.contactForm.controls['Con_Audifonos'].value === true
  && this.contactForm.controls['Con_espejos_laterales'].value === true) {
    return this.funcionesMtcService.mensajeError('Solo debe Seleccionar dos Restricciones del Certificado de Salud');
  }

  if (this.contactForm.controls['Vehiculo_Transmision_automatica'].value === false 
  && this.contactForm.controls['Vehiculo_acondicionado'].value === false 
  && this.contactForm.controls['Con_lentes'].value === false
  && this.contactForm.controls['Con_Audifonos'].value === false
  && this.contactForm.controls['Con_espejos_laterales'].value === false
  && this.contactForm.controls['Sin_restricciones'].value === false) {
    return this.funcionesMtcService.mensajeError('Seleccionar dos restricciones del Certificado de Salud');
  }


  let dataGuardar = {
   //-------------------------------------    
   id: this.idAnexoMovimiento,
      
   //CAMPO QUE SE AGREGO PARA INTEGRACION__
   tramiteReqId: this.dataInput.tramiteReqId,
   //_____________________________________
   movimientoFormularioId: 17,
    anexoId: 6,
    codigo: "A",
       metaData: {
        seccion1: {
          Documento_Identidad : this.contactForm.controls['Documento_Identidad'].value,
          Nombres_Apellidos : this.contactForm.controls['Nombres_Apellidos'].value,
          Domicilio_Legal : this.contactForm.controls['Domicilio_Legal'].value,
          Region:this.contactForm.controls['Region'].value,
          Provincia:this.contactForm.controls['Provincia'].value,
          Distrito:this.contactForm.controls['Distrito'].value,
          Grado_Militar : this.contactForm.controls['Grado_Militar'].value,
          Vigencia_Licencia_Conducir : this.contactForm.controls['Vigencia_Licencia_Conducir'].value,
          Fecha_Caducidad : this.contactForm.controls['Fecha_Caducidad'].value,
          telefono : this.contactForm.controls['telefono'].value,
          celular : this.contactForm.controls['celular'].value,
          correo : this.contactForm.controls['correo'].value,
          Numero_Certificado_Salud : this.contactForm.controls['Numero_Certificado_Salud'].value,
          Fecha_Certificado : this.contactForm.controls['Fecha_Certificado'].value,
          
          nro_resolucion : this.contactForm.controls['nro_resolucion'].value,
          fecha_resolucion : this.contactForm.controls['fecha_resolucion'].value,
          
          },
          seccion2: {
            Vehiculo_Transmision_automatica : this.contactForm.controls['Vehiculo_Transmision_automatica'].value,
            Vehiculo_acondicionado: this.contactForm.controls['Vehiculo_acondicionado'].value,
            Con_lentes: this.contactForm.controls['Con_lentes'].value,
            Con_Audifonos: this.contactForm.controls['Con_Audifonos'].value,
            Con_espejos_laterales: this.contactForm.controls['Con_espejos_laterales'].value,
            Sin_restricciones: this.contactForm.controls['Sin_restricciones'].value,
            },
            seccion3: {
              Factor_grupo_sanguineo : this.contactForm.controls['Factor_grupo_sanguineo'].value,
              PostulaLicencia: this.contactForm.controls['newsletter1'].value,
              },
              seccion4: {
                aceptacion : this.contactForm.controls['aceptacion'].value,
                }
        
        }
     
   }
   const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
   this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
     .then(() => {

       console.log(JSON.stringify(dataGuardar));

       this.funcionesMtcService.mostrarCargando();

       if (this.idAnexoMovimiento === 0) {
         //GUARDAR:
         this.formularioService.post<any>(dataGuardar)
           .subscribe(
             data => {
               this.funcionesMtcService.ocultarCargando();
               this.idAnexoMovimiento = data.id;
               this.uriArchivo = data.uriArchivo;
               this.graboUsuario = true;
//               this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
               this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);


              },
             error => {
               this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
             }
           );
       } else {
         //MODIFICAR
         this.formularioService.put<any>(dataGuardar)
           .subscribe(
             data => {
               this.funcionesMtcService.ocultarCargando();
               this.idAnexoMovimiento = data.id;
               this.uriArchivo = data.uriArchivo;
               this.graboUsuario = true;
               //alert(this.uriArchivo);
              // this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
               this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente`);

             
              },
             error => {
               this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar la modificación de datos');
             }
           );

       }

     });



   }
//Fin del Metodo Guardar


descargarPdf() {
  if (this.idAnexoMovimiento === 0)
    return this.funcionesMtcService.mensajeError('Debe guardar previamente los datos ingresados');

  this.funcionesMtcService.mostrarCargando();

  this.visorPdfArchivosService.get(this.uriArchivo) 
    .subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Anexo 012-A/17.03";
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    );

}



recuperarInformacion(){

  //si existe el documento
  if (this.dataInput.rutaDocumento) {
    //RECUPERAMOS LOS DATOS DEL ANEXO
    this.anexoTramiteService.get<any>(this.dataInput.tramiteReqId).subscribe(
      (dataAnexo: AnexoResponse) => {
        const metaData: any = JSON.parse(dataAnexo.metaData);

        this.idAnexoMovimiento = dataAnexo.anexoId;

        console.log(JSON.stringify(dataAnexo, null, 10));
        console.log(JSON.stringify(JSON.parse(dataAnexo.metaData), null, 10));

        this.contactForm.get("Documento_Identidad").setValue(metaData.seccion1.Documento_Identidad);
        this.contactForm.get("Nombres_Apellidos").setValue(metaData.seccion1.Nombres_Apellidos);
        this.contactForm.get("Domicilio_Legal").setValue(metaData.seccion1.Domicilio_Legal);
        this.contactForm.get("Region").setValue(metaData.seccion1.Region);
        this.contactForm.get("Provincia").setValue(metaData.seccion1.Provincia);
        this.contactForm.get("Distrito").setValue(metaData.seccion1.Distrito);
        this.contactForm.get("Grado_Militar").setValue(metaData.seccion1.Grado_Militar);
        this.contactForm.get("Vigencia_Licencia_Conducir").setValue(metaData.seccion1.Vigencia_Licencia_Conducir);
        this.contactForm.get("Fecha_Caducidad").setValue(metaData.seccion1.Fecha_Caducidad);
        this.contactForm.get("telefono").setValue(metaData.seccion1.telefono);
        this.contactForm.get("celular").setValue(metaData.seccion1.celular);
        this.contactForm.get("correo").setValue(metaData.seccion1.correo);
        this.contactForm.get("Numero_Certificado_Salud").setValue(metaData.seccion1.Numero_Certificado_Salud);    
        this.contactForm.get("Fecha_Certificado").setValue(metaData.seccion1.Fecha_Certificado);
        
        this.contactForm.get("nro_resolucion").setValue(metaData.seccion1.nro_resolucion);    
        this.contactForm.get("fecha_resolucion").setValue(metaData.seccion1.fecha_resolucion);
        


      if(metaData.seccion2.Vehiculo_Transmision_automatica===true) {
        this.contactForm.get("Vehiculo_Transmision_automatica").setValue(true);
      }else { 
        this.contactForm.get("Vehiculo_Transmision_automatica").setValue(false);
      }

      if(metaData.seccion2.Vehiculo_acondicionado===true) {
        this.contactForm.get("Vehiculo_acondicionado").setValue(true);
      }else { 
        this.contactForm.get("Vehiculo_acondicionado").setValue(false);
      }

      
      if(metaData.seccion2.Con_lentes===true) {
        this.contactForm.get("Con_lentes").setValue(true);
      }else { 
        this.contactForm.get("Con_lentes").setValue(false);
      }

      
      if(metaData.seccion2.Con_Audifonos===true) {
        this.contactForm.get("Con_Audifonos").setValue(true);
      }else { 
        this.contactForm.get("Con_Audifonos").setValue(false);
      }

      if(metaData.seccion2.Con_espejos_laterales===true) {
        this.contactForm.get("Con_espejos_laterales").setValue(true);
      }else { 
        this.contactForm.get("Con_espejos_laterales").setValue(false);
      }

      if(metaData.seccion2.Sin_restricciones===true) {
        this.contactForm.get("Sin_restricciones").setValue(true);
      }else { 
        this.contactForm.get("Sin_restricciones").setValue(false);
      }

    
        this.contactForm.get("Factor_grupo_sanguineo").setValue(metaData.seccion3.Factor_grupo_sanguineo);

        this.contactForm.get("newsletter1").setValue(metaData.seccion3.PostulaLicencia);


        if(metaData.seccion4.aceptacion===true) {
          this.contactForm.get("aceptacion").setValue(true);
        }else { 
          this.contactForm.get("aceptacion").setValue(false);
        }
        
       
      },
      error => {
        this.errorAlCargarData = true;
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para recuperar los datos guardados del anexo');
      });
  }

}




}
