import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002D17Component } from './anexo002-d17.component';

describe('Anexo002D17Component', () => {
  let component: Anexo002D17Component;
  let fixture: ComponentFixture<Anexo002D17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002D17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002D17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
