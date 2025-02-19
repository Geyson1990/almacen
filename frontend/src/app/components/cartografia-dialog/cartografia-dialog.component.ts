import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormularioDIAResponse } from 'src/app/core/models/Formularios/FormularioMain';
import { ArchivoAdjunto, FormularioSolicitudDIA } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { IOption, TableColumn, TableRow } from 'src/app/shared/components/table/interfaces/table.interface';
import { CONSTANTES } from 'src/app/enums/constants';
import { ExternoService } from 'src/app/core/services/servicios/externo.service';
import { Observable, catchError, map, of } from 'rxjs';
import { ComboGenerico } from 'src/app/core/models/Maestros/ComboGenerico';

@Component({
  selector: 'cartografia-dialog',
  templateUrl: './cartografia-dialog.component.html',
})
export class CartografiaDialog implements OnInit{
  form: FormGroup;
  activeModal = inject(NgbActiveModal);
  @Input() title!: string;
  @Input() codMaeSolicitud: number;
  @Input() idCliente: number;
  @Input() idEstudio: number;
  @Input() modoVisualizacion: boolean;
  @Input() codMaeRequisito: number;
  data: FormularioSolicitudDIA;  
  documentos: ArchivoAdjunto[] = [];
  showTipoDocumento: boolean = true;
  optsTipoDocumento: IOption[] = [];
  estadoSolicitud: string;
  
  constructor(
    private builder: FormBuilder,
    private tramiteService: TramiteService,
    private funcionesMtcService: FuncionesMtcService,
    private externoService: ExternoService
  ) { }
  
  closeDialog() {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.loadListas();
  }

  private buildForm(): void{
    this.form = this.builder.group({ });
  }

  private getData(): void {
    this.funcionesMtcService.mostrarCargando();
    //const codigoSolicitud = Number(localStorage.getItem('tramite-id'));
    this.tramiteService.getFormularioDia(this.codMaeSolicitud).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success) {
        this.data = JSON.parse(resp.data.dataJson);
        this.patchFormValues(this.data);
      }
    });

    const tramite = localStorage.getItem('tramite-selected');
    const tramiteObj = JSON.parse(tramite);
    this.estadoSolicitud = tramiteObj.estadoSolicitud; 
  }

  private patchFormValues(data: FormularioSolicitudDIA): void {
    this.documentos = data.Cartografia || [];
  }

  save(form:FormGroup){
    //this.activeModal.close(this.documentos);
    this.data.Cartografia = this.documentos || [];
    this.data.SaveCartografia = true;
    this.data.FechaRegistroCartografia = this.funcionesMtcService.dateNow();
    this.GuardarJson(this.data);
  }

  private GuardarJson(data: FormularioSolicitudDIA) {
    const objeto: FormularioDIAResponse = {
      codMaeSolicitud: this.codMaeSolicitud,
      codMaeRequisito: this.codMaeRequisito,
      dataJson: JSON.stringify(data)
    };

    this.tramiteService.postGuardarFormulario(objeto).subscribe(resp => {
      this.funcionesMtcService.ocultarCargando();
      if (resp.success)
        this.funcionesMtcService.ocultarCargando().mensajeOk('Se grabó el formulario').then(() => this.closeDialog());
      else
        this.funcionesMtcService.ocultarCargando().mensajeError('No se grabó el formulario');
    });
  }

  agregarDocumento(item: ArchivoAdjunto) {//AttachButtonComponent - Documentos Adjuntos
    this.documentos.push(item);
  }

  actualizarDocumentos(documentos: ArchivoAdjunto[]) {
        this.documentos = documentos;
      }
      
  private loadListas() {
   
    this.comboGenerico(CONSTANTES.ComboGenericoEIAW.TipoDocumento).subscribe(response => {
      const options = response.map(({ codigo, descripcion }) => ({
        value: codigo.toString(),
        label: descripcion
      }));
      this.optsTipoDocumento.push(...options);
    });

  }
  private comboGenerico(tipo: string): Observable<ComboGenerico[]> {
    this.funcionesMtcService.mostrarCargando();
    return this.externoService.getComboGenericoEiaw(tipo).pipe(
      map(response => {
        this.funcionesMtcService.ocultarCargando();
        return response.success ? response.data : [];
      }),
      catchError(error => {
        this.funcionesMtcService.ocultarCargando();
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  ver(){
    if (this.estadoSolicitud !== 'EN PROCESO') {
    return true;
    }
    return false;
  }

  get viewOnly() { return this.modoVisualizacion; }

  get viewControl() { return !this.modoVisualizacion; }

  habilitarControles() {
    if (this.viewOnly) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.disable();
      });
    }
  }
}
