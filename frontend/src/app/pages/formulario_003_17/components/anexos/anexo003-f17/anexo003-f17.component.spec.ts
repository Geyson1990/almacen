import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003F17Component } from './anexo003-f17.component';

describe('Anexo003F17Component', () => {
  let component: Anexo003F17Component;
  let fixture: ComponentFixture<Anexo003F17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003F17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003F17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
