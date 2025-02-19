import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { formatBytes } from 'src/app/helpers/functions';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-basic-file-upload',
  templateUrl: './basic-file-upload.component.html',
  styleUrls: ['./basic-file-upload.component.css']
})
export class BasicFileUploadComponent {
  @Input() parentForm: FormGroup;
  @Input() fileFormControlName: string;

  @Input() progress = 0;
  @Input() fileFormLabel = '';
  @Input() fileButtonLabel = 'Adjuntar';
  @Input() emptyFileLabel = '';  // Seleccione un archivo
  @Input() multiple = false;

  @Input() horizontal = false;

  inputUUID = uuidv4();
  meFormatBytes = formatBytes;

  get fileFormControl(): FormControl { return this.parentForm.get(this.fileFormControlName) as FormControl; }

  get fileTypeValidatorMessage(): string {
    const { requiredFileType } = this.fileFormControl.errors;
    if (requiredFileType) {
      const requiredLength: string = requiredFileType.requiredLength;
      const plural = requiredLength.indexOf(',') > -1;

      if (plural) {
        return `Los tipos de archivo permitidos son (${requiredFileType.requiredLength})`;
      }
      else {
        return `El tipo de archivo permitido es ${requiredFileType.requiredLength}`;
      }
    }
    return '';
  }

  isRequired(): boolean {
    if (!this.fileFormControl.validator) {
      return false;
    }

    const validator = this.fileFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }

}
