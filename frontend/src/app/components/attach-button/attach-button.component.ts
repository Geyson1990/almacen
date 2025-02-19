import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArchivoAdjunto } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';
import { DocumentService } from 'src/app/core/services/document.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { IOption } from 'src/app/shared/components/table/interfaces/table.interface';

@Component({
  selector: 'tupa-attach-button',
  templateUrl: './attach-button.component.html'
})
export class TupaAttachButtonComponent {
  file: File | null = null;
  @Output() documentoSeleccionado = new EventEmitter<ArchivoAdjunto>();
  @Input() formatos: string[] = ['pdf','jpg','png']; // formatos permitidos por defecto    
  @Input() optsTipoDocumento: IOption[] = [];

  @Input() valorSeleccionado: string;
  @Input() showTipoDocumento: boolean = false;
  @Input() tamano: number; // tamaño de archivo
  @Input() registros: number; // tamaño de archivo  
  @Input() cantidadRegistros: number;  
  @Input() limiteRegistros: number;  
  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService
  ) { }

  onFileSelected(event: any) {    
    var cantidad = this.cantidadRegistros;        
    const file = event.target.files[0];
    if (file) {      
      if (this.showTipoDocumento)
        if (this.valorSeleccionado == "0" || this.valorSeleccionado == "") {
          this.funcionesMtcService.mensajeError(`Debe seleccionar un tipo de documento`);
          return;
        }

      const extension = file.name.split('.').pop();
      console.log("tipo de documento:"+this.valorSeleccionado);
      if (!this.formatos.includes(extension)) {
        event.target.value = '';
        this.funcionesMtcService.mensajeError(`Solo puede adjuntar archivos de tipo: ${this.formatos.join(', ')}`);
        return; 
      }
      
      if (this.tamano) {        
        var TAMANO_MAXIMO = this.tamano * 1024 * 1024;        
        if(file.size > TAMANO_MAXIMO){         
          this.funcionesMtcService.mensajeError(`El archivo no puede exceder a `+ this.tamano+ ` MB`);                    
          return;
        }     
      }
 
      if ( this.cantidadRegistros >= this.limiteRegistros) {         
               this.funcionesMtcService.mensajeError(`Solo se aceptan `+this.limiteRegistros+` documentos`);                    
          return;          
      }


      this.funcionesMtcService.mostrarCargando();
      const formdata = new FormData();
      formdata.append('file', file);

      this.tramiteService.postAdjuntar(formdata).subscribe(response => {
        this.funcionesMtcService.ocultarCargando();
        if (response > 0) {
          this.funcionesMtcService.mensajeOk('Se grabó el archivo')
            .then(() => {
              const nuevoNombre = response + '_' + file.name;
              const nuevoArchivo = new File([file], nuevoNombre, { type: file.type });

              let tipoDocId = 1;
              let descripcionTipo = 'DOCUMENTO';
              if (this.showTipoDocumento) {
                tipoDocId = parseInt(this.valorSeleccionado);
                let tipoDocumento = this.optsTipoDocumento.filter(item => item.value == this.valorSeleccionado);
                descripcionTipo = tipoDocumento[0].label;
              }

              //this.fileSelected.emit(nuevoArchivo);
              let archivoAdjunto: ArchivoAdjunto = {
                Id: response,
                Nombre: nuevoNombre,
                Tipo: tipoDocId,
                DescripcionTipo: descripcionTipo
              };

              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.documentoSeleccionado.emit(archivoAdjunto);  // Emitir solo el nombre del archivo
                this.valorSeleccionado = "0";
              };
              reader.readAsDataURL(nuevoArchivo);
            });
        } else {
          this.funcionesMtcService.mensajeOk('No se grabó el archivo');
        }

      });


    } else {
      this.funcionesMtcService.mensajeError('Seleccione el archivo a adjuntar');
    }

  }
   
}
