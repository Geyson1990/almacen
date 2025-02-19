import { TestBed } from '@angular/core/testing';

import { Anexo002G17Service } from './anexo002-g17.service';

describe('Anexo002G17Service', () => {
  let service: Anexo002G17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002G17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
