import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuctionListComponent} from './auction-list/auction-list.component';
import {AuctionDetailComponent} from './auction-detail/auction-detail.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'auctions',
    component: AuctionListComponent
  },
  {
    path: 'auctions/:id',
    component: AuctionDetailComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
