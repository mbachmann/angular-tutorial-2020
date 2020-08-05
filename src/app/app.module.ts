import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularDateHttpInterceptorService } from './shared/helper/angular-date-http-interceptor.service';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { MockModule } from './shared/helper/mock/mock.module';

// import/use mock module only if configured (mock module will not be included in prod build!):
const mockModule = environment.useMockBackend ? [MockModule] : [];

@NgModule({
  declarations: [AppComponent, NavBarComponent, HomeComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ...mockModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AngularDateHttpInterceptorService,
      multi: true
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
