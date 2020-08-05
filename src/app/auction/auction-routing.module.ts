import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';
import { AuctionComponent } from './auction/auction.component';


export const routes: Routes = [{
  path: '',
  component: AuctionComponent,
  children: [{
    path: '',
    component: AuctionListComponent
  }, {
    path: ':id',
    component: AuctionDetailComponent
  }]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionRoutingModule {}
