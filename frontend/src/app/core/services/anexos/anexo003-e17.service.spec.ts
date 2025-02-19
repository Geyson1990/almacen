import { TestBed } from '@angular/core/testing';

import { Anexo003E17Service } from './anexo003-e17.service';

describe('Anexo003E17Service', () => {
  let service: Anexo003E17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003E17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
