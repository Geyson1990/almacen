import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTES
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthGuard } from './helpers/auth.guard';
import { CoreComponent } from './pages/core/core.component';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  {
    path: 'http://172.25.3.108/administrado',
    redirectTo: '/autenticacion/iniciar-sesion',
    pathMatch: 'full',
  },
  // {
  //   path: 'inicio',
  //   component: InicioComponent,
  // },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./modules/publico/publico.module').then((m) => m.PublicoModule),
  },
  {
    path: '',
    component: CoreComponent,
    loadChildren: () =>
      import('./pages/core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'autenticacion',
    loadChildren: () =>
      import('./pages/autenticacion/autenticacion.module').then((m) => m.AutenticacionModule),
  },
  {
    path: 'ayuda',
    loadChildren: () =>
      import('./pages/ayuda/ayuda.module').then((m) => m.AyudaModule),
  },
  
  /*{
    path: 'tupa/formulario_007_17_3',
    loadChildren: () =>
      import('./pages/formulario_007_17_3/formulario_007_17_3.module').then((m) => m.Formulario_007_17_3_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },*/
  {
    path: 'profesional',
    loadChildren: () =>
      import('./pages/profesional/profesional.module').then((m) => m.ProfesionalModule),
  },
  //ACTIVAR PARA ENCUESTAS Y PORTAL DE TRAMITES //RC
  {
    path: 'encuesta',
    loadChildren: () =>
      import('./modules/encuestas/encuestas.module').then((m) => m.EncuestasModule),
  },
  // {
  //   path: 'busqueda',
  //   loadChildren: () =>
  //     import('./modules/publico/publico.module').then((m) => m.PublicoModule),
  // },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // {useHash: true} en IIS < 10
  exports: [RouterModule]
})
export class AppRoutingModule { }
