import { TestBed } from '@angular/core/testing';

import { DatosFormulario001Service } from './datos-formulario001.service';

describe('DatosFormulario001Service', () => {
  let service: DatosFormulario001Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosFormulario001Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
