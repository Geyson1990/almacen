import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-basic-input',
  templateUrl: './basic-input.component.html',
  styleUrls: ['./basic-input.component.css']
})
export class BasicInputComponent {

  @Input() parentForm: FormGroup;
  @Input() inputFormControlName: string;

  @Input() label = '';
  @Input() placeHolder = '';
  @Input() maxLength: number = null;
  @Input() readOnly = false;
  @Input() horizontal = false;
  @Input() textArea = false;
  
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

  @Input() onlyNumbers = false;
  @Input() decimals = false;

  @Output() clickPrepend = new EventEmitter<any>();
  @Output() clickAppend = new EventEmitter<any>();

  inputUUID = uuidv4();

  constructor(public element: ElementRef) { }

  get inputGroup(): boolean {
    return this.customPrepend || this.customAppend || this.btnPrepend || this.btnAppend;
  }

  onClickButtonPrepend(event: any): void {
    this.clickPrepend.emit(event);
  }

  onClickButtonAppend(event: any): void {
    this.clickAppend.emit(event);
  }

  get inputFormControl(): FormControl { return this.parentForm.get(this.inputFormControlName) as FormControl; }

  get exactLengthMessage(): string {
    const { exactlength } = this.inputFormControl.errors;
    if (exactlength) {
      const requiredLength: string = exactlength.requiredLength;
      const plural = requiredLength.indexOf(',') > -1;

      if (plural) {
        return `Los tamaños permitidos son (${exactlength.requiredLength}) caracteres`;
      }
      else {
        return `El tamaño permitido es ${exactlength.requiredLength} caracteres`;
      }
    }
    return '';
  }

  onInputEvent(event: any): void {
    if (event?.target?.value) {
      const position = event.target.selectionStart;
      const value = event.target.value as string;

      let newPosition = position;
      let newValue = value.toUpperCase();

      if (this.onlyNumbers) {
        if (this.decimals) {
          newValue = value.trim().replace(/[^\d\.\,]/g, '');
          let count = (value.trim().match(/[^\d\.\,]/g) || []).length;

          let ocurrence = 0;
          newValue = newValue.replace(/[\.\,]/g, (match: string) => {
            ocurrence += 1;
            if (ocurrence >= 2) {
              count += 1;
              return '';
            }
            return match;
          });

          if (count > 0) {
            newPosition -= count;
          }
        }
        else {
          newValue = value.trim().replace(/[^\d]/g, '');
          const count = (value.trim().match(/[^\d]/g) || []).length;
          if (count > 0) {
            newPosition -= count;
          }
        }
        // this.inputFormControl.setValue(value.trim().replace(/[^0-9]/g, ''), { emitEvent: false });
        // if (value.trim().search(/[^0-9]/g) !== -1) {
        //   event.target.selectionEnd = position - 1;
        //   return;
        // }
      }
      // else {
      // newValue = value.toUpperCase();
      // this.inputFormControl.setValue(value.toUpperCase(), { emitEvent: false });
      // }


      // if (this.inputFormControl.errors?.maxlength) {
      //   const requiredLength = this.inputFormControl.errors.maxlength.requiredLength as number;
      //   newValue = this.oldValue;
      //   newPosition -= (newValue.length - requiredLength);
      //   // newValue = newValue.slice(0, requiredLength);
      // }

      // if (this.inputFormControl.errors?.exactlength) {
      //   const reqLengths = this.inputFormControl.errors.exactlength.requiredLength as string;
      //   const reqLengthArray = reqLengths.split(',');
      //   const arrOfNum = reqLengthArray.map(str => {
      //     return Number(str);
      //   });
      //   const requiredLength = Math.max(...arrOfNum);

      //   console.log('value: ', value);
      //   console.log('newValue: ', newValue);
      //   console.log('inputFormControl.value: ', this.inputFormControl.value);
      //   console.log('this.oldValue: ', this.oldValue);14yht2

      //   if (newValue.length > requiredLength) {
      //     newValue = this.oldValue;
      //     // 123abc45  125
      //     const enterValue = newValue.replace(this.oldValue, '');



      //     newPosition -= (newValue.length - requiredLength);
      //   }

      //   // newValue = newValue.slice(0, requiredLength);
      // }

      // while (this.inputFormControl.errors?.maxlength) {
      //   this.inputFormControl.setValue(
      //     this.inputFormControl.value.substring(0, this.inputFormControl.value.length - 1), { emitEvent: false }
      //   );
      // }

      this.inputFormControl.setValue(newValue, { emitEvent: false });
      event.target.selectionEnd = newPosition;
    }
  }

  isRequired(): boolean {
    if (!this.inputFormControl.validator) {
      return false;
    }

    const validator = this.inputFormControl.validator({} as AbstractControl);
    return (validator && validator.required);
  }

}
