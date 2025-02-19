import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

//NG BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//COMPONENTES
import { AppComponent } from './app.component';
import { RelacionTupasComponent } from './pages/core/components/relacion-tupas/relacion-tupas.component';

//SERVICIOS
import { AddTokenInterceptor } from './helpers/add-token.interceptor';
import { FuncionesMtcService } from './core/services/funciones-mtc.service';

// Import library module
import { NgxSpinnerModule } from 'ngx-spinner';

import { ReniecService } from './core/services/servicios/reniec.service';
import { VehiculoService } from './core/services/servicios/vehiculo.service';
import { ExtranjeriaService } from './core/services/servicios/extranjeria.service';
import { MisTramitesComponent } from './pages/core/components/mis-tramites/mis-tramites.component';
import { SharedModule } from './shared/shared.module';
import { IndexComponent } from './pages/core/components/index/index.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { Formulario_003_12NT_Module } from './pages/formulario_003_12NT/formulario_003_12NT.module';
import { RenatService } from './core/services/servicios/renat.service';
import { Formulario_002_12_Module } from './pages/formulario_002_12/formulario_002_12.module';
import { Formulario_002_27_Module } from './pages/formulario_002_27/formulario_002_27.module';
import { Formulario_001_16_Module } from './pages/formulario_001_16/formulario_001_16.module';
import { Formulario_001_03_Module } from './pages/formulario_001_03/formulario_001_03.module';
import { Formulario_001_17_03_Module } from './pages/formulario_001_17_03/formulario_001_17_03.module';
import { Formulario_003_27_Module } from './pages/formulario_003_27/formulario_003_27.module';
import { Formulario_004_17_3Module } from './pages/formulario_004_17_3/formulario_004_17_3.module';
import { Formulario_005_17_3Module } from './pages/formulario_005_17_3/formulario_005_17_3.module';
import { Formulario_006_17_3Module } from './pages/formulario_006_17_3/formulario_006_17_3.module';
import { Formulario_007_17_3Module }  from './pages/formulario_007_17_3/formulario_007_17_3.module';
import { Formulario_008_17_3Module } from './pages/formulario_008_17_3/formulario_008_17_3.module';
import { CoreModule } from './core/core.module';
import { EncuestasModule } from './modules/encuestas/encuestas.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { Formulario_001_04_2_Module } from './pages/formulario_001_04_2/formulario_001_04_2.module';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from './state/app.state';

import { Formulario_009_17_3Module }  from './pages/formulario_009_17_3/formulario_009_17_3.module';
import { Formulario_010_17_3Module }  from './pages/formulario_010_17_3/formulario_010_17_3.module';
import { Formulario_012_17_3Module }  from './pages/formulario_012_17_3/formulario_012_17_3.module';
import { Formulario_001_PVI_Module } from './pages/formulario_001_PVI/formulario_001_PVI.module';
import { Formulario_001_17_2_Module } from './pages/formulario_001_17_2/formulario_001_17_2.module';
import { Formulario_002_17_2_Module } from './pages/formulario_002_17_2/formulario_002_17_2.module';
import { Formulario_003_17_2_Module } from './pages/formulario_003_17_2/formulario_003_17_2.module';
import { QuillModule } from 'ngx-quill';
import { Formulario_003_28Module } from './pages/formulario_003_28/formulario_003_28.module';
import { Formulario_003_17_3Module } from './pages/formulario_003_17_3/formulario_003_17_3.module';
import { Formulario_002_17_3_Module } from './pages/formulario_002_17_3/formulario_002_17_3.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    RelacionTupasComponent,
    MisTramitesComponent,
    IndexComponent,
    InicioComponent,
  ],
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgbModule,
    CoreModule,
    SharedModule,
    Formulario_003_12NT_Module,
    Formulario_002_12_Module,
    Formulario_002_27_Module,
    Formulario_001_16_Module,
    Formulario_001_03_Module,
    Formulario_001_17_03_Module,
    Formulario_003_27_Module,
    Formulario_001_04_2_Module,
    Formulario_003_17_3Module,
    Formulario_004_17_3Module,
    Formulario_005_17_3Module,
    Formulario_006_17_3Module,
    Formulario_007_17_3Module,
    Formulario_008_17_3Module,
    Formulario_009_17_3Module,
    Formulario_010_17_3Module,
    Formulario_012_17_3Module,
    Formulario_001_PVI_Module,
    Formulario_001_17_2_Module,
    Formulario_002_17_2_Module,
    Formulario_003_17_2_Module,
    Formulario_002_17_3_Module,
    Formulario_003_28Module,
    EncuestasModule,
    RecaptchaModule,
    
    StoreModule.forRoot(ROOT_REDUCERS),
    QuillModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
    },
    FuncionesMtcService,
    ReniecService,
    RenatService,
    VehiculoService,
    ExtranjeriaService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
