import { TestBed } from '@angular/core/testing';

import { ExtranjeriaService } from './extranjeria.service';

describe('ExtranjeriaService', () => {
  let service: ExtranjeriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtranjeriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
