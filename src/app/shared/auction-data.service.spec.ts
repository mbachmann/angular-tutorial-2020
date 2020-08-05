import { TestBed } from '@angular/core/testing';

import { AuctionDataService } from './auction-data.service';

describe('AuctionDataService', () => {
  let service: AuctionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
