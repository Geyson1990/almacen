import { Component, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatBytes } from 'src/app/helpers/functions';

@Component({
  selector: 'app-file-upload-core',
  templateUrl: './file-upload-core.component.html',
  styleUrls: ['./file-upload-core.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadCoreComponent,
      multi: true
    }
  ]
})
export class FileUploadCoreComponent implements ControlValueAccessor {
  @ViewChild('inputFile') inputFile;

  file: File | null = null;

  @Input() parentForm: FormGroup;
  @Input() inputUUID: string;
  @Input() fileButtonLabel = '';
  @Input() multiple = false;
  @Input() emptyFileLabel = '';

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

  get getFileLabel(): string {
    if (!this.file) {
      return this.emptyFileLabel ?? '';
    }
    const fileName = this.file.name;
    let fileLabel =
      fileName.length > 25
        ? fileName.slice(0, 25) + '..' + (fileName.split('.')?.pop() ?? '')
        : fileName;
    fileLabel += ' - ' + formatBytes(this.file.size);
    return fileLabel;
  }
}
