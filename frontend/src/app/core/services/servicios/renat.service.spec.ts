import { TestBed } from '@angular/core/testing';

import { RenatService } from './renat.service';

describe('RenatService', () => {
  let service: RenatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
