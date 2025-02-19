import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001D28Component } from './anexo001-d28.component';

describe('Anexo001D28Component', () => {
  let component: Anexo001D28Component;
  let fixture: ComponentFixture<Anexo001D28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001D28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001D28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
