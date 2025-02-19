import { TestBed } from '@angular/core/testing';

import { Anexo001G17Service } from './anexo001-g17.service';

describe('Anexo001G17Service', () => {
  let service: Anexo001G17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001G17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
