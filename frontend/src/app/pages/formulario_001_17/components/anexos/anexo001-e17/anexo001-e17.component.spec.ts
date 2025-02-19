import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001E17Component } from './anexo001-e17.component';

describe('Anexo001E17Component', () => {
  let component: Anexo001E17Component;
  let fixture: ComponentFixture<Anexo001E17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001E17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001E17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
