import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  passHide = true;
  rePassHide = true;
  @Input() parentForm: FormGroup;
  @Input() passFormControlName: string;
  @Input() repassFormControlName: string;
  @Input() passFormLabel: string;
  @Input() rePassFormLabel: string;
  @Input() passFormPlaceHolder: string;
  @Input() rePassFormPlaceHolder: string;
}
