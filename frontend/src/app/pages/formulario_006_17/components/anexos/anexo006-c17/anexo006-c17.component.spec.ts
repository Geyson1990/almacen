import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo006C17Component } from './anexo006-c17.component';

describe('Anexo006C17Component', () => {
  let component: Anexo006C17Component;
  let fixture: ComponentFixture<Anexo006C17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo006C17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo006C17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
