import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001C17Component } from './anexo001-c17.component';

describe('Anexo001C17Component', () => {
  let component: Anexo001C17Component;
  let fixture: ComponentFixture<Anexo001C17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001C17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001C17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
