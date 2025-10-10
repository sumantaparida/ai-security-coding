import { TestBed } from '@angular/core/testing';

import { LeadManagementService } from './lead-management.service';

describe('LeadManagementService', () => {
  let service: LeadManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
