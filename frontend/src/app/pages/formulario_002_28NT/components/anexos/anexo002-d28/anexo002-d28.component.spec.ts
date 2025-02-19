import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002D28Component } from './anexo002-d28.component';

describe('Anexo002D28Component', () => {
  let component: Anexo002D28Component;
  let fixture: ComponentFixture<Anexo002D28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002D28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002D28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
