import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002A17Component } from './anexo002-a17.component';

describe('Anexo002A17Component', () => {
  let component: Anexo002A17Component;
  let fixture: ComponentFixture<Anexo002A17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002A17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002A17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
