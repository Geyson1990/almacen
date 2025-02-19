import { TestBed } from '@angular/core/testing';

import { Anexo002F17Service } from './anexo002-f17.service';

describe('Anexo002F17Service', () => {
  let service: Anexo002F17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002F17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
