import { TestBed } from '@angular/core/testing';

import { DynamicQuoteService } from './dynamicquote.service';

describe('DynamicQuoteService', () => {
  let service: DynamicQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
