import { TestBed } from '@angular/core/testing';

import { Formulario00312Service } from './formulario003-12.service';

describe('Formulario00312Service', () => {
  let service: Formulario00312Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00312Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
