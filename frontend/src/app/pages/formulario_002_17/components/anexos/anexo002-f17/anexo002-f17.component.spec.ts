import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002F17Component } from './anexo002-f17.component';

describe('Anexo002F17Component', () => {
  let component: Anexo002F17Component;
  let fixture: ComponentFixture<Anexo002F17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002F17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002F17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
