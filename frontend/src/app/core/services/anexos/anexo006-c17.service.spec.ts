import { TestBed } from '@angular/core/testing';

import { Anexo006C17Service } from './anexo006-c17.service';

describe('Anexo006C17Service', () => {
  let service: Anexo006C17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo006C17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
