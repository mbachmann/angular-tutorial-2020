import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuctionListComponent} from './auction-list/auction-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auctions'
  },
  {
    path: 'auctions',
    component: AuctionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
