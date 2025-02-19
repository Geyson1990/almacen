import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo003_A28_Component } from './anexo003_A28.component';

describe('Anexo003_A28_Component', () => {
  let component: Anexo003_A28_Component;
  let fixture: ComponentFixture<Anexo003_A28_Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo003_A28_Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo003_A28_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
