import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001G17Component } from './anexo001-g17.component';

describe('Anexo001G17Component', () => {
  let component: Anexo001G17Component;
  let fixture: ComponentFixture<Anexo001G17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001G17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001G17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
