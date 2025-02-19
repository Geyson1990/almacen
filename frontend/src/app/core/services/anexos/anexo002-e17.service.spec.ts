import { TestBed } from '@angular/core/testing';

import { Anexo002E17Service } from './anexo002-e17.service';

describe('Anexo002E17Service', () => {
  let service: Anexo002E17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002E17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
