import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001A28Component } from './anexo001-a28.component';

describe('Anexo001A28Component', () => {
  let component: Anexo001A28Component;
  let fixture: ComponentFixture<Anexo001A28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001A28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001A28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
