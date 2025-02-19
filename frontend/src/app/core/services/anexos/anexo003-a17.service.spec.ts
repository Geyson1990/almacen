import { TestBed } from '@angular/core/testing';

import { Anexo003A17Service } from './anexo003-a17.service';

describe('Anexo003A17Service', () => {
  let service: Anexo003A17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003A17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
