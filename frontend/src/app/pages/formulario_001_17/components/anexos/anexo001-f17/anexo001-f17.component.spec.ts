import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001F17Component } from './anexo001-f17.component';

describe('Anexo001F17Component', () => {
  let component: Anexo001F17Component;
  let fixture: ComponentFixture<Anexo001F17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001F17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001F17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
