import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderPublicComponent } from './presentation/components/header-public/header-public.component';
import { HeaderMainComponent } from './presentation/components/header-main/header-main.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderPublicComponent,
    HeaderMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCollapseModule
  ],
  exports: [
    HeaderPublicComponent,
    HeaderMainComponent
  ]
})
export class CoreModule { }
