import { TestBed } from '@angular/core/testing';

import { Anexo003C17Service } from './anexo003-c17.service';

describe('Anexo003C17Service', () => {
  let service: Anexo003C17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Anexo003C17Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
