import { TestBed } from '@angular/core/testing';

import { Anexo001B17Service } from './anexo001-b17.service';

describe('Anexo001B17Service', () => {
  let service: Anexo001B17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001B17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
