import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, HttpHeaders, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize, tap} from 'rxjs/operators';
import {AUCTION_DATA} from '../../../auction/shared/auction-data';
import {
  createMockUser,
  createTestRefreshToken,
  createTestToken, createUser, mockAdminData, MockUser, mockUserData,
  publicKey,
  verifyRsaJwtToken
} from './jwt-backend.data';
import {decodeToken, Jwt} from '../helper.jwt';
import {User} from '../../model/user';
import {nowEpochSeconds} from '../util';
import {environment} from '../../../../environments/environment';

/**
 * The mock backend interceptor is used to simulate a backend. The interceptor allows
 * to write individual route functions in order to support all different http verbs (GET, POST, PUT, GET)
 * The interceptor simulated a backend delay of 500ms. The traffic to the interceptor
 * is visible in the console of the browser.
 *
 * At the end of this file you will find a method mockBackendProvider which can be used in the module provider
 * to activate the interceptor
 *
 * Based on: https://jasonwatmore.com/post/2019/05/02/angular-7-mock-backend-example-for-backendless-development
 *
 */

// array in local storage for users
const usersKey = 'users';
// const users = JSON.parse(localStorage.getItem(usersKey)) || [];

const usersData = [];
usersData.push(mockAdminData);
usersData.push(mockUserData);
localStorage.setItem(usersKey, JSON.stringify(usersData));


