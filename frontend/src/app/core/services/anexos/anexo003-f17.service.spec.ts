import { TestBed } from '@angular/core/testing';

import { Anexo003F17Service } from './anexo003-f17.service';

describe('Anexo003F17Service', () => {
  let service: Anexo003F17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003F17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
