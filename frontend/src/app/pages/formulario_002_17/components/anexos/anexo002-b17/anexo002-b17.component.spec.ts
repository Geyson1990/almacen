import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002B17Component } from './anexo002-b17.component';

describe('Anexo002B17Component', () => {
  let component: Anexo002B17Component;
  let fixture: ComponentFixture<Anexo002B17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002B17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002B17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
