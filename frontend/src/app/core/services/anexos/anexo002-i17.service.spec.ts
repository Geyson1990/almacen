import { TestBed } from '@angular/core/testing';

import { Anexo002I17Service } from './anexo002-i17.service';

describe('Anexo002I17Service', () => {
  let service: Anexo002I17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002I17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
