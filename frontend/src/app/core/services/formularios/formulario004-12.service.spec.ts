import { TestBed } from '@angular/core/testing';

import { Formulario00412Service } from './formulario004-12.service';

describe('Formulario00412Service', () => {
  let service: Formulario00412Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00412Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
