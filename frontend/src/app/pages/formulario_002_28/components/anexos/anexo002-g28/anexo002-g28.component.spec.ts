import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002G28Component } from './anexo002-g28.component';

describe('Anexo002G28Component', () => {
  let component: Anexo002G28Component;
  let fixture: ComponentFixture<Anexo002G28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002G28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002G28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
