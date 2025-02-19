import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002F28Component } from './anexo002-f28.component';

describe('Anexo002F28Component', () => {
  let component: Anexo002F28Component;
  let fixture: ComponentFixture<Anexo002F28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002F28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002F28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
