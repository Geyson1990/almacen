import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002I17Component } from './anexo002-i17.component';

describe('Anexo002I17Component', () => {
  let component: Anexo002I17Component;
  let fixture: ComponentFixture<Anexo002I17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002I17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002I17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
