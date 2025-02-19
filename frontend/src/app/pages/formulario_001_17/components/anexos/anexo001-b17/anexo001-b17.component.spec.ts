import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001B17Component } from './anexo001-b17.component';

describe('Anexo001B17Component', () => {
  let component: Anexo001B17Component;
  let fixture: ComponentFixture<Anexo001B17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001B17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001B17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
