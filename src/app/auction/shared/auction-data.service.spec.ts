import { TestBed } from '@angular/core/testing';

import { AuctionDataService } from './auction-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AuctionDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientTestingModule
    ],

    providers: [AuctionDataService]
  }));

  it('should be created', () => {
    const service: AuctionDataService = TestBed.get(AuctionDataService);
    expect(service).toBeTruthy();
  });
});
