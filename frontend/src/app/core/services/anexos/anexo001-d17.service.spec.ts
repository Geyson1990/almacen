import { TestBed } from '@angular/core/testing';

import { Anexo001D17Service } from './anexo001-d17.service';

describe('Anexo001D17Service', () => {
  let service: Anexo001D17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001D17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
