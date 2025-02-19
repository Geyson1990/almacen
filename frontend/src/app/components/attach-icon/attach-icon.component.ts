import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';

@Component({
  selector: 'tupa-attach-icon',
  templateUrl: './attach-icon.component.html',
  styleUrls: ['./attach-icon.component.scss']
})
export class TupaAttachIconComponent {

  @Input() tipo!: string;
  @Input() nombreArchivo: string = '';
  @Input() onArchivoSeleccionado!: (nombreArchivo: string, tipo: string) => void;
  @Input() tamano: number; // tamaño de archivo
  @Input() viewOnly: boolean =false;
  openModal = inject(NgbModal);
  activeModal = inject(NgbActiveModal);

  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService
  ) { }

  onFileSelected(event: any) {  
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file.name);
      if (file.type !== 'application/pdf') {
        event.target.value = '';
        this.funcionesMtcService.mensajeError('Solo puede adjuntar archivos PDF');
        return;
      }

      if (this.tamano) {        
        var TAMANO_MAXIMO = this.tamano * 1024 * 1024;        
        if(file.size > TAMANO_MAXIMO){         
          this.funcionesMtcService.mensajeError(`El archivo no puede exceder a `+ this.tamano+ ` MB`);                    
          return;
        }     
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
              //const nuevoArchivo = new File([file], nuevoNombre, { type: file.type });
              // this.fileName = nuevoNombre; // Guardar el nombre del archivo seleccionado
              // this.fileSelected = true;
              //const reader = new FileReader();
              this.onArchivoSeleccionado(nuevoNombre, this.tipo);

              // reader.onload = (e: any) => {
              //   this.archivoSeleccionado.emit(nuevoNombre);  // Emitir solo el nombre del archivo
              // };
              // reader.readAsDataURL(nuevoArchivo);
            });
        } else {
          this.funcionesMtcService.mensajeOk('No se grabó el archivo');
        }
      });
    } else {
      this.funcionesMtcService.mensajeError('Seleccione el archivo a adjuntar');
    }

  }

  limpiarArchivo() {
    //;
    this.onArchivoSeleccionado('', this.tipo);
  }

  download(event: any) {
    this.funcionesMtcService.mostrarCargando();
    this.tramiteService.getDescargar(this.nombreArchivo.split('_')[0]).subscribe(response => {
      this.funcionesMtcService.ocultarCargando();
      if (response != null) {
        const blob = this.convertBase64ToBlob(response.base64Documento);

        const modalRef = this.openModal.open(VistaPdfComponent, { size: 'xl', scrollable: true });
        const urlPdf = URL.createObjectURL(blob);

        //const url = window.URL.createObjectURL(blob);
        modalRef.componentInstance.pdfUrl = urlPdf;
        modalRef.componentInstance.titleModal = 'Vista Previa';

      }
    });
  }

  convertBase64ToBlob(base64: string): Blob {
    // Eliminar el prefijo si existe (e.g., "data:image/png;base64,")
    // Convertir base64 a un array de bytes
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear un Blob a partir del array de bytes
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Cambia el tipo MIME según el tipo de archivo

    return blob;
  }
}
