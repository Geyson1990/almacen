import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002H17Component } from './anexo002-h17.component';

describe('Anexo002H17Component', () => {
  let component: Anexo002H17Component;
  let fixture: ComponentFixture<Anexo002H17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002H17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002H17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
