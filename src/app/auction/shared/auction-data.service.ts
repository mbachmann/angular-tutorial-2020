import { Injectable } from '@angular/core';
import {Auction} from './auction';
import {AUCTION_DATA} from './auction-data';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuctionDataService {

  private auctions: Auction[] = AUCTION_DATA;
  private URL = 'http://localhost:4730/auctions';

  constructor(private httpClient: HttpClient) {}

  public getAuctions(): Auction[] {
    return this.auctions;
  }

  getObservableAuctions(): Observable<Auction[]> {
    return of(this.auctions);
  }

  public getHttpAuctions(): Observable<Array<Auction>> {
    return this.httpClient.get<Array<Auction>>(this.URL);
  }

  public getHttpAuction(id: number): Observable<Auction> {
    return this.httpClient.get<Auction>(this.URL + '/' + id);
  }

  public create(auction: Auction): Observable<Auction> {
    return this.httpClient.post<Auction>(this.URL, auction);
  }

  public delete(auction: Auction): Observable<Auction> {
    return this.httpClient.delete<Auction>(`${this.URL}/${auction.id}`);
  }

  public get(id: number): Observable<Auction> {
    return this.httpClient.get<Auction>(this.URL + '/' + id);
  }

  public list(): Observable<Array<Auction>> {
    return this.httpClient.get<Array<Auction>>(this.URL);
  }

  public update(auction: Auction): Observable<Auction> {
    return this.httpClient.put<Auction>(`${this.URL}/${auction.id}`, auction);
  }

}
