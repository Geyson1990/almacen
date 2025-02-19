import { TestBed } from '@angular/core/testing';

import { SncService } from './snc.service';

describe('SncService', () => {
  let service: SncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
