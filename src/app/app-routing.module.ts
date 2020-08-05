import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuctionListComponent} from './auction-list/auction-list.component';
import {AuctionDetailComponent} from './auction-detail/auction-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auctions'
  },
  {
    path: 'auctions',
    component: AuctionListComponent
  },
  {
    path: 'auctions/:id',
    component: AuctionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
