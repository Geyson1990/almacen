import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003D17Component } from './anexo003-d17.component';

describe('Anexo003D17Component', () => {
  let component: Anexo003D17Component;
  let fixture: ComponentFixture<Anexo003D17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003D17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003D17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
