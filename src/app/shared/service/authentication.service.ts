import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {JwtTokenService} from './jwt-token.service';
import {BrowserStorageService} from './browser-storage.service';
import {init} from '../helper/util';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private authApiUrl: string;
  private refreshTokenTimeout;

  constructor(
    private browserStorageService: BrowserStorageService,
    private http: HttpClient,
    private router: Router,
    private tokenService: JwtTokenService
  ) {
    this.authApiUrl = environment.endpoints.backendAuthUrl;

    // Check localstore or sessionstore
    if (!browserStorageService.getItem('currentUser'))  {
      browserStorageService.rememberMe = true;
    }
    const user: User = init(User, JSON.parse(browserStorageService.getItem('currentUser')));
    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, rememberMe = true): Observable<any> {

    const data = {
      username: username,
      password: password
    };
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    return this.http.post<any>(`${this.authApiUrl}/users/authenticate`, data, httpOptions)
      .pipe(
        map(response => {
        const user = response.body;
        if (this.tokenService.verifyToken(user.token, user.publicKey)) {
          this.browserStorageService.rememberMe = rememberMe;
          return this.saveUser(user);
        }
      }),
        retry(2)
    );
  }


  logout(): void {
    // remove user from local storage and set current user to null
    this.browserStorageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/login']); // is needed after we have a login dialog
  }

  getBasicAuthHeader(username: string, password: string): string {
    return `Basic ${btoa(username + ':' + password)}`;
  }

  refreshToken(): Observable<User> {

    const jwtToken = this.currentUserSubject.value.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken
      }), observe: 'response' as 'response'
    };

    const data = {
      username: this.currentUserValue.username,
      refreshToken: this.currentUserValue.refreshToken
    };

    return this.http.post<any>(`$${this.authApiUrl}/users/refresh_token`, data, httpOptions)
      .pipe(map(response => {
        console.log(response);
        const user = response.body;
        if (this.tokenService.verifyToken(user.token, user.publicKey)) {
          return this.saveUser(user);
        } else {
          console.log('refresh token not successful');
        }
      }));
  }

  private startRefreshTokenTimer(): void {

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(this.currentUserValue.expires * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // debug 59 minutes before (every minute a new token)
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  private saveUser(user: User): User {

    user.extractTokenInfo();
    this.browserStorageService.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.startRefreshTokenTimer();
    return user;
  }

}
