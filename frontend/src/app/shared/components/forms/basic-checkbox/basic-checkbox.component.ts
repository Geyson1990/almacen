import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-basic-checkbox',
  templateUrl: './basic-checkbox.component.html',
  styleUrls: ['./basic-checkbox.component.css']
})
export class BasicCheckboxComponent {

  @Input() parentForm: FormGroup;
  @Input() checkboxFormControlName: string;

  @Input() label = '';
  @Input() readOnly = false;

  @Output() changeCheckbox = new EventEmitter<any>();

  inputUUID = uuidv4();

  get checkboxFormControl(): FormControl { return this.parentForm.get(this.checkboxFormControlName) as FormControl; }

  onChangeCheckbox(event: any): void {
    this.changeCheckbox.emit(event);
  }

  isRequired(): boolean {
    if (!this.checkboxFormControl.validator) {
      return false;
    }

    const validator = this.checkboxFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }
}

