import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuctionDataService} from '../shared/auction-data.service';
import {Subscription} from 'rxjs';
import {Auction} from "../shared/auction";

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit, OnDestroy {

  auction: Auction;
  private routeSubscription: Subscription;
  private subscription: Subscription;

  constructor(private auctionDataService: AuctionDataService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      console.log(params['id']);
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

  ngOnDestroy() {

    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }

    if (this.subscription != null)  {
      this.subscription.unsubscribe();
    }
  }

  onContainerClick() {
    this.router.navigate(['/auctions/' + this.auction.id]);
  }
}
