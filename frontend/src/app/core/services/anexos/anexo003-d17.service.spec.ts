import { TestBed } from '@angular/core/testing';

import { Anexo003D17Service } from './anexo003-d17.service';

describe('Anexo003D17Service', () => {
  let service: Anexo003D17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003D17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
