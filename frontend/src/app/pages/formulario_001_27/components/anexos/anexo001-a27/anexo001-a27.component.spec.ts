import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001A27Component } from './anexo001-a27.component';

describe('Anexo001A17Component', () => {
  let component: Anexo001A27Component;
  let fixture: ComponentFixture<Anexo001A27Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001A27Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001A27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
