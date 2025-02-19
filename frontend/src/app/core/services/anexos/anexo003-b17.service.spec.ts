import { TestBed } from '@angular/core/testing';

import { Anexo003B17Service } from './anexo003-b17.service';

describe('Anexo003B17Service', () => {
  let service: Anexo003B17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003B17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
