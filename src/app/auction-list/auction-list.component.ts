import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss']
})
export class AuctionListComponent implements OnInit {

  constructor() { }
  @Input() headerTitle: string;
  ngOnInit(): void {
  }

}
