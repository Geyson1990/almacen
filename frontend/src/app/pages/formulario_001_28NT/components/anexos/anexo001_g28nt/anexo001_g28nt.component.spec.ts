import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001_g28nt_Component } from './anexo001_g28nt.component';

describe('Anexo001_g28nt_Component', () => {
  let component: Anexo001_g28nt_Component;
  let fixture: ComponentFixture<Anexo001_g28nt_Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001_g28nt_Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001_g28nt_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
