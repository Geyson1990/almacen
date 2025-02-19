import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/autenticacion/iniciar-sesion',
    pathMatch: 'full',
  },
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
  },
  // {
  //   path: 'registro',
  //   component: RegistroComponent,
  // },
  // {
  //   path: 'recuperar-pass',
  //   component: RecuperarPassComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutenticacionRoutingModule {}
