import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo012A173Component } from './anexo012_a17_3.component';

describe('Anexo012A173Component', () => {
  let component: Anexo012A173Component;
  let fixture: ComponentFixture<Anexo012A173Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo012A173Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo012A173Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
