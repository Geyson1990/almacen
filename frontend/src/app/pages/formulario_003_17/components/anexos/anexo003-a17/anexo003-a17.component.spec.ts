import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003A17Component } from './anexo003-a17.component';

describe('Anexo003A17Component', () => {
  let component: Anexo003A17Component;
  let fixture: ComponentFixture<Anexo003A17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003A17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003A17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
