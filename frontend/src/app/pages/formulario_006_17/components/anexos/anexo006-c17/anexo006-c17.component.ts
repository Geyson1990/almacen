import { Component, Injectable, OnInit, ViewChild, Input } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal,NgbActiveModal,NgbAccordionDirective  } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import {FormArray,FormGroup,UntypedFormBuilder,FormControl,Validators} from '@angular/forms'

import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo006C17Service } from 'src/app/core/services/anexos/anexo006-c17.service';
import { AnexoResponse } from 'src/app/core/models/Anexos/Anexo006_C17/AnexoResponse';
import { AnexoRequestPost } from 'src/app/core/models/Anexos/Anexo006_C17/AnexoRequestPost';
import { Seccion1, Seccion2, Seccion3 } from 'src/app/core/models/Anexos/Anexo006_C17/Secciones';
import { VisorPdfArchivosService } from 'src/app/core/services/tramite/visor-pdf-archivos.service';



import { AnexoTramiteService } from 'src/app/core/services/tramite/anexo-tramite.service';
import { FormularioTramiteService } from 'src/app/core/services/tramite/formulario-tramite.service';
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
  selector: 'app-anexo006-c17',
  templateUrl: './anexo006-c17.component.html',
  styleUrls: ['./anexo006-c17.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n} // define custom NgbDatepickerI18n provider
  ]
})

export class Anexo006C17Component implements OnInit {

  codigoProcedimientoTupa: string;
  descProcedimientoTupa: string;
  filePdfCroquisSeleccionado: any = null;
  filePdfCroquisPathName: string = null;
  url:string="./assets/fotoinicial.jpg";
  estadofoto:string="false";
  visibleButtonCaf: boolean=false;
  filePdfCafSeleccionado: any =null;
  filePdfCafPathName: string=null;
//AUMENTANDO INTEGRACION___
uriArchivo: string = '';//PARA SABER EL NOMBRE DEL PDF (COMPLETO CON TODO Y ADJUNTOS)
errorAlCargarData: boolean = false;//VARIABLE PARA CONTROLAR CUANDO OCURRE UN ERROR AL RECUPERAR LOS DATOS GUARDADOS DEL ANEXO


codigoTupa: string = "DCV-010" ;

idarchivo:number=0;
archivo:string="";
nombrearchivo:string="";
filePdfSeleccionado: any = null;

graboUsuario: boolean = false;
//__________________________


  @Input() public dataInput: any;
  active = 1;
  idAnexoMovimiento: number = 0;
  indexEditTabla: number = -1;
  disabledAcordion: number = 2;
  public filePdfAdjuntoSeleccionado: any;
  @ViewChild('acc') acc: NgbAccordionDirective ;

  contactForm = this.fb.group({
    Nombres_apellido: ['', [Validators.required, Validators.minLength(3)]],
    Nro_Licencia : ['', [Validators.required, Validators.minLength(3)]],
    Fecha_Caducidad : ['', [Validators.required, Validators.minLength(3)]],
    Dni: this.fb.control(''),
    CE:  this.fb.control(''),
    PTP:  this.fb.control(''),
    Cerne:  this.fb.control(''),
    Telefono: this.fb.control(''),
    Celular: this.fb.control(''),
    Email: ['', [Validators.required, Validators.email]],
    Constancia_Donacion: ['Seleccione', [Validators.required]],
    Solicitante_refugiado: this.fb.control(false),
    Acuerdos_Internacionales: this.fb.control(false),
    Paises_sin_reconocimiento: this.fb.control(false),
    Aceptacion: this.fb.control(false)
});


