import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { EncuestaComponent } from './presentation/pages/encuesta/encuesta.component';

const routes: Routes = [
  {
    path: 'form/:idEncuesta/:codIdentificador',
    component: EncuestaComponent,
  },{
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestasRoutingModule {}
