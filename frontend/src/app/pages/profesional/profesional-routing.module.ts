import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirmarDocumentoComponent } from './components/firmar-documento/firmar-documento.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/autenticacion/iniciar-sesion',
    pathMatch: 'full',
  },
  {
    path: 'firmar-documento',
    component: FirmarDocumentoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesionalRoutingModule { }
