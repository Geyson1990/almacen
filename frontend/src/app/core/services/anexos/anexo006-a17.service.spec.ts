import { TestBed } from '@angular/core/testing';

import { Anexo006A17Service } from './anexo006-a17.service';

describe('Anexo006A17Service', () => {
  let service: Anexo006A17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo006A17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
