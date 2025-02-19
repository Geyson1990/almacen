import { TestBed } from '@angular/core/testing';

import { Anexo002H17Service } from './anexo002-h17.service';

describe('Anexo002H17Service', () => {
  let service: Anexo002H17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002H17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
