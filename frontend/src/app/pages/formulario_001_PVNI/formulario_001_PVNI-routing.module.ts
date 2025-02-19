import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './presentation/pages/formulario.component';

//prueba

const routes: Routes = [
  {
    path: '',
    component: FormularioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Formulario_001_PVNI_RoutingModule { }


