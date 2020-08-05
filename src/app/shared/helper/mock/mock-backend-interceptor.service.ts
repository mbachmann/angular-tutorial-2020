import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, of, Subscription, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize, first, tap} from 'rxjs/operators';
import {AUCTION_DATA} from '../../../auction/shared/auction-data';


@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(() => handleRoute()))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
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


    // route functions

    function authenticate() {
      const {username, password} = body;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) {
        return error('Username or password is incorrect');
      } else {
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token: 'fake-jwt-token'
        });
      }
    }

    function register() {
      const user = body;
      let users = JSON.parse(localStorage.getItem('users')) || [];
      console.log(users);
      if (users.find(x => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken')
      }
      console.log(user);
      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      console.log(user);
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok();
    }

    function getUsers() {
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

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({status: 200, body}))
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function notFound() {
      return throwError({status: 404, error: {message: 'Not found'}});
    }

    function noContent(message) {
      return throwError({status: 204, error: {message: message}});
    }


    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function nameFromUrl() {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    function isNumber(value: string | number): boolean
    {
      return ((value != null) && !isNaN(Number(value.toString())));
    }

  }
}

export const mockBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockBackendInterceptor,
  multi: true
};
