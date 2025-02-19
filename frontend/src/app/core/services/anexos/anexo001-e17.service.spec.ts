import { TestBed } from '@angular/core/testing';

import { Anexo001E17Service } from './anexo001-e17.service';

describe('Anexo001E17Service', () => {
  let service: Anexo001E17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001E17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
