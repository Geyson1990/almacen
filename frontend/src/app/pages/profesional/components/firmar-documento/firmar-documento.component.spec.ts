import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarDocumentoComponent } from './firmar-documento.component';

describe('FirmarDocumentoComponent', () => {
  let component: FirmarDocumentoComponent;
  let fixture: ComponentFixture<FirmarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
