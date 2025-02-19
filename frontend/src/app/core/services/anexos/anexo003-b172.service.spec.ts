import { TestBed } from '@angular/core/testing';

import { Anexo003B172Service } from './anexo003-B172.service';

describe('Anexo003E17Service', () => {
  let service: Anexo003B172Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003B172Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
