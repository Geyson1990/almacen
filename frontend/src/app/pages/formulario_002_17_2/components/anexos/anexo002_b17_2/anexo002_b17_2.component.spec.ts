import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002_b17_2_Component } from './anexo002_b17_2.component';

describe('Anexo002_b17_2_Component', () => {
  let component: Anexo002_b17_2_Component;
  let fixture: ComponentFixture<Anexo002_b17_2_Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002_b17_2_Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002_b17_2_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
