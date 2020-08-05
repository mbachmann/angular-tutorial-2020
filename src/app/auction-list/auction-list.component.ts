import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

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
  auctions = [
    {title: 'bike'},
    {title: 'iPhone'},
    {title: 'watch'},
    {title: 'table'},
    {title: 'boat'}
  ];
  onTitleClicked(event: MouseEvent): void {
    this.titleClicked.emit('Title clicked');
  }
}