  constructor(public fb:UntypedFormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formularioService: Anexo006C17Service,
    private anexoTramiteService: AnexoTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private formularioTramiteService: FormularioTramiteService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

    ngOnInit(): void {
      this.uriArchivo = this.dataInput.rutaDocumento;
      const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
      this.codigoProcedimientoTupa =  tramiteSelected.codigo;
      this.descProcedimientoTupa = tramiteSelected.nombre;
   

      setTimeout(() => {
        this.funcionesMtcService.mostrarCargando();
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //RECUPERAMOS DATOS DEL FORMULARIO
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.formularioTramiteService.get(this.dataInput.tramiteReqRefId).subscribe(
          (dataForm: any) => {
  
            this.funcionesMtcService.ocultarCargando();
            const metaDataForm: any = JSON.parse(dataForm.metaData);
 
            this.contactForm.get("Nombres_apellido").setValue(metaDataForm?.seccion1?.nombres);
            this.contactForm.get("Email").setValue(metaDataForm?.seccion1?.correo);

            if(metaDataForm?.seccion1?.tipoDocIdentidad==="01")
            { 
              this.contactForm.get("Dni").setValue(metaDataForm?.seccion1?.numeroDocIdentidad);
            }

            if(metaDataForm?.seccion1?.documentoidentidad==="CE")
            { 
              this.contactForm.get("CE").setValue(metaDataForm?.seccion1?.numero);
            }

            if(metaDataForm?.seccion1?.documentoidentidad==="PTP")
            { 
              this.contactForm.get("PTP").setValue(metaDataForm?.seccion1?.numero);
            }

            if(metaDataForm?.seccion1?.documentoidentidad==="CS")
            { 
              this.contactForm.get("Cerne").setValue(metaDataForm?.seccion1?.numero);
            }

            this.contactForm.get("Telefono").setValue(metaDataForm?.seccion1?.telefono);
            this.contactForm.get("Celular").setValue(metaDataForm?.seccion1?.celular);

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





  
////////////////////////////////////////////// copiando
onChangeInputCroquis(event) {
  if (event.target.files.length === 0)
    return

///  if (event.target.files[0].type !== 'application/pdf') {
//    event.target.value = "";
//    return this.funcionesMtcService.mensajeError("Solo puede adjuntar archivos PDF");
//  }

  this.filePdfCroquisSeleccionado = event.target.files[0];

        ///////////////FOTO NUEVA////////////////////////////////
        var reader=new  FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload=(event:any)=> {
          this.url = event.target.result;
          this.estadofoto="true";
        }
        ///////////////////////////////////////////////// 
  

  event.target.value = "";
  this.filePdfCroquisPathName = null;

}

vistaPreviaPdfCroquis() {
  if (this.filePdfCroquisPathName) {
    this.funcionesMtcService.mostrarCargando();
    this.visorPdfArchivosService.get(this.filePdfCroquisPathName).subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();

        this.filePdfCroquisSeleccionado = file;
        this.filePdfCroquisPathName = null;
        console.log(file);

        var reader=new  FileReader();
      //  var file1 = new File([file], "name"); 
        var file1 = new File([file],"foto.png",{ type: 'image/jpg' });
        reader.readAsDataURL(file1);
        reader.onload=(event:any)=> {
        this.url = event.target.result;
      }
        },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    );
  } 
};

visualizarDialogoPdfCroquis() {
  const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
  const urlPdf = URL.createObjectURL(this.filePdfCroquisSeleccionado);
  modalRef.componentInstance.pdfUrl = urlPdf;
  modalRef.componentInstance.titleModal = "Vista Previa - Croquis";
}

/////////////////////////////////////////////

    
//Metodo para Guardar
guardarAnexo() {

  if (this.contactForm.invalid === true)
  return this.funcionesMtcService.mensajeError('Debe ingresar todos los campos obligatorios');

  if(this.estadofoto==="false")
  return this.funcionesMtcService.mensajeError('Debe ingresar una foto tamaño pasaporte');

  if (this.contactForm.controls['Constancia_Donacion'].value === "Seleccione")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar la Donación de órganos');


  if (this.contactForm.controls['Solicitante_refugiado'].value === true 
  && this.contactForm.controls['Acuerdos_Internacionales'].value === true 
  && this.contactForm.controls['Paises_sin_reconocimiento'].value === true) {
    return this.funcionesMtcService.mensajeError('Solo Debe Seleccionar una Opción en Tipo de Solicitud');
  }

  if (this.contactForm.controls['Solicitante_refugiado'].value === false 
  && this.contactForm.controls['Acuerdos_Internacionales'].value === false 
  && this.contactForm.controls['Paises_sin_reconocimiento'].value === false) {
    return this.funcionesMtcService.mensajeError('Seleccionar una Opción en Tipo de Solicitud');
  }




  let dataGuardar = {
   //-------------------------------------    
     id: this.idAnexoMovimiento,
      
      //CAMPO QUE SE AGREGO PARA INTEGRACION__
      tramiteReqId: this.dataInput.tramiteReqId,
      //_____________________________________
      movimientoFormularioId: 17,
       anexoId: 6,
       codigo: "C",
       metaData: {
        seccion1: {
               Nombres_apellido : this.contactForm.controls['Nombres_apellido'].value,
               Nro_Licencia : this.contactForm.controls['Nro_Licencia'].value,
               Fecha_Caducidad : this.contactForm.controls['Fecha_Caducidad'].value,
               Dni : this.contactForm.controls['Dni'].value,
               CE : this.contactForm.controls['CE'].value,
               PTP : this.contactForm.controls['PTP'].value,
               Cerne : this.contactForm.controls['Cerne'].value,
               Telefono : this.contactForm.controls['Telefono'].value,
               Celular : this.contactForm.controls['Celular'].value,
               Email : this.contactForm.controls['Email'].value,
               Constancia_Donacion : this.contactForm.controls['Constancia_Donacion'].value,
          },
          seccion2: {
            Solicitante_refugiado : this.contactForm.controls['Solicitante_refugiado'].value,
            Acuerdos_Internacionales: this.contactForm.controls['Acuerdos_Internacionales'].value,
            Paises_sin_reconocimiento: this.contactForm.controls['Paises_sin_reconocimiento'].value,
            },
              seccion3: {
                Aceptacion : this.contactForm.controls['Aceptacion'].value,
               // imagen : this.archivo,
               // idimagen:this.idarchivo,
              //  nombreimagen:this.nombrearchivo,  
              //  imagen:this.archivo,
              //  file : this.filePdfSeleccionado,
          
                pdfCroquis:this.filePdfCroquisSeleccionado,
                pathName: this.filePdfCroquisPathName  
              

                }
        
        }
     
   }

   const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
   console.log(dataGuardarFormData);
   console.log(dataGuardar);



   this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
     .then(() => {

      // console.log(JSON.stringify(dataGuardar));

       this.funcionesMtcService.mostrarCargando();

       if (this.idAnexoMovimiento === 0) {
         //GUARDAR:
         this.formularioService.post<any>(dataGuardarFormData)
           .subscribe(
             data => {
               this.funcionesMtcService.ocultarCargando();
               this.idAnexoMovimiento = data.id;

               this.uriArchivo = data.uriArchivo;
               this.graboUsuario = true;

            //   this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
               this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente`);
             },
             error => {
               this.funcionesMtcService.ocultarCargando().mensajeError('Problemas para realizar el guardado de datos');
             }
           );
       } else {
         //MODIFICAR
         this.formularioService.put<any>(dataGuardarFormData)
           .subscribe(
             data => {
               this.funcionesMtcService.ocultarCargando();
               this.idAnexoMovimiento = data.id;

               this.uriArchivo = data.uriArchivo;
               this.graboUsuario = true;
//               alert(this.uriArchivo);
         //    this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
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

 // this.formularioService.readPostFie(this.idAnexoMovimiento)
 this.visorPdfArchivosService.get(this.uriArchivo) 
 .subscribe(
      (file: Blob) => {
        this.funcionesMtcService.ocultarCargando();

        const modalRef = this.modalService.open(VistaPdfComponent, { size: 'lg', scrollable: true });
        const urlPdf = URL.createObjectURL(file);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = "Vista Previa - Anexo 006-C/17";
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

        this.contactForm.get("Nombres_apellido").setValue(metaData.seccion1.Nombres_apellido);
        this.contactForm.get("Nro_Licencia").setValue(metaData.seccion1.Nro_Licencia);
        this.contactForm.get("Dni").setValue(metaData.seccion1.Dni);
        this.contactForm.get("CE").setValue(metaData.seccion1.CE);
        this.contactForm.get("PTP").setValue(metaData.seccion1.PTP);
        this.contactForm.get("Cerne").setValue(metaData.seccion1.Cerne);
        this.contactForm.get("Telefono").setValue(metaData.seccion1.Telefono);
        this.contactForm.get("Celular").setValue(metaData.seccion1.Celular);
        this.contactForm.get("Email").setValue(metaData.seccion1.Email);
        this.contactForm.get("Constancia_Donacion").setValue(metaData.seccion1.Constancia_Donacion);
      
        this.contactForm.get("Fecha_Caducidad").setValue(metaData.seccion1.Fecha_Caducidad);
        
 
        if(metaData.seccion2.Solicitante_refugiado===true) {
          this.contactForm.get("Solicitante_refugiado").setValue(true);
        }else { 
          this.contactForm.get("Solicitante_refugiado").setValue(false);
        }


        if(metaData.seccion2.Acuerdos_Internacionales===true) {
          this.contactForm.get("Acuerdos_Internacionales").setValue(true);
        }else { 
          this.contactForm.get("Acuerdos_Internacionales").setValue(false);
        }

        if(metaData.seccion2.Paises_sin_reconocimiento===true) {
          this.contactForm.get("Paises_sin_reconocimiento").setValue(true);
        }else { 
          this.contactForm.get("Paises_sin_reconocimiento").setValue(false);
        }


        if(metaData.seccion3.Aceptacion===true) {
          this.contactForm.get("Aceptacion").setValue(true);
        }else { 
          this.contactForm.get("Aceptacion").setValue(false);
        }

      
       this.filePdfCroquisPathName =metaData.seccion3.pathName;

       this.vistaPreviaPdfCroquis();


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
