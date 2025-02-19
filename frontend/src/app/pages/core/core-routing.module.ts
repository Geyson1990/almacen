import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { CambiarPassComponent } from './components/cambiar-pass/cambiar-pass.component';
import { IndexComponent } from './components/index/index.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { MisTramitesComponent } from './components/mis-tramites/mis-tramites.component';
import { PasarelaPagoComponent } from './components/pasarela-pago/pasarela-pago.component';
import { RecepcionPagoComponent } from './components/recepcion-pago/recepcion-pago.component';
import { RelacionTupasComponent } from './components/relacion-tupas/relacion-tupas.component';
import { SeguridadComponent } from './components/seguridad/seguridad.component';
import { TramiteIniciadoComponent } from './components/tramite-iniciado/tramite-iniciado.component';
import { TramiteIniciarComponent } from './components/tramite-iniciar/tramite-iniciar.component';
import { FormulariosTupaComponent } from './components/formularios-tupa/formularios-tupa.component';

const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'mis-tramites',
    component: MisTramitesComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'tramite-iniciado',
    component: TramiteIniciadoComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'seguridad/:token/:idtupa/:url',
    component: SeguridadComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'tramite-iniciar',
    component: TramiteIniciarComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'pasarela-pago',
    component: PasarelaPagoComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'recepcion-pago',
    component: RecepcionPagoComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'relacion-tupas',
    component: RelacionTupasComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'relacion-tupas/:idGrupo',
    component: RelacionTupasComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'cambiar-password',
    component: CambiarPassComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'mi-cuenta',
    component: MiCuentaComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'formularios-tupa',
    component: FormulariosTupaComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
