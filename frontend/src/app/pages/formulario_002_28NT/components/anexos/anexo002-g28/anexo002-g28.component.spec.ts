import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002C28Component } from './anexo002-c28.component';

describe('Anexo002C28Component', () => {
  let component: Anexo002C28Component;
  let fixture: ComponentFixture<Anexo002C28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002C28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002C28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
