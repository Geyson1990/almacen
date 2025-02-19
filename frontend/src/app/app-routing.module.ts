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
  {
    path: 'tupa/formulario-001-17',
    loadChildren: () =>
      import('./pages/formulario_001_17/formulario_001_17.module').then((m) => m.Formulario_001_17_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-001-27',
    loadChildren: () =>
      import('./pages/formulario_001_27/formulario_001_27.module').then((m) => m.Formulario_001_27_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-001-27NT',
    loadChildren: () =>
      import('./pages/formulario_001_27NT/formulario_001_27.module').then((m) => m.Formulario_001_27_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-002-17',
    loadChildren: () =>
      import('./pages/formulario_002_17/formulario_002_17.module').then((m) => m.Formulario_002_17_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-002-12',
    loadChildren: () =>
      import('./pages/formulario_002_12/formulario_002_12.module').then((m) => m.Formulario_002_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-003-12',
    loadChildren: () =>
      import('./pages/formulario_003_12NT/formulario_003_12NT.module').then((m) => m.Formulario_003_12NT_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-003-17',
    loadChildren: () =>
      import('./pages/formulario_003_17/formulario_003_17.module').then((m) => m.Formulario_003_17_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-004-12',
    loadChildren: () =>
      import('./pages/formulario_004_12/formulario_004_12.module').then((m) => m.Formulario_004_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-001-a12',
    loadChildren: () =>
      import('./pages/formulario_001_a12/formulario_001_a12.module').then((m) => m.Formulario001A12Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-001-b12',
    loadChildren: () =>
      import('./pages/formulario_001_b12/formulario_001_b12.module').then((m) => m.Formulario001B12Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-002-a12',
    loadChildren: () =>
      import('./pages/formulario_002_a12/formulario_002_a12.module').then((m) => m.Formulario002A12Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario-002-b12',
    loadChildren: () =>
      import('./pages/formulario_002_b12/formulario_002_b12.module').then((m) => m.Formulario002B12Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  }, {
    path: 'tupa/formulario-006-17',
    loadChildren: () =>
      import('./pages/formulario_006_17/formulario_006_17.module').then((m) => m.Formulario_006_17_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  }, {
    path: 'tupa/formulario-002-28',
    loadChildren: () =>
      import('./pages/formulario_002_28/formulario_002_28.module').then((m) => m.Formulario_002_28_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  }, {
    path: 'tupa/formulario-001-28',
    loadChildren: () =>
      import('./pages/formulario_001_28/formulario_001_28.module').then((m) => m.Formulario_001_28_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_003_17_2',
    loadChildren: () =>
      import('./pages/formulario_003_17_2/formulario_003_17_2.module').then((m) => m.Formulario_003_17_2_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_002_17_2',
    loadChildren: () =>
      import('./pages/formulario_002_17_2/formulario_002_17_2.module').then((m) => m.Formulario_002_17_2_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_007_12',
    loadChildren: () =>
      import('./pages/formulario_007_12/formulario_007_12.module').then((m) => m.Formulario_007_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_004_12NT',
    loadChildren: () =>
      import('./pages/formulario_004_12NT/formulario_004_12NT.module').then((m) => m.Formulario_004_12NT_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_005_12',
    loadChildren: () =>
      import('./pages/formulario_005_12/formulario_005_12.module').then((m) => m.Formulario_005_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_006_12',
    loadChildren: () =>
      import('./pages/formulario_006_12/formulario_006_12.module').then((m) => m.Formulario_006_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_12',
    loadChildren: () =>
      import('./pages/formulario_001_12/formulario_001_12.module').then((m) => m.Formulario_001_12_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_12_4',
    loadChildren: () =>
      import('./pages/formulario_001_12_4/formulario_001_12_4.module').then((m) => m.Formulario_001_12_4_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  /*{
    path: 'tupa/formulario_012_17_3',
    loadChildren: () =>
      import('./pages/formulario_012_17_3/formulario_012_17_3.module').then((m) => m.Formulario_012_17_3_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },*/
  {
    path: 'tupa/formulario_001_28NT',
    loadChildren: () =>
      import('./pages/formulario_001_28NT/formulario_001_28NT.module').then((m) => m.Formulario_001_28NT_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  // {
  //   path: 'tupa/formulario_003_28NT',
  //   loadChildren: () =>
  //     import('./pages/formulario_003_28NT/formulario_003_28NT.module').then((m) => m.Formulario_003_28NT_Module),
  //   canLoad: [AuthGuard],
  //   canActivate: [AuthGuard],
  //   canActivateChild: [AuthGuard],
  // },
  {
    path: 'tupa/formulario_002_28NT',
    loadChildren: () =>
      import('./pages/formulario_002_28NT/formulario_002_28NT.module').then((m) => m.Formulario_002_28NT_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_16',
    loadChildren: () =>
      import('./pages/formulario_001_16/formulario_001_16.module').then((m) => m.Formulario_001_16_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_004_27',
    loadChildren: () =>
      import('./pages/formulario_004_27/formulario_004_27.module').then((m) => m.Formulario_004_27_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_03',
    loadChildren: () =>
      import('./pages/formulario_001_03/formulario_001_03.module').then((m) => m.Formulario_001_03_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_17_03',
    loadChildren: () =>
      import('./pages/formulario_001_17_03/formulario_001_17_03.module').then((m) => m.Formulario_001_17_03_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  /*{
    path: 'tupa/formulario_001_17_2',
    loadChildren: () =>
      import('./pages/formulario_001_17_2/formulario_001_17_2.module').then((m) => m.Formulario_001_17_2_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },*/
  {
    path: 'tupa/formulario_002_27',
    loadChildren: () =>
      import('./pages/formulario_002_27/formulario_002_27.module').then((m) => m.Formulario_002_27_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_003_27',
    loadChildren: () =>
      import('./pages/formulario_003_27/formulario_003_27.module').then((m) => m.Formulario_003_27_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  /*{
    path: 'tupa/formulario_002_17_3',
    loadChildren: () =>
      import('./pages/formulario_002_17_3/formulario_002_17_3.module').then((m) => m.Formulario_002_17_3_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  }*/,
  {
    path: 'tupa/formulario_001_19_1',
    loadChildren: () =>
      import('./pages/formulario_001_19_1/formulario_001_19_1.module').then((m) => m.Formulario_001_19_1_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'tupa/formulario_001_04_2',
    loadChildren: () =>
      import('./pages/formulario_001_04_2/formulario_001_04_2.module').then((m) => m.Formulario_001_04_2_Module),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
