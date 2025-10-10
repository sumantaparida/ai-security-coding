import { TestBed, inject } from '@angular/core/testing';

import { ServiceRequestDataService } from './services/service-request-data.service';

describe('ServiceRequestDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceRequestDataService]
    });
  });

  it('should be created', inject([ServiceRequestDataService], (service: ServiceRequestDataService) => {
    expect(service).toBeTruthy();
  }));
});
