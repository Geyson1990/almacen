import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003E17Component } from './anexo003-e17.component';

describe('Anexo003E17Component', () => {
  let component: Anexo003E17Component;
  let fixture: ComponentFixture<Anexo003E17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003E17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003E17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
