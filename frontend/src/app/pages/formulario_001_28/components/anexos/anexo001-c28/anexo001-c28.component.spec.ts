import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001C28Component } from './anexo001-c28.component';

describe('Anexo001C28Component', () => {
  let component: Anexo001C28Component;
  let fixture: ComponentFixture<Anexo001C28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001C28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001C28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
