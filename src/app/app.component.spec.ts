import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {AlertModule} from './shared/component/alert/alert.module';
import {AlertTestComponent} from './shared/component/alert-test/alert-test.component';
import {AlertService} from './shared/component/alert/alert.service';
import {BrowserModule} from '@angular/platform-browser';


describe('AppComponent', () => {
  let alertService: AlertService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          {path: 'login', redirectTo: ''},
          {path: 'register', redirectTo: ''},
          ]),
        AlertModule,
      ],
      declarations: [
        AppComponent,
        HomeComponent,
        NavBarComponent,
        AlertTestComponent,
      ],
      providers: [
        AlertService,
      ]
    }).compileComponents();
    alertService = TestBed.inject(AlertService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app works!'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  });

});
