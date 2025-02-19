import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003B17Component } from './anexo003-b17.component';

describe('Anexo003B17Component', () => {
  let component: Anexo003B17Component;
  let fixture: ComponentFixture<Anexo003B17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003B17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003B17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
