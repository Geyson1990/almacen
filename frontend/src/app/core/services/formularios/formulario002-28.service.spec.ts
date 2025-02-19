import { TestBed } from '@angular/core/testing';

import { Formulario00228Service } from './formulario002-28.service';

describe('Formulario00228Service', () => {
  let service: Formulario00228Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00228Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
