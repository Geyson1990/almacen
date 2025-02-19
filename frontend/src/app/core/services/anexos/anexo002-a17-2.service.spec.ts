import { TestBed } from '@angular/core/testing';

import { Anexo002A172Service } from './anexo002-a17-2.service';

describe('Anexo002A172Service', () => {
  let service: Anexo002A172Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo002A172Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
