import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AyudaIncidenciaComponent } from './components/ayuda-incidencia/ayuda-incidencia.component';
import { AyudaManualComponent } from './components/ayuda-manual/ayuda-manual.component';
import { AyudaTupasComponent } from './components/ayuda-tupas/ayuda-tupas.component';
import { AyudaVoucherComponent } from './components/ayuda-voucher/ayuda-voucher.component';

const routes: Routes = [
  {
    path: 'ayuda-voucher',
    component: AyudaVoucherComponent,
  },
  {
    path: 'ayuda-incidencia',
    component: AyudaIncidenciaComponent,
  },
  {
    path: 'ayuda-manual',
    component: AyudaManualComponent,
  },
  {
    path: 'ayuda-tupas',
    component: AyudaTupasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyudaRoutingModule {}