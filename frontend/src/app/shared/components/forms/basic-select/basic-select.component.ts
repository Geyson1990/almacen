import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { SelectItemModel } from '../../../../core/models/SelectItemModel';

@Component({
  selector: 'app-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.css']
})
export class BasicSelectComponent {

  @Input() parentForm: FormGroup;
  @Input() selectFormControlName: string;
  @Input() itemList: SelectItemModel[];

  @Input() label = '';
  @Input() defaultItemValue = '';
  @Input() defaultItemText = 'Seleccione una opción';

  @Input() readOnly = false;
  @Input() horizontal = false;

  @Input() customPrepend = false;
  @Input() customAppend = false;
  @Input() btnPrepend = false;
  @Input() btnAppend = false;
  @Input() iconBtnPrepend = '';
  @Input() iconBtnAppend = '';
  @Input() textBtnPrepend = '';
  @Input() textBtnAppend = '';

  @Input() disableBtnPrepend = false;
  @Input() disableBtnAppend = false;


  @Output() clickBtnPrepend = new EventEmitter<any>();
  @Output() clickBtnAppend = new EventEmitter<any>();

  inputUUID = uuidv4();

  constructor(public element: ElementRef) { }

  get inputGroup(): boolean {
    return this.customPrepend || this.customAppend || this.btnPrepend || this.btnAppend;
  }

  onClickBtnPrepend(event: any): void {
    this.clickBtnPrepend.emit(event);
  }

  onClickBtnAppend(event: any): void {
    this.clickBtnAppend.emit(event);
  }

  get selectFormControl(): FormControl { return this.parentForm.get(this.selectFormControlName) as FormControl; }

  isRequired(): boolean {
    if (!this.selectFormControl.validator) {
      return false;
    }

    const validator = this.selectFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }

}
