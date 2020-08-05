import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Auction} from '../shared/auction';
import {AUCTION_DATA} from '../shared/auction-data';
import {AuctionDataService} from '../shared/auction-data.service';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss']
})
export class AuctionListComponent implements OnInit {
  @Input() headerTitle: string;
  @Output() titleClicked = new EventEmitter<string>();

  auctions: Auction[];

  constructor(private auctionDataService: AuctionDataService) {
    this.auctions = auctionDataService.getAuctions();
  }

  ngOnInit(): void {
  }

  onTitleClicked(event: MouseEvent): void {
    this.titleClicked.emit('Title clicked');
  }
}
