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
import { RenatService } from './core/services/servicios/renat.service';

import { CoreModule } from './core/core.module';
import { EncuestasModule } from './modules/encuestas/encuestas.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from './state/app.state';


import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { MisInventariosComponent } from './pages/core/components/mis-inventarios/mis-inventarios.component';
import { RegistroEntradaComponent } from './pages/core/components/registro-entrada/registro-entrada.component';

@NgModule({
  declarations: [
    AppComponent,
    RelacionTupasComponent,
    MisTramitesComponent,
    IndexComponent,
    InicioComponent,
    MisInventariosComponent,
    RegistroEntradaComponent
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
