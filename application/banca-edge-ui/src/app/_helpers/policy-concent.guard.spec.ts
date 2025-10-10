import { TestBed } from '@angular/core/testing';

import { PolicyConcentGuard } from './policy-concent.guard';

describe('PolicyConcentGuard', () => {
  let guard: PolicyConcentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PolicyConcentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
