import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo001H17Component } from './anexo001-h17.component';

describe('Anexo001H17Component', () => {
  let component: Anexo001H17Component;
  let fixture: ComponentFixture<Anexo001H17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo001H17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo001H17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
