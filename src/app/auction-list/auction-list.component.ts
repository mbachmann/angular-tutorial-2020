import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Auction} from '../shared/auction';
import {AUCTION_DATA} from '../shared/auction-data';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss']
})
export class AuctionListComponent implements OnInit {

  constructor() { }
  @Input() headerTitle: string;
  @Output() titleClicked = new EventEmitter<string>();
  ngOnInit(): void {
  }
  auctions: Auction[] = AUCTION_DATA;

  onTitleClicked(event: MouseEvent): void {
    this.titleClicked.emit('Title clicked');
  }
}
