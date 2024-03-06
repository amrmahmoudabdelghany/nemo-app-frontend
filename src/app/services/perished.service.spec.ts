import { TestBed } from '@angular/core/testing';

import { PerishedService } from './perished.service';

describe('PerishedService', () => {
  let service: PerishedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerishedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
