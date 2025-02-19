import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentService } from 'src/app/core/services/document.service';
import { FuncionesMtcService } from 'src/app/core/services/funciones-mtc.service';
import { TramiteService } from 'src/app/core/services/tramite/tramite.service';
import { VistaPdfComponent } from 'src/app/shared/components/vista-pdf/vista-pdf.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ArchivoAdjunto } from 'src/app/core/models/Tramite/FormularioSolicitudDIA';

@Component({
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
  styleUrls: ['./document-grid.component.scss']
})
export class DocumentGridComponent implements OnInit {
  @Output() documentosActualizados = new EventEmitter<ArchivoAdjunto[]>();
  @Input() showTipoDocumento: boolean = false;
  @Input() documentos: ArchivoAdjunto[] = [];
  @Input() viewOnly: boolean = false;
  colSpan: number = 2;
  currentItems: number;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private funcionesMtcService: FuncionesMtcService,
    private tramiteService: TramiteService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.colSpan = this.showTipoDocumento ? 3 : this.colSpan;
  }

  get paginatedDocumentos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginateDocuments = this.documentos?.length > 0 ? this.documentos.slice(startIndex, startIndex + this.itemsPerPage) : [];
    this.currentItems = paginateDocuments.length;
    return paginateDocuments;
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  splitDocumento(documento: string): string {
    const parts = documento.split('_'); // Cambia el separador según tus necesidades
    return parts[1] || '';
  }

  visualizar(documentoId: number) {
    this.funcionesMtcService.mostrarCargando();
    this.tramiteService.getDescargar(documentoId).subscribe(response => {
      this.funcionesMtcService.ocultarCargando();
      if (response != null) {
        const blob = this.convertBase64ToBlob(response.base64Documento);
        const fileType = this.getFileType(response.base64Documento);
        let fileName = 'archivo';

        // Establecer el nombre del archivo con la extensión correcta
        if (fileType === 'pdf') {
          // Mostrar PDF en modal
          const modalRef = this.modalService.open(VistaPdfComponent, { size: 'xl', scrollable: true });
          const urlPdf = URL.createObjectURL(blob);
          modalRef.componentInstance.pdfUrl = urlPdf;
          modalRef.componentInstance.titleModal = 'Vista Previa Plantilla Adjuntada';
        } else if (fileType === 'image' || fileType === 'map') {
          // Si es imagen o mapa, proporcionar solo enlace de descarga
          // Asignar la extensión de archivo correcta dependiendo del tipo
          fileName = this.appendFileExtension(fileName, fileType);
          this.downloadFile(blob, fileName);
        } else {
          // Si es otro tipo de archivo (por ejemplo, un zip), solo mostrar enlace de descarga
          fileName = this.appendFileExtension(fileName, fileType);
          this.downloadFile(blob, fileName);
        }
      }
    });
  }

  appendFileExtension(fileName: string, fileType: string): string {
    // Agregar la extensión correcta dependiendo del tipo de archivo
    if (fileType === 'pdf') {
      return fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    } else if (fileType === 'image') {
      // Si el archivo es imagen, puedes agregar la extensión .jpg o .png según el tipo MIME
      // Aquí asumimos que todas las imágenes serán JPEG o PNG
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        return fileName;
      } else {
        return `${fileName}.jpg`;  // o podrías usar .png según el tipo
      }
    } else if (fileType === 'map') {
      // Si es un archivo de mapa, puedes asignar una extensión adecuada como .zip o .tar
      return fileName.endsWith('.cad') ? fileName : `${fileName}.cad`;
    }
    // Por defecto, para otros tipos de archivo asigna una extensión genérica
    return `${fileName}.bin`;  // Esto es solo un ejemplo para otros tipos de archivo desconocidos
  }

  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  eliminar(documentoId: number) {
    this.funcionesMtcService
      .mensajeConfirmar('¿Está seguro de eliminar el registro seleccionado?')
      .then(() => {
        this.documentos = this.documentos.filter(item => item.Id !== documentoId);
        if (this.currentItems == 1) {
          if (this.currentPage > 1)
            this.currentPage -= 1;
        }
        this.documentosActualizados.emit(this.documentos);
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
    return new Blob([byteArray], { type: this.getMimeType(base64) });
  }
  getFileType(base64: string): string {
    // Si es un PDF
    if (base64.startsWith('JVBER')) {
      return 'pdf';
    }

    // Si es una imagen (verificamos los encabezados típicos de imágenes)
    if (base64.startsWith('iVBOR') || base64.startsWith('/9j/')) {
      return 'image';
    }

    // Si es un mapa (por ejemplo, un archivo .zip o cualquier tipo de archivo de mapa)
    if (base64.startsWith('UEsDB')) {
      return 'map';
    }

    return 'unknown';
  }

  getMimeType(base64: string): string {
    if (base64.startsWith('JVBER')) {
      return 'application/pdf';
    }
    if (base64.startsWith('iVBOR') || base64.startsWith('/9j/')) {
      return 'image/jpg'; // Cambia según el tipo de imagen (JPG, PNG, etc.)
    }
    if (base64.startsWith('UEsDB')) {
      return 'application/cad'; // Para mapas, si son archivos cad
    }
    return 'application/octet-stream';
  }

  getIcono(documento: ArchivoAdjunto): string {
    const fileName = documento.Nombre.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      return 'visibility';
    } else {
      return 'download';
    }
  }
}