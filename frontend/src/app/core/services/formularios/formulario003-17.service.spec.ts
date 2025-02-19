import { TestBed } from '@angular/core/testing';

import { Formulario00317Service } from './formulario003-17.service';

describe('Formulario00317Service', () => {
  let service: Formulario00317Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario00317Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
