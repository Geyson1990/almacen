import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo006A17Component } from './anexo006-a17.component';

describe('Anexo006A17Component', () => {
  let component: Anexo006A17Component;
  let fixture: ComponentFixture<Anexo006A17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo006A17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo006A17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
