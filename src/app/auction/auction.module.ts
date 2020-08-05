import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuctionRoutingModule} from './auction-routing.module';
import {AuctionListComponent} from './auction-list/auction-list.component';
import {AuctionListDetailComponent} from './auction-list-detail/auction-list-detail.component';
import {AuctionDetailComponent} from './auction-detail/auction-detail.component';
import {MouseEventDisplayComponent} from './mouse-event-display/mouse-event-display.component';
import {AuctionComponent} from './auction/auction.component';

@NgModule({
  imports: [
    CommonModule,
    AuctionRoutingModule
  ],
  declarations: [
    AuctionComponent,
    AuctionListComponent,
    MouseEventDisplayComponent,
    AuctionListDetailComponent,
    AuctionDetailComponent

  ],
  providers: []

})
export class AuctionModule {
}
