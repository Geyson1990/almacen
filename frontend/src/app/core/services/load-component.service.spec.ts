import { TestBed } from '@angular/core/testing';

import { LoadComponentService } from './load-component.service';

describe('LoadComponentService', () => {
  let service: LoadComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
