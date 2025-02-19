import { TestBed } from '@angular/core/testing';

import { RelacionTupasService } from './relacion-tupas.service';

describe('RelacionTupasService', () => {
  let service: RelacionTupasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelacionTupasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
