import {Component, Input, OnInit} from '@angular/core';
import {Auction} from '../shared/auction';
import {CURRENCY_STRING} from '../../app.constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auction-list-detail',
  templateUrl: './auction-list-detail.component.html',
  styleUrls: ['./auction-list-detail.component.scss']
})
export class AuctionListDetailComponent implements OnInit {
  @Input() auction: Auction;
  constructor(private router: Router) { }

  onContainerClick(): void {
    this.router.navigate(['/auctions/' + this.auction.id]);
  }
  ngOnInit(): void {
  }

  getLocalDate(date: Date): string {
     // let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     return (date.toLocaleString(undefined, { hour12: false }));
  }

  getAmount(): number {
    let amount: number = this.auction.startingPrice;
    if (this.auction.bids.length > 0) {
      amount = this.auction.bids[this.auction.bids.length - 1].amount;
    }
    return amount;
  }

  getCurrencyString(): string {
    return CURRENCY_STRING;
  }
}
