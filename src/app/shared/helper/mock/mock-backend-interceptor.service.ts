import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, HttpHeaders
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize, tap} from 'rxjs/operators';
import {AUCTION_DATA} from '../../../auction/shared/auction-data';
import {createRsaJwtToken, verifyRsaJwtToken} from './jwt-backend.data';
import {decodeToken, IJwtStdPayload, Jwt} from '../helper.jwt';

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
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  /**
   * Overwritten method of HttpInterceptor
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(() => handleRoute()))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay
      .pipe(delay(500))
      .pipe(dematerialize())
      .pipe(tap({
        next: data => {
          console.log('mockResponse', data);
        },
        error: error => {
          console.log('mockResponse', JSON.stringify(error));
        },
        complete: () => console.log('mockResponse: on complete')
      }));

    /**
     * The handle route function is used to individually support the
     * different end points
     */
    function handleRoute() {
      console.log('mockRequest: ' + url, method, headers, body);
      let response: Observable<HttpEvent<any>>;


      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          response = authenticate();
          break;
        case url.endsWith('/users/register') && method === 'POST':
          response = register();
          break;
        case url.endsWith('/users') && method === 'GET':
          response = getUsers();
          break;

        case url.match(/(\/users[\/])/) && method === 'GET':
          if (isNumber(nameFromUrl())) response = getUser();
          else response = getUserByName();
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

    function authenticate() {
      const {username, password} = body;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Username or password is incorrect');
      } else {
        const token = createToken(user.username);
        let headers: HttpHeaders = new HttpHeaders();
        headers = addTokenToHeader(headers, token);
        headers = addAcceptToHeader(headers);
        headers = addContentTypeToHeader(headers);
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }, headers);
      }
    }

    function register() {
      const user = body;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      // console.log(users);
      if (users.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken')
      }
      console.log(user);
      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      console.log(user);
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok(user);
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      if (!isTokenExpired()) return expired();
      if (!isInRole('admin')) return notInRole();

      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    function getUser() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(x => x.id === idFromUrl());
      if (users.length > 0) {
        return ok(users[0]);
      } else {
        return noContent('User with id ' + idFromUrl() + ' not found.')
      }
    }

    function getUserByName() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(x => x.username === nameFromUrl());
      if (users.length > 0) {
        return ok(users[0]);
      } else {
        return noContent('User with name ' + nameFromUrl() + ' not found.')
      }
    }

    function getAuctions() {
      return ok(AUCTION_DATA);
    }

    function getAuction() {
      let auctions = AUCTION_DATA.filter(x => x.id === idFromUrl());
      if (auctions.length > 0) {
        return ok(auctions[0]);
      } else {
        return noContent('Auction item with id ' + idFromUrl() + ' not found.')
      }
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem('users', JSON.stringify(users));
      return ok();
    }
    function changeUser() {
      const user = body;
      if (!user.id) user.id = idFromUrl();
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(x => x.id === idFromUrl());
      if (users.length > 0) {
        // delete this user
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(x => x.id !== idFromUrl());
        // add changed user
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return ok(user);
      } else {
        return noContent('User with id ' + idFromUrl() + ' not found.')
      }
    }
    // helper functions

    function ok(body?, headers?: HttpHeaders) {
      const resp = new HttpResponse({body: body, headers: headers, status: 200});
      return of(new HttpResponse(resp));
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function expired() {
      return throwError({status: 401, error: {message: 'Unauthorised - Token expired'}});
    }

    function notInRole() {
      return throwError({status: 403, error: {message: 'Forbidden - not correct role'}});
    }

    function notFound() {
      return throwError({status: 404, error: {message: 'Not found'}});
    }

    function noContent(message) {
      return throwError({status: 204, error: {message: message}});
    }


    function isLoggedIn() {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        try {
          if (verifyRsaJwtToken(jwtToken)) return true;
        } catch (e) {
          if (e instanceof Error) {
            throwError({status: 401, error: {message: 'Unauthorised - Token invalid'}});
          }
        }
      }
      return (headers.get('Authorization') === 'Bearer fake-jwt-token')
    }

    function isTokenExpired() {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        const token = decodeToken(jwtToken);
        if (token instanceof Jwt) {
          if (token.body.exp >= nowEpochSeconds()) return true;
        }
      }
      return false;
    }

    function isInRole(role) {
      const bearerToken = headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        const token = decodeToken(jwtToken);
        if (token instanceof Jwt && token.body['roles']) {
          const roles: Array<string> = token.body['roles'];
          console.log('roles', roles, role);
          if (roles.indexOf(role) > -1) return true;
        }
      }
      return false;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function nameFromUrl() {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    function createToken(username: string) {
      const roles: Array<string> = username === 'admin' ? ['admin', 'user'] : ['user'];
      const payLoad: IJwtStdPayload = {
        iat: 0,
        exp: 0,
        iss: "",
        aud: "",
        sub: username,
      };

      const claims = {
        roles: roles,
        accessToken: 'secretaccesstoken',
      };
      const token = createRsaJwtToken(payLoad, claims);
      // console.log (verifyRsaJwtToken(token));
      return token;
    }

    function addTokenToHeader(headers: HttpHeaders, token: string): HttpHeaders {
      return addItemToHeader(headers, 'Authorization', `Bearer ${token}`);
    }

    function addContentTypeToHeader(headers: HttpHeaders): HttpHeaders {
      return addItemToHeader(headers, 'Content-Type', 'application/json');
    }

    function addAcceptToHeader(headers: HttpHeaders): HttpHeaders {
      return addItemToHeader(headers, 'Accept', 'application/json');
    }

    function addItemToHeader(headers: HttpHeaders, key: string, item: string): HttpHeaders {
      return headers.append(key, item);
    }

    function isNumber(value: string | number): boolean {
      return ((value != null) && !isNaN(Number(value.toString())));
    }

    function nowEpochSeconds() {
      return Math.floor(new Date().getTime() / 1000);
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
