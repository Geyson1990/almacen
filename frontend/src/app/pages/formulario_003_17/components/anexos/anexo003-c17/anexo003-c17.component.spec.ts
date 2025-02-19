import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003C17Component } from './anexo003-c17.component';

describe('Anexo003C17Component', () => {
  let component: Anexo003C17Component;
  let fixture: ComponentFixture<Anexo003C17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003C17Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003C17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
