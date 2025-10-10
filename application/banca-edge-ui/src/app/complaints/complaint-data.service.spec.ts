import { TestBed, inject } from '@angular/core/testing';

import { ComplaintDataService } from './complaint-data.service';

describe('ComplaintDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComplaintDataService]
    });
  });

  it('should be created', inject([ComplaintDataService], (service: ComplaintDataService) => {
    expect(service).toBeTruthy();
  }));
});
