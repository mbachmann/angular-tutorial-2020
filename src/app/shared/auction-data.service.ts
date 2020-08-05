import {Auction} from './auction';
import {AUCTION_DATA} from './auction-data';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuctionDataService {

  private auctions: Auction[] = AUCTION_DATA;

  constructor(private http: HttpClient) {
  }

  public getAuctions() {
    return this.auctions;
  }
}
