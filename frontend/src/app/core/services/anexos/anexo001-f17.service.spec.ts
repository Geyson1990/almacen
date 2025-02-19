import { TestBed } from '@angular/core/testing';

import { Anexo001F17Service } from './anexo001-f17.service';

describe('Anexo001F17Service', () => {
  let service: Anexo001F17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001F17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
