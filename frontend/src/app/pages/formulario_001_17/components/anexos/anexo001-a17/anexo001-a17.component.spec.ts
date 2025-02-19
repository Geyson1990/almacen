import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001A17Component } from './anexo001-a17.component';

describe('Anexo001A17Component', () => {
  let component: Anexo001A17Component;
  let fixture: ComponentFixture<Anexo001A17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001A17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001A17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
