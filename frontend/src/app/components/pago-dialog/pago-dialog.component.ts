import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { FormularioSolicitudDIA, SolicitudTitulo, SolicitudTituloRequisito } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { Requisito } from 'src/app/core/models/Tramite/TramiteModel';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';


@Component({
  selector: 'pago-dialog',
  templateUrl: './pago-dialog.component.html',
})
export class PagoDialogComponent implements OnInit {
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;

  data: FormularioSolicitudDIA;
  solicita: boolean = true;
  objetoVacio: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };

  requisitoA: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  requisitoB: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  requisitoC: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  requisitoD: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  requisitoE: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  requisitoF: SolicitudTituloRequisito = { Formato: '', Pago: '', Requisito: false };
  estadoSolicitud: string;
 
  constructor(
    private builder: FormBuilder,
    private externoService: ExternoService,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService
  ) { }

  ngOnInit(): void {    
    this.buildForm();   
    this.getData(); 
    this.habilitarControles();         
  }

  //#region ViewOnly
  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      if(this.form !== undefined)
        Object.keys(this.form.controls).forEach(controlName => {
          const control = this.form.get(controlName);
          control?.disable();
        });
    }else{
      if(!this.ver()) this.viewOnly;
    }
  }
  //#endregion ViewOnly

  private buildForm(): void {
    this.form = this.builder.group({
      SolicitaTitulo: [false, Validators.required],
      reqA: [null, Validators.required],
      reqB: [null, Validators.required],
      reqC: [null, Validators.required],
      reqD: [null, Validators.required],
      reqE: [null, Validators.required],
      reqF: [null, Validators.required],
    });
    
    this.valuesChanges();
  }

  private valuesChanges() {

    this.form.get('reqA')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'A'));
    this.form.get('reqB')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'B'));
    this.form.get('reqC')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'C'));
    this.form.get('reqD')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'D'));
    this.form.get('reqE')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'E'));
    this.form.get('reqF')?.valueChanges.subscribe(value => this.onCheckboxChange(value, 'F'));
    this.form.get('SolicitaTitulo')?.valueChanges.subscribe(value => this.onCheckboxChange(value === "1", 'S'));
  }

  private onCheckboxChange(value: boolean, tipo: string) {
    switch (tipo) {
      case "A":
        this.requisitoA.Requisito = value;
        break;

      case "B":
        this.requisitoB.Requisito = value;
        break;

      case "C":
        this.requisitoC.Requisito = value;
        break;

      case "D":
        this.requisitoD.Requisito = value;
        break;

      case "E":
        this.requisitoE.Requisito = value;
        break;

      case "F":
        this.requisitoF.Requisito = value;
        break;

      case "S":
        this.solicita = value;
        break;
    }
  }

  private getData(): void {
    //this.funcionesMtcService.mostrarCargando();
    const codigoSolicitud = this.codMaeSolicitud;
    this.tramiteService.getFormularioDia(codigoSolicitud).subscribe(resp => {
      //this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data?.SolicitudTitulo);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
    
  }

  private patchFormValues(datos?: SolicitudTitulo) {
    
    

    if(datos.SolicitaTitulo=='1' ){
     
      this.form.get('SolicitaTitulo')?.setValue('1');
      this.form.patchValue({
        SolicitaTitulo: datos.SolicitaTitulo,
        reqA: datos.RequisitoA.Requisito,
        reqB: datos.RequisitoB.Requisito,
        reqC: datos.RequisitoC.Requisito,
        reqD: datos.RequisitoD.Requisito,
        reqE: datos.RequisitoE.Requisito,
        reqF: datos.RequisitoF.Requisito
      });
  
      this.requisitoA = datos?.RequisitoA || this.objetoVacio;
      this.requisitoB = datos?.RequisitoB || this.objetoVacio;
      this.requisitoC = datos?.RequisitoC || this.objetoVacio;
      this.requisitoD = datos?.RequisitoD || this.objetoVacio;
      this.requisitoE = datos?.RequisitoE || this.objetoVacio;
      this.requisitoF = datos?.RequisitoF || this.objetoVacio;
    }else{

      if(datos.SolicitaTitulo=='0'){     
        this.form.get('SolicitaTitulo')?.setValue('0');
        this.form.patchValue({
          SolicitaTitulo: datos.SolicitaTitulo
        });
      
      }else{
        this.form.get('SolicitaTitulo')?.setValue('1');
      }   
  
    }
    
  }


  onArchivoSeleccionado(nombreArchivo: string, tipo: string) {
    const fileName = nombreArchivo.split('_')[0];

    switch (tipo) {
      case "FA":
        this.requisitoA.Formato = fileName;
        break;
      case "PA":
        this.requisitoA.Pago = fileName;
        break;
      case "FB":
        this.requisitoB.Formato = fileName;
        break;
      case "PB":
        this.requisitoB.Pago = fileName;
        break;
      case "FC":
        this.requisitoC.Formato = fileName;
        break;
      case "PC":
        this.requisitoC.Pago = fileName;
        break;
      case "FD":
        this.requisitoD.Formato = fileName;
        break;
      case "PD":
        this.requisitoD.Pago = fileName;
        break;
      case "FE":
        this.requisitoE.Formato = fileName;
        break;
      case "PE":
        this.requisitoE.Pago = fileName;
        break;
      case "FF":
        this.requisitoF.Formato = fileName;
        break;
      case "PF":
        this.requisitoF.Pago = fileName;
        break;
    }
  }


  validateSolicitudTitulo(solicitud: SolicitudTitulo): boolean {
    // Validar que SolicitaTitulo no esté vacío
    if (!solicitud.SolicitaTitulo.trim()) {
      console.error("El campo 'SolicitaTitulo' debe estar lleno.");
      return false;
    }
  
    // Validar los requisitos A-F
    const requisitos = [
      solicitud.RequisitoA,
      solicitud.RequisitoB,
      solicitud.RequisitoC,
      solicitud.RequisitoD,
      solicitud.RequisitoE,
      solicitud.RequisitoF
    ];
  
    for (let i = 0; i < requisitos.length; i++) {
      const requisito = requisitos[i];
      if (!requisito) {
        return false;
      }
      if (typeof requisito.Requisito !== 'boolean') {
        console.error(`El campo 'Requisito' en el requisito ${String.fromCharCode(65 + i)} debe ser un valor booleano.`);
        return false;
      }
      if (!requisito.Formato.trim()) {
        console.error(`El campo 'Formato' en el requisito ${String.fromCharCode(65 + i)} debe estar lleno.`);
        return false;
      }
      if (!requisito.Pago.trim()) {
        console.error(`El campo 'Pago' en el requisito ${String.fromCharCode(65 + i)} debe estar lleno.`);
        return false;
      }
    }
  
    
  
    return true;
  }

  validarFormularioSolicitudDIA(formulario: FormularioSolicitudDIA): number {
    if(!this.data.SolicitudTitulo.Save) return 0;
    if(formulario.SolicitudTitulo.SolicitaTitulo==='1'){
      if (!this.validateSolicitudTitulo(formulario.SolicitudTitulo)) return 1;
    }
    return 2;
  }


  save(form: FormGroup) {
    const datos = form.value;
    this.data.SolicitudTitulo.SolicitaTitulo = datos.SolicitaTitulo;
    this.data.SolicitudTitulo.RequisitoA = this.solicita ? this.requisitoA : this.objetoVacio;
    this.data.SolicitudTitulo.RequisitoB = this.solicita ? this.requisitoB : this.objetoVacio;
    this.data.SolicitudTitulo.RequisitoC = this.solicita ? this.requisitoC : this.objetoVacio;
    this.data.SolicitudTitulo.RequisitoD = this.solicita ? this.requisitoD : this.objetoVacio;
    this.data.SolicitudTitulo.RequisitoE = this.solicita ? this.requisitoE : this.objetoVacio;
    this.data.SolicitudTitulo.RequisitoF = this.solicita ? this.requisitoF : this.objetoVacio;
    this.data.SolicitudTitulo.Save = true;
    this.data.SolicitudTitulo.FechaRegistro = this.funcionesMtcService.dateNow();
    this.data.SolicitudTitulo.State = this.validarFormularioSolicitudDIA(this.data);


    const validacion = this.fnValidacionInputs(this.data.SolicitudTitulo);
    if (!validacion.permitido) {
      return this.funcionesMtcService.mensajeError(validacion.mensaje);
    }
 
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(this.data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {       
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.funcionesMtcService.mensajeOk('Se grabó el formulario');   
            
      } else {
        this.funcionesMtcService.mensajeError('No se grabó el formulario');
      }
     
    });
 
    this.activeModal.close(datos);
   
  }

  closeDialog() {
    this.activeModal.dismiss();
  }

  fnValidacionInputs(data: SolicitudTitulo): { permitido: boolean, mensaje: string } {
    if (data.SolicitaTitulo === "1") {
      if (data.RequisitoA.Requisito) {
        if (data.RequisitoA.Formato === "" || data.RequisitoA.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito A.' };
        }
      }
      if (data.RequisitoB.Requisito) {
        if (data.RequisitoB.Formato === "" || data.RequisitoB.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito B.' };
        }
      }
      if (data.RequisitoC.Requisito) {
        if (data.RequisitoC.Formato === "" || data.RequisitoC.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito C.' };
        }
      }
      if (data.RequisitoD.Requisito) {
        if (data.RequisitoD.Formato === "" || data.RequisitoD.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito D.' };
        }
      }
      if (data.RequisitoE.Requisito) {
        if (data.RequisitoE.Formato === "" || data.RequisitoE.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito E.' };
        }
      }
      if (data.RequisitoF.Requisito) {
        if (data.RequisitoF.Formato === "" || data.RequisitoF.Pago === "") {
          return { permitido: false, mensaje: 'Debe adjuntar el formato/pago del requisito F.' };
        }
      }
    }
    return { permitido: true, mensaje: '' };
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }
}
