import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001_d28nt_Component } from './anexo001_d28nt.component';

describe('Anexo001_d28nt_Component', () => {
  let component: Anexo001_d28nt_Component;
  let fixture: ComponentFixture<Anexo001_d28nt_Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001_d28nt_Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001_d28nt_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
