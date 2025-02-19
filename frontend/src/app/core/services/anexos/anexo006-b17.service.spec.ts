import { TestBed } from '@angular/core/testing';

import { Anexo006B17Service } from './anexo006-b17.service';

describe('Anexo006B17Service', () => {
  let service: Anexo006B17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo006B17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
