import { TestBed } from '@angular/core/testing';

import { Formulario00217Service } from './formulario002-17.service';

describe('Formulario00217Service', () => {
  let service: Formulario00217Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00217Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
