import { TestBed } from '@angular/core/testing';

import { Formulario00512Service } from './formulario005-12.service';

describe('Formulario00512Service', () => {
  let service: Formulario00512Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00512Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
