import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuctionDataService} from '../shared/auction-data.service';
import {Subscription} from 'rxjs';
import {Auction} from '../shared/auction';
import {CURRENCY_STRING} from '../../app.constants';
import {HelperService} from '../../shared/helper/helper.service';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit, OnDestroy {

  auction: Auction;
  private routeSubscription: Subscription;
  private subscription: Subscription;
  private isFocusBid = false;

  constructor(private auctionDataService: AuctionDataService,
              private route: ActivatedRoute,
              private router: Router,
              private helperService: HelperService) {

  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      // console.log(params['id']);
      this.subscription = this.auctionDataService.getHttpAuction(params['id']).subscribe(
        auction => {
          this.auction = auction;
          // console.log('auction: ' + auction);
          // this.adjustDate();
        },
        err => console.log(err)
      );

    });
  }

  ngOnDestroy(): void {

    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }

    if (this.subscription != null)  {
      this.subscription.unsubscribe();
    }
  }

  getLocalDate(date: Date): string {
    // let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return (date.toLocaleString(undefined, {hour12: false}));
  }

  tick(interval): void {
    this.computeTimeLeft();
  }

  adjustDate(): void {
    const currentTime = new Date();
    this.auction.endDateTime = new Date(currentTime.valueOf() + 100000);
    this.auction.startDateTime = new Date();
  }

  getAmount(): number {
    let amount: number = this.auction.startingPrice;
    if (this.auction.bids.length > 0) {
      amount = this.auction.bids[this.auction.bids.length - 1].amount;
    }
    return amount;
  }

  getBidAmount(): number {
    let amount: number = this.auction.startingPrice;
    if (this.auction.bids.length > 0) {
      amount = this.auction.bids[this.auction.bids.length - 1].amount;
      amount = amount + this.auction.minBidIncrement;
    }
    return amount;
  }

  computeTimeLeft(): string {

    if (this.auction == null) {
      return;
    }

    const timeLeft: string = this.helperService.computeTimeLeft(this.auction.endDateTime);
    if (timeLeft === '0') {
      return 'Auction has ended';
    }
    return timeLeft;
  }

  isAuctionActive(): boolean {
    return this.hasAuctionStarted() && !this.hasAuctionEnded();
  }

  hasAuctionStarted(): boolean {
    return (new Date().valueOf() > this.auction.startDateTime.valueOf());
  }

  hasAuctionEnded(): boolean {
    return (new Date().valueOf() > this.auction.endDateTime.valueOf());
  }


  getCurrencyString(): string {
    return CURRENCY_STRING;
  }

  onContainerClick(): void {
    this.router.navigate(['/auctions/' + this.auction.id]);
  }

  onFocusInBid(): void {
    this.isFocusBid = true;
  }

  onFocusOutBid(): void {
    this.isFocusBid = false;
  }
}
