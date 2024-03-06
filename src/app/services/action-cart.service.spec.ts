import { TestBed } from '@angular/core/testing';

import { ActionCartService } from './action-cart.service';

describe('ActionCartService', () => {
  let service: ActionCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
