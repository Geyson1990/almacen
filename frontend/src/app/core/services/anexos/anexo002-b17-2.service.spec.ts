import { TestBed } from '@angular/core/testing';

import { Anexo002B172Service } from './anexo002-b17-2.service';

describe('Anexo002B172Service', () => {
  let service: Anexo002B172Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002B172Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
