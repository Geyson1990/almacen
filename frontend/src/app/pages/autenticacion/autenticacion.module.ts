import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';
import { AyudaModalComponent } from './components/ayuda-modal/ayuda-modal.component';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    LoginComponent,
    RecuperarPassComponent,
    AyudaModalComponent,
  ],
  imports: [
    CommonModule,
    AutenticacionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SharedModule,
    RecaptchaModule,
  ],
})
export class AutenticacionModule {}
