import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002E17Component } from './anexo002-e17.component';

describe('Anexo002E17Component', () => {
  let component: Anexo002E17Component;
  let fixture: ComponentFixture<Anexo002E17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002E17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002E17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
