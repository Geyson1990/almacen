import { Component, Injectable, OnInit, ViewChild , Input} from '@angular/core';
import { SelectionModel } from 'src/app/core/models/SelectionModel';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal ,NgbActiveModal ,NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, UntypedFormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { Anexo006B17Service } from 'src/app/core/services/anexos/anexo006-b17.service';
import { AnexoResponse } from 'src/app/core/models/Anexos/Anexo006_B17/AnexoResponse';
import { AnexoRequestPost } from 'src/app/core/models/Anexos/Anexo006_B17/AnexoRequestPost';
import { Seccion1, Seccion2, Seccion3, Seccion4 } from 'src/app/core/models/Anexos/Anexo006_B17/Secciones';
import { DropdownService } from 'src/app/core/models/Anexos/Anexo006_B17/dropdown.service';
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
  selector: 'app-anexo006-b17',
  templateUrl: './anexo006-b17.component.html',
  styleUrls: ['./anexo006-b17.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n} // define custom NgbDatepickerI18n provider
  ]
})
export class Anexo006B17Component implements OnInit {
  
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
codigoTupa: string = "DSTT-030" ;

graboUsuario: boolean = false;


  @Input() public dataInput: any;
  active = 1;
  idAnexoMovimiento: number = 0;
  indexEditTabla: number = -1;
  disabledAcordion: number = 2;

  newsletterOp:any[];
  newsletterOp1:any[];
  newsletterOp2:any[];
  newsletterOp3:any[];

  



  @ViewChild('acc') acc: NgbAccordionDirective ;
  //Validando Campos///////////////////
 //Validando Campos///////////////////
 contactForm = this.fb.group({
  Nombres_apellido: ['', [Validators.required, Validators.minLength(3)]],
  numero: ['',
          [
           Validators.required,
            Validators.minLength(8),
          Validators.maxLength(10),
            Validators.pattern('^[0-9]*$'),
          ],
        ],
    Pasaporte : ['', [Validators.required, Validators.minLength(3)]],
    Fecha_Nacimiento: ['', [Validators.required, Validators.minLength(3)]],
    Fecha_Caducidad: ['', [Validators.required, Validators.minLength(3)]],
    //  Vehiculo_Transmision_automatica: this.fb.control(false),
  //    aceptacion: this.fb.control(false)

  Sexo: this.fb.control('Seleccione'),
  Condicion:this.fb.control('Seleccione'),
  Documento_identidad:this.fb.control('Seleccione'),
  Domicilio:this.fb.control(''),
  Nro_Licencia_Extranjera:this.fb.control(''),
  Nro_Licencia_Peruana:this.fb.control(''),
  newsletter: ['s'],
  newsletter1: ['1'],
  newsletter2: ['s'],
  FactorSanguineo: ['0'],
  Vehiculo_Transmision_automatica: this.fb.control(false),
  Vehiculo_acondicionado: this.fb.control(false),
  Con_lentes: this.fb.control(false),
  Con_Audifonos: this.fb.control(false),
  Con_espejos_laterales: this.fb.control(false),
  Sin_restricciones: this.fb.control(false),
  aceptacion: this.fb.control(false)
  //FactorSanguineo: this.fb.control('')
});

  constructor( public fb:UntypedFormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private dropdownService:DropdownService,
    private formularioService: Anexo006B17Service,
    private anexoTramiteService: AnexoTramiteService,
    private formularioTramiteService: FormularioTramiteService,
    private visorPdfArchivosService: VisorPdfArchivosService,
    private funcionesMtcService: FuncionesMtcService
    ) { }

