import { TestBed } from '@angular/core/testing';

import { Formulario00712Service } from './formulario007-12.service';

describe('Formulario00712Service', () => {
  let service: Formulario00712Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00712Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
