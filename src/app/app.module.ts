import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularDateHttpInterceptorService, MockModule } from './shared/helper';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import {AlertModule} from './shared/component/alert/alert.module';
import { AlertTestComponent } from './shared/component/alert-test/alert-test.component';
import { LoginComponent } from './component/login/login.component';

// import/use mock module only if configured (mock module will not be included in prod build!):
const mockModule = environment.useMockBackend ? [MockModule] : [];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AlertTestComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AlertModule,
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
