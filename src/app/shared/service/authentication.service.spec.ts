import {TestBed} from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockBackendInterceptor } from '../helper/mock/mock-backend-interceptor.service';
import { CreateUserService } from '../helper/create-user.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: CreateUserService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,

      ],
      providers: [
        AuthenticationService,
        CreateUserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        }
      ]
    });
    service = TestBed.inject(AuthenticationService);
    userService = TestBed.inject(CreateUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create default',   (done) => {
    userService.createDefaultUsers();
    expect(userService).toBeTruthy();
    done();
  });

  it('should authenticate an admin', (done) => {
    service.login('admin','admin').subscribe(
      (data) => {
        console.log('authenticateResponse', data, service.currentUserValue);
        expect(service.currentUserValue.username).toBe('admin');
        done();
      },
    (err) => {
      console.log('authenticateResponse', err);
      fail();
      done();
    }, () => {
      // console.log('Test complete');
      done();
    });
  });

  it('should logout', (done) => {
    service.logout()
    expect(service.currentUserValue).toBeNull();
    done();
  });

});
