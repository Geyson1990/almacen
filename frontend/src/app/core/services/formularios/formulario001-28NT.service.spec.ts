import { TestBed } from '@angular/core/testing';

import { Formulario00128NTService } from './formulario001-28NT.service';

describe('Formulario00128NTService', () => {
  let service: Formulario00128NTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00128NTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
