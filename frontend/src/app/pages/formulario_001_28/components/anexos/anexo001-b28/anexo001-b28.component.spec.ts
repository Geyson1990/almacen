import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001B28Component } from './anexo001-b28.component';

describe('Anexo001B28Component', () => {
  let component: Anexo001B28Component;
  let fixture: ComponentFixture<Anexo001B28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001B28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001B28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
