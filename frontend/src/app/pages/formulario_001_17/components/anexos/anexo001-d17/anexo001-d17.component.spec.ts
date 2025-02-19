import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001D17Component } from './anexo001-d17.component';

describe('Anexo001D17Component', () => {
  let component: Anexo001D17Component;
  let fixture: ComponentFixture<Anexo001D17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001D17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001D17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