@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  /**
   * Overwritten method of HttpInterceptor
   * @param request the HttpRequest
   * @param next the next Handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    if (url.startsWith('http') && !url.startsWith(environment.endpoints.backendBaseUrl)) {
      console.log('call external=' + url);
      return next.handle(request);
    }
    // wrap in delayed observable to simulate server api call
    return of(null)

      .pipe(mergeMap(() => handleRoute()))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay
      .pipe(delay(100))
      .pipe(dematerialize())
      .pipe(tap({
        next: data => {
          console.log('mockResponse', data);
        },
        error: err => {
          console.log('mockResponseError', JSON.stringify(err));
        },
        // complete: () => console.log('mockResponse: on complete')
      }));

    /**
     * The handle route function is used to individually support the
     * different end points
     */
    function handleRoute(): Observable<HttpEvent<any>> {
      console.log('mockRequest: ' + url, method, headers, body);
      let response: Observable<HttpEvent<any>>;


      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          response = authenticate();
          break;

        case url.endsWith('/users/register') && method === 'POST':
          response = register();
          break;

        case url.endsWith('/users/refresh_token') && method === 'POST':
          response = refreshTheToken();
          break;

        case url.endsWith('/users') && method === 'GET':
          response = getUsers();
          break;

        case url.match(/(\/users[\/])/) && method === 'GET':
          if (isNumber(nameFromUrl())) {
            response = getUser();
          }
          else {
            response = getUserByName();
          }
          break;

        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          response = deleteUser();
          break;

        case url.endsWith('/users') && method === 'POST':
          response = register();
          break;

        case url.match(/\/users\/\d+$/) && method === 'PUT':
          response = changeUser();
          break;

        case url.match(/\/auctions\/\d+$/) && method === 'GET':
          response = getAuction();
          break;

        case url.endsWith('/auctions') && method === 'GET':
          response = getAuctions();
          break;

        default:
          // pass through any requests not handled above
          response = next.handle(request);
      }

      return response;
    }

    // --- route functions ---

    function authenticate(): Observable<HttpResponse<unknown>> {
      const {username, password} = body;
      const mockUsers: Array<MockUser> = JSON.parse(localStorage.getItem(usersKey)) || [];
      const mockUser: MockUser = mockUsers.find(x => x.username === username && x.password === password);
      if (!mockUser) {
        return unauthorizedMessage('Username or password is incorrect');
      } else {
        mockUser.tokens.push(createTestToken(username));
        mockUser.refreshTokens.push(createTestRefreshToken(username));
        localStorage.setItem(usersKey, JSON.stringify(mockUsers));

        const user: User = createUser(mockUser);
        user.publicKey = publicKey;

        const responseHeader: HttpHeaders = createHeader( user.token);
        return ok(user, responseHeader);
      }
    }

    function register(): Observable<HttpResponse<unknown>> {
      const user = body;
      const mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];

      if (mockUsers.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }
      user.id = mockUsers.length ? Math.max(...mockUsers.map(x => x.id)) + 1 : 1;
      const mockUser: MockUser = createMockUser(user);
      mockUsers.push(mockUser);
      localStorage.setItem(usersKey, JSON.stringify(mockUsers));

      const responseHeaders = createResisterHeader();
      // const responseHeaders: HttpHeaders = createHeader( 'ok');
      return ok(user, responseHeaders);
    }

    function refreshTheToken(): Observable<HttpResponse<unknown>> {
      if (!isLoggedIn()) { return unauthorized(); }
      if (!isTokenExpired()) { return expired(); }

      const {username, refreshToken} = body;
      if (!isRefreshTokenExpired(refreshToken)) { return expired(); }

      const mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      const mockUser: MockUser = mockUsers.find(x => x.username === username);

      if (!mockUser) {
        return error(`Username ${mockUser} not found`);
      } else {
        const refreshTok = mockUser.refreshTokens.find(x => x === refreshToken);

        if (!refreshTok) {
          return error('refreshToken not found');
        } else {
          mockUser.tokens.push(createTestToken(username));
          mockUser.refreshTokens.push(createTestRefreshToken(username));
          localStorage.setItem(usersKey, JSON.stringify(mockUsers));

          const user: User = createUser(mockUser);
          user.publicKey = publicKey;

          const responseHeader: HttpHeaders  = createHeader(user.token);
          JSON.stringify(responseHeader);
          return ok(user, responseHeader);
        }
      }
    }

    function getUsers(): Observable<HttpResponse<unknown>> {
      if (!isLoggedIn()) { return unauthorized(); }
      if (!isTokenExpired()) { return expired(); }
      if (!isInRole('admin')) { return notInRole(); }

      const mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      if (!isLoggedIn()) { return unauthorized(); }

      const users = [];
      mockUsers.forEach(mockUser => users.push(createUser(mockUser)));
      return ok(users);
    }

    function getUser(): Observable<HttpResponse<unknown>> {
      if (!isLoggedIn()) { return unauthorized(); }
      let mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      mockUsers = mockUsers.filter(x => x.id === idFromUrl());
      if (mockUsers.length > 0) {
        return ok(createUser(mockUsers[0]));
      } else {
        return noContent('User with id ' + idFromUrl() + ' not found.');
      }
    }

    function getUserByName(): Observable<HttpResponse<unknown>> {
      if (!isLoggedIn()) { return unauthorized(); }
      let mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      mockUsers = mockUsers.filter(x => x.username === nameFromUrl());
      if (mockUsers.length > 0) {
        return ok(createUser(mockUsers[0]));
      } else {
        return noContent('User with name ' + nameFromUrl() + ' not found.');
      }
    }

    function deleteUser(): Observable<HttpResponse<unknown>>  {
      if (!isLoggedIn()) { return unauthorized(); }
      let mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      mockUsers = mockUsers.filter(x => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(mockUsers));
      return ok();
    }

    function changeUser(): Observable<HttpResponse<unknown>> {
      if (!isLoggedIn()) { return unauthorized(); }
      const user = body;
      if (!user.id) { user.id = idFromUrl(); }
      let mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
      mockUsers = mockUsers.filter(x => x.id === idFromUrl());
      if (mockUsers.length > 0) {
        // delete this user
        mockUsers = JSON.parse(localStorage.getItem(usersKey)) || [];
        mockUsers = mockUsers.filter(x => x.id !== idFromUrl());
        // add changed user
        mockUsers.push(user);
        localStorage.setItem(usersKey, JSON.stringify(mockUsers));
        return ok(user);
      } else {
        return noContent('User with id ' + idFromUrl() + ' not found.');
      }
    }

    function getAuctions(): Observable<HttpResponse<unknown>> {
      return ok(AUCTION_DATA);
    }

    function getAuction(): Observable<HttpResponse<unknown>> {
      const auctions = AUCTION_DATA.filter(x => x.id === idFromUrl());
      if (auctions.length > 0) {
        return ok(auctions[0]);
      } else {
        return noContent('Auction item with id ' + idFromUrl() + ' not found.');
      }
    }


    // helper functions

    function ok(httpBody?, httpHeaders?: HttpHeaders): Observable<HttpResponse<unknown>> {
      const resp = new HttpResponse({body: httpBody, headers: httpHeaders, status: 200});
      return of(new HttpResponse(resp));
    }

    function error(message): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 404, statusText: message, error: { message: message } });
    }

    function unauthorized(): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 401, statusText: 'Unauthorised', error: { message: 'Unauthorised' } });
    }

    function unauthorizedMessage(message: string): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 401, statusText: message, error: { message: message } });
    }


    function expired(): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 401, statusText: 'Unauthorised - Token expired', error: { message: 'Unauthorised - Token expired' } });
    }

    function notInRole(): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 403, statusText: 'Forbidden - not correct role', error: { message: 'Forbidden - not correct role' } });
    }

    function notFound(message): Observable<HttpResponse<unknown>> {
      return throwError({ headers: headers, status: 404, statusText: message, error: { message: message } });
    }

    function noContent(message): Observable<HttpResponse<unknown>> {
      const resp = new HttpResponse({body: message, headers: headers, status: 204});
      return of(new HttpResponse(resp));
    }


    function isLoggedIn(): boolean {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        try {
          if (verifyRsaJwtToken(jwtToken)) { return true; }
        } catch (e) {
          if (e instanceof Error) {
            throwError({status: 401, error: {message: 'Unauthorised - Token invalid'}});
          }
        }
      }
      return (headers.get('Authorization') === 'Bearer fake-jwt-token');
    }

    function isTokenExpired(): boolean {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        const token = decodeToken(jwtToken);
        if (token instanceof Jwt) {
          if (token.body.exp >= nowEpochSeconds()) { return true; }
        }
      }
      return false;
    }

    function isRefreshTokenExpired(refreshToken: string): boolean {
      const token = decodeToken(refreshToken);
      if (token instanceof Jwt) {
        if (token.body.exp >= nowEpochSeconds()) { return true; }
      }
      return false;
    }

    function isInRole(role): boolean {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        const token = decodeToken(jwtToken);
        if (token instanceof Jwt && token.body['roles']) {
          const roles: Array<string> = token.body['roles'];
          // console.log('roles', roles, role);
          if (roles.indexOf(role) > -1) { return true; }
        }
      }
      return false;
    }

    function idFromUrl(): number {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }

    function nameFromUrl(): string {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    function createHeader(token: string): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      });
    }

    function createResisterHeader(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '"application/json'
      });
    }


    function addTokenToHeader(httpHeaders: HttpHeaders, token: string): HttpHeaders {
      return addItemToHeader(httpHeaders, 'Authorization', `Bearer ${token}`);
    }

    function addContentTypeToHeader(httpHeaders: HttpHeaders): HttpHeaders {
      return addItemToHeader(httpHeaders, 'Content-Type', 'application/json');
    }

    function addAcceptToHeader(httpHeaders: HttpHeaders): HttpHeaders {
      return addItemToHeader(httpHeaders, 'Accept', 'application/json');
    }

    function addItemToHeader(httpHeaders: HttpHeaders, key: string, item: string): HttpHeaders {
      return httpHeaders.append(key, item);
    }

    function isNumber(value: string | number): boolean {
      return ((value != null) && !isNaN(Number(value.toString())));
    }

  }
}

/**
 * Put the method call to the provider section of your NgModule
 */
export const mockBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockBackendInterceptor,
  multi: true
};
