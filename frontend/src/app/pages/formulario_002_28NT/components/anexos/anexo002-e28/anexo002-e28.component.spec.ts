import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002E28Component } from './anexo002-e28.component';

describe('Anexo002E28Component', () => {
  let component: Anexo002E28Component;
  let fixture: ComponentFixture<Anexo002E28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002E28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002E28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
