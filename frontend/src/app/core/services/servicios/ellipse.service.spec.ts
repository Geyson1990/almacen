import { TestBed } from '@angular/core/testing';

import { MtcService } from './mtc.service';

describe('MtcService', () => {
  let service: MtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
