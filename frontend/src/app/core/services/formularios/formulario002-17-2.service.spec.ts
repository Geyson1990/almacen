import { TestBed } from '@angular/core/testing';

import { Formulario002172Service } from './formulario002-17-2.service';

describe('Formulario002172Service', () => {
  let service: Formulario002172Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario002172Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
