import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Formulario_001_19_1_RoutingModule {}
