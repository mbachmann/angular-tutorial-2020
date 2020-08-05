import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuctionDataService} from '../shared/auction-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  private routeSubscription: Subscription;

  constructor(private auctionDataService: AuctionDataService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      console.log(params['id']);

    });
  }

  ngOnDestroy() {

    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }
}
