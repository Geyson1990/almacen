import { TranslationWidth } from '@angular/common';
import { Component, EventEmitter, forwardRef, Injectable, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any | null): NgbDateStruct | null {
    return value;
  }

  format(date: NgbDateStruct | null): string {
    return date ? ('0' + date.day).slice(-2) + this.DELIMITER + ('0' + date.month).slice(-2) + this.DELIMITER + date.year : null;
  }
}


const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}/${date.month}/${date.year}`;
  }
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarDatePickerComponent),
  multi: true
};


@Component({
  selector: 'app-calendar-date-picker',
  templateUrl: './calendar-date-picker.component.html',
  styleUrls: ['./calendar-date-picker.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, // define custom NgbDatepickerI18n provider
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
  ]
})
export class CalendarDatePickerComponent implements OnInit, ControlValueAccessor {

  @Input() c: UntypedFormControl = new UntypedFormControl();
  @Input() minDate: Date;
  @Input() maxDate: Date;

  _fecha: NgbDateStruct;
  _minDate: NgbDateStruct;
  _maxDate: NgbDateStruct;


  ngOnInit(): void {

    if (this.minDate)
    {
      this._minDate = {
        day: this.minDate.getDate(), month: this.minDate.getMonth() + 1, year: this.minDate.getFullYear()
      } as NgbDate;
    }

    if (this.maxDate)
    {
      this._maxDate = {
        day: this.maxDate.getDate(), month: this.maxDate.getMonth() + 1, year: this.maxDate.getFullYear()
      } as NgbDate;
    }

  }

  writeValue(obj: Date): void {
    if (!obj)
      return

    this._fecha = {
      day: obj.getDate(), month: obj.getMonth() + 1, year: obj.getFullYear()
    } as NgbDate;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  //propagate changes into the custom form control
  propagateChange = (_: any) => { }
  onTouched: () => {}

  onBlur() {
    this.onTouched();
  }

  fechaModelChange() {
    const nuevaFecha = new Date(this._fecha.year, this._fecha.month - 1, this._fecha.day);
    this.propagateChange(nuevaFecha);
  }

}
