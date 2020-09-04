import { Injectable } from '@angular/core';
import {Auction} from './auction';
import {AUCTION_DATA} from './auction-data';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuctionDataService {

  private auctions: Auction[] = AUCTION_DATA;
  private backendApiUrl;

  constructor(private httpClient: HttpClient) {
    this.backendApiUrl = environment.endpoints.backendAuthUrl;
  }

  public getAuctions(): Auction[] {
    return this.auctions;
  }

  getObservableAuctions(): Observable<Auction[]> {
    return of(this.auctions);
  }

  public getHttpAuctions(): Observable<Array<Auction>> {
    return this.httpClient.get<Array<Auction>>(this.backendApiUrl + '/auctions');
  }

  public getHttpAuction(id: number): Observable<Auction> {
    return this.httpClient.get<Auction>(this.backendApiUrl + '/auctions/' + id);
  }

  public create(auction: Auction): Observable<Auction> {
    return this.httpClient.post<Auction>(this.backendApiUrl + '/auctions', auction);
  }

  public delete(auction: Auction): Observable<Auction> {
    return this.httpClient.delete<Auction>(`${this.backendApiUrl}/auctions/${auction.id}`);
  }

  public get(id: number): Observable<Auction> {
    return this.httpClient.get<Auction>(this.backendApiUrl + '/auctions/' + id);
  }

  public list(): Observable<Array<Auction>> {
    return this.httpClient.get<Array<Auction>>(this.backendApiUrl + '/auctions');
  }

  public update(auction: Auction): Observable<Auction> {
    return this.httpClient.put<Auction>(`${this.backendApiUrl}/auctions/${auction.id}`, auction);
  }

}
