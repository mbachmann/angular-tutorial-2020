import {inject, TestBed} from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockBackendInterceptor } from '../helper/mock/mock-backend-interceptor.service';
import { CreateUserService } from '../helper/create-user.service';
import {decodeToken, Jwt, verifyToken} from '../helper/helper.jwt';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let singletonService: AuthenticationService;
  let userService: CreateUserService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', redirectTo: ''}]),
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

  it('Service injected via inject(...) and TestBed.inject(...) should be the same instance',
    inject([AuthenticationService], (injectService: AuthenticationService) => {
      expect(injectService).toBe(service);
    })
  );

  it('should authenticate an admin', (done) => {
    service.login('admin', 'admin').subscribe(
      (data) => {
        console.log('authenticateResponse', data, service.currentUserValue);
        expect(service.currentUserValue.username).toBe('admin');
        // use the same service for further tests
        singletonService = service;
        checkTheTokens();
        checkTheRoles(['admin', 'user']);
        checkCurrentUserStoreExist();
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

  it('should refresh a token', (done) => {
    const oldRefreshToken = singletonService.currentUserValue.refreshToken;
    singletonService.refreshToken().subscribe(
      (data) => {
        console.log('refreshTokenResponse', data, service.currentUserValue);
        expect(singletonService.currentUserValue.username).toBe('admin');
        const newRefreshToken = singletonService.currentUserValue.refreshToken;
        expect(newRefreshToken).not.toEqual(oldRefreshToken);
        checkTheTokens();
        checkTheRoles(['admin', 'user']);
        checkCurrentUserStoreExist();
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
    singletonService.logout();
    expect(singletonService.currentUserValue).toBeNull();
    checkCurrentUserStoreNotExist();
    done();
  });

  function checkCurrentUserStoreExist(): void {
     expect(localStorage.getItem('currentUser')).toBeTruthy();
  }

  function checkCurrentUserStoreNotExist(): void {
    expect(localStorage.getItem('currentUser')).toBeFalsy();
  }

  function checkTheTokens(): void {

    const refreshToken = decodeToken(singletonService.currentUserValue.refreshToken);
    if (refreshToken instanceof Jwt) {
      expect(verifyToken(singletonService.currentUserValue.refreshToken, singletonService.currentUserValue.publicKey)).toBeTrue();
      expect(refreshToken.body.sub).toEqual(singletonService.currentUserValue.username);
    }
    const token = decodeToken(singletonService.currentUserValue.token);
    if (token instanceof Jwt) {
      expect(verifyToken(singletonService.currentUserValue.token, singletonService.currentUserValue.publicKey)).toBeTrue();
      expect(token.body.sub).toEqual(singletonService.currentUserValue.username);
    }
  }

  function checkTheRoles(checkRoles: Array<string>): void {
    singletonService.currentUserValue.roles.forEach(role => {
      expect(checkRoles.includes(role)).toBeTrue();
    });
  }

});
