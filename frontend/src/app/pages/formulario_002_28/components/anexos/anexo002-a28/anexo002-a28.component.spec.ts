import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo002A28Component } from './anexo002-a28.component';

describe('Anexo002A28Component', () => {
  let component: Anexo002A28Component;
  let fixture: ComponentFixture<Anexo002A28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo002A28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo002A28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
