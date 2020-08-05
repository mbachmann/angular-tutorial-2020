import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { MouseEventDisplayComponent } from './mouse-event-display/mouse-event-display.component';
import { AuctionDataService } from './shared/auction-data.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuctionListDetailComponent } from './auction-list-detail/auction-list-detail.component';
import {AngularDateHttpInterceptorService} from './shared/angular-date-http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    AuctionListComponent,
    MouseEventDisplayComponent,
    AuctionListDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AngularDateHttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
