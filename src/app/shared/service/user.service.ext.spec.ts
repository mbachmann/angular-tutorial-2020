import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MockBackendInterceptor} from '../helper/mock/mock-backend-interceptor.service';
import {AuthenticationService} from './authentication.service';


describe('UserServiceExtended', () => {
  let service: UserService;
  let authenticationService: AuthenticationService;
  let expectedResult;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        UserService,
        AuthenticationService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        }
      ]
    });
    expectedResult = {};
    service = TestBed.inject(UserService);
    authenticationService = TestBed.inject(AuthenticationService);

  });


  it('should be created', () => {
    // const service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });


  it('should return user location', (done) => {
    service.getUserLocation().subscribe((userLocation) => {

        console.log(userLocation);
        expect(userLocation.browserLanguage).toEqual(navigator.language);
        console.log('getUserLocation=' + JSON.stringify(expectedResult));
        done();

      }, (err) => {
        // console.log > (err.status);
        expect(err.status).toBe(404);
        done();
      }
    );

  });

  it('should return an error 401 Unauthorised', (done) => {
    // const loginToken = getLoginToken();
    service.getByName('admin').subscribe((data) => {
        console.log(data);
        expect(data.username).toEqual('admin');
        fail();
        done();

      }, (err) => {
        console.log('getByName err=' + JSON.stringify(err));
        expect(err.status).toEqual(401);
        done();
      }
    );

  });

  function getLoginToken(): string {
    authenticationService.login('admin', 'admin').subscribe(
      (data) => {
        // console.log('authenticateResponse', data, service.currentUserValue);
        expect(authenticationService.currentUserValue.username).toBe('admin');
        return authenticationService.currentUserValue.token;
      }, (err) => {
        console.log('getByName err=' + JSON.stringify(err));
      }
    );
    return null;
  }
});

