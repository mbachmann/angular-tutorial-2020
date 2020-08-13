import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './component/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'auctions',
    loadChildren: () => import('./auction/auction.module').then(m => m.AuctionModule)
  }, {
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
