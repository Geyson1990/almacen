import { Component, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})

export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('inputFile') inputFile;

  file: File | null = null;

  @Input() parentForm: FormGroup;
  @Input() progress = 0;
  @Input() fileFormLabel = 'Archivo (max. 3MB)';
  @Input() fileButtonLabel = 'Adjuntar';
  @Input() multiple = false;

  onChange: (value: any) => void;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList): any {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  writeValue(value: null): void {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: any) => void): void {
  }

  onClick(): void {
    this.inputFile.nativeElement.click();
  }

  getFileLabel(): string {
    if (!this.file) {
      return 'Seleccione un archivo';
    }
    const fileName = this.file.name;
    let fileLabel =
      fileName.length > 25
        ? fileName.slice(0, 25) + '..' + (fileName.split('.')?.pop() ?? '')
        : fileName;
    fileLabel += ' - ' + Math.round(this.file.size / 10240) / 100 + ' MB';
    return fileLabel;
  }
}