  ngOnInit(): void {
    this.uriArchivo = this.dataInput.rutaDocumento; 
    const tramiteSelected: any= JSON.parse(localStorage.getItem('tramite-selected'));
    this.codigoProcedimientoTupa =  tramiteSelected.codigo;
    this.descProcedimientoTupa = tramiteSelected.nombre;

    this.newsletterOp = this.dropdownService.getNewsletter();
    this.newsletterOp1 = this.dropdownService.getNewsletter1();
    this.newsletterOp2 = this.dropdownService.getNewsletter2();
    this.newsletterOp3 = this.dropdownService.getNewsletter3();
 //   this.recuperarInformacion();



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
     this.contactForm.get("Domicilio").setValue(metaDataForm?.seccion1?.domicilio);
     
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
 

    //  this.contactForm.get("Documento_Identidad").setValue(metaDataForm?.seccion1?.numero);
  
   //   this.contactForm.get("telefono").setValue(metaDataForm?.seccion1?.telefono);
    //  this.contactForm.get("celular").setValue(metaDataForm?.seccion1?.celular);
    //  this.contactForm.get("correo").setValue(metaDataForm?.seccion1?.correo);
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

 
/////////////////////////////////////////////////////////////////
 
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




///////////////////////////////////////////////////////////////////


//Metodo para Guardar
guardarAnexo() {

  
  if(this.estadofoto==="false")
  return this.funcionesMtcService.mensajeError('Debe ingresar una foto tamaño pasaporte');


  if (this.contactForm.controls['Condicion'].value === "Seleccione")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Condición');


  if (this.contactForm.controls['Documento_identidad'].value === "Seleccione")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Documento de Identidad');

  if (this.contactForm.controls['Sexo'].value === "Seleccione")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Genero');



  if (this.contactForm.controls['Vehiculo_Transmision_automatica'].value === true 
  && this.contactForm.controls['Vehiculo_acondicionado'].value === true 
  && this.contactForm.controls['Con_lentes'].value === true
  && this.contactForm.controls['Con_Audifonos'].value === true
  && this.contactForm.controls['Con_espejos_laterales'].value === true
  && this.contactForm.controls['Sin_restricciones'].value === true) {
    return this.funcionesMtcService.mensajeError('Solo Debe Seleccionar dos Restricciones del Certificado de Salud');
  }

  
  if (this.contactForm.controls['Vehiculo_Transmision_automatica'].value === false 
  && this.contactForm.controls['Vehiculo_acondicionado'].value === false 
  && this.contactForm.controls['Con_lentes'].value === false
  && this.contactForm.controls['Con_Audifonos'].value === false
  && this.contactForm.controls['Con_espejos_laterales'].value === false
  && this.contactForm.controls['Sin_restricciones'].value === false) {
    return this.funcionesMtcService.mensajeError('Seleccionar dos restricciones del Certificado de Salud');
  }


  if (this.contactForm.controls['FactorSanguineo'].value === "Seleccione")
  return this.funcionesMtcService.mensajeError('Debe Seleccionar Factor Sanguineo');



  let dataGuardar = {
   //-------------------------------------    
   id: this.idAnexoMovimiento,
      
   //CAMPO QUE SE AGREGO PARA INTEGRACION__
   tramiteReqId: this.dataInput.tramiteReqId,
   //_____________________________________
   movimientoFormularioId: 17,
    anexoId: 6,
    codigo: "B",
       metaData: {
        seccion1: {
               Nombres_apellido : this.contactForm.controls['Nombres_apellido'].value,
               Condicion : this.contactForm.controls['Condicion'].value,
               Documento_identidad : this.contactForm.controls['Documento_identidad'].value,
               Numero : this.contactForm.controls['numero'].value,
               Fecha_Nacimiento : this.contactForm.controls['Fecha_Nacimiento'].value,
               Pasaporte : this.contactForm.controls['Pasaporte'].value,
               Sexo : this.contactForm.controls['Sexo'].value,
               Domicilio : this.contactForm.controls['Domicilio'].value,

               Nro_Licencia_Extranjera : this.contactForm.controls['Nro_Licencia_Extranjera'].value,
               Fecha_Caducidad : this.contactForm.controls['Fecha_Caducidad'].value,
               Nro_Licencia_Peruana : this.contactForm.controls['Nro_Licencia_Peruana'].value,
               Servicios : this.contactForm.controls['newsletter'].value,
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
              Licencia_Postular : this.contactForm.controls['newsletter1'].value,
              FactorSanguineo: this.contactForm.controls['FactorSanguineo'].value,
              donacion_organos : this.contactForm.controls['newsletter2'].value,
              pdfCroquis:this.filePdfCroquisSeleccionado,
              pathName: this.filePdfCroquisPathName  
              },
              seccion4: {
                aceptacion : this.contactForm.controls['aceptacion'].value,
                }
        
        }
     
   }

   const dataGuardarFormData = this.funcionesMtcService.jsonToFormData(dataGuardar);
   console.log(dataGuardarFormData);
   console.log(dataGuardar);
   this.funcionesMtcService.mensajeConfirmar(`¿Está seguro de ${this.idAnexoMovimiento === 0 ? 'guardar' : 'modificar'} los datos ingresados?`)
     .then(() => {

     //  console.log(JSON.stringify(dataGuardar));

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
//this.funcionesMtcService.mensajeOk(`Los datos fueron guardados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
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
             //  alert(this.uriArchivo);

//this.funcionesMtcService.mensajeOk(`Los datos fueron modificados exitosamente (idFormularioMovimiento = ${this.idAnexoMovimiento})`);
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
        modalRef.componentInstance.titleModal = "Vista Previa - Anexo 006-B/17";
      },
      error => {
        this.funcionesMtcService
          .ocultarCargando()
          .mensajeError('Problemas para descargar Pdf');
      }
    );

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
        this.contactForm.get("Condicion").setValue(metaData.seccion1.Condicion);
        this.contactForm.get("Documento_identidad").setValue(metaData.seccion1.Documento_identidad);
        this.contactForm.get("numero").setValue(metaData.seccion1.Numero);
        this.contactForm.get("Fecha_Nacimiento").setValue(metaData.seccion1.Fecha_Nacimiento);
        this.contactForm.get("Pasaporte").setValue(metaData.seccion1.Pasaporte);
        this.contactForm.get("Sexo").setValue(metaData.seccion1.Sexo);
        this.contactForm.get("Domicilio").setValue(metaData.seccion1.Domicilio);
        this.contactForm.get("Nro_Licencia_Extranjera").setValue(metaData.seccion1.Nro_Licencia_Extranjera);
        this.contactForm.get("Fecha_Caducidad").setValue(metaData.seccion1.Fecha_Caducidad);
        this.contactForm.get("Nro_Licencia_Peruana").setValue(metaData.seccion1.Nro_Licencia_Peruana);
    
        if(metaData.seccion1.Servicios==="s"){
          this.contactForm.get("newsletter").setValue("s");
        }

        if(metaData.seccion1.Servicios==="n"){
          this.contactForm.get("newsletter").setValue("n");
        }
       
        

        this.contactForm.get("Vehiculo_Transmision_automatica").setValue(metaData.seccion2.Vehiculo_Transmision_automatica);
        this.contactForm.get("Vehiculo_acondicionado").setValue(metaData.seccion2.Vehiculo_acondicionado);
        this.contactForm.get("Con_lentes").setValue(metaData.seccion2.Con_lentes);
        this.contactForm.get("Con_Audifonos").setValue(metaData.seccion2.Con_Audifonos);
        this.contactForm.get("Con_espejos_laterales").setValue(metaData.seccion2.Con_espejos_laterales);
        this.contactForm.get("Sin_restricciones").setValue(metaData.seccion2.Sin_restricciones);

        if(metaData.seccion1.Licencia_Postular==="1"){
          this.contactForm.get("newsletter1").setValue("1");
        }
        if(metaData.seccion1.Licencia_Postular==="2"){
          this.contactForm.get("newsletter1").setValue("2");
        }
        if(metaData.seccion1.Licencia_Postular==="3"){
          this.contactForm.get("newsletter1").setValue("3");
        }
        if(metaData.seccion1.Licencia_Postular==="4"){
          this.contactForm.get("newsletter1").setValue("4");
        }
        if(metaData.seccion1.Licencia_Postular==="5"){
          this.contactForm.get("newsletter1").setValue("5");
        }
        if(metaData.seccion1.Licencia_Postular==="6"){
          this.contactForm.get("newsletter1").setValue("6");
        }

        this.contactForm.get("FactorSanguineo").setValue(metaData.seccion3.FactorSanguineo);
        
        if(metaData.seccion1.donacion_organos==="s"){
          this.contactForm.get("newsletter2").setValue("s");
        }
        if(metaData.seccion1.donacion_organos==="n"){
          this.contactForm.get("newsletter2").setValue("n");
        }

     
        this.filePdfCroquisPathName =metaData.seccion3.pathName;

        this.vistaPreviaPdfCroquis();
 

        this.contactForm.get("aceptacion").setValue(metaData.seccion4.aceptacion);

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
