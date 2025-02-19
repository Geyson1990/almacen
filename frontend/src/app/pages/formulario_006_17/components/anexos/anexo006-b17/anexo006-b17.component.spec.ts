import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo006B17Component } from './anexo006-b17.component';

describe('Anexo006B17Component', () => {
  let component: Anexo006B17Component;
  let fixture: ComponentFixture<Anexo006B17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo006B17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo006B17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
