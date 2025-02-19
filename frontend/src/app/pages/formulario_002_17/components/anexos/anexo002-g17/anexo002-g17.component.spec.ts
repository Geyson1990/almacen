import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002G17Component } from './anexo002-g17.component';

describe('Anexo002G17Component', () => {
  let component: Anexo002G17Component;
  let fixture: ComponentFixture<Anexo002G17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002G17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002G17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
