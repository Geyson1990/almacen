import { TestBed } from '@angular/core/testing';

import { Anexo001C17Service } from './anexo001-c17.service';

describe('Anexo001C17Service', () => {
  let service: Anexo001C17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo001C17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
