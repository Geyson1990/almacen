import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario06.component';

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
export class Formulario_006_17_RoutingModule {}
