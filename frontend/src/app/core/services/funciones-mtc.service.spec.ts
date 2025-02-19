import { TestBed } from '@angular/core/testing';

import { FuncionesMtcService } from './funciones-mtc.service';

describe('FuncionesMtcService', () => {
  let service: FuncionesMtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionesMtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
