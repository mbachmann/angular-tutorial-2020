import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {JwtTokenService} from './jwt-token.service';
import {Jwt} from '../helper';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private authApiUrl: string;

  constructor(private http: HttpClient, private tokenService: JwtTokenService) {
    this.authApiUrl = environment.endpoints.backendAuthUrl;
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password): Observable<any> {
    const currentUserSubject = this.currentUserSubject;
    const tokenService = this.tokenService;

    const data = {
      username: username,
      password: password
    };
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    return this.http.post<any>(`${this.authApiUrl}/users/authenticate`, data, httpOptions)
      .pipe(map(authenticateSuccess.bind(this)));

    function authenticateSuccess(response) {
      console.log(response);
      const bearerToken = response.headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        storeToken(jwtToken, true);
      }
      saveUser(response);
      return response;
    }

    function saveUser(resp) {
      const user = resp.body;
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      currentUserSubject.next(user);
      return user;
    }

    function storeToken(jwtToken: string, rememberMe: boolean) {
      const jwt = tokenService.decodeToken(jwtToken);
      if (jwt instanceof Jwt) {
        if (rememberMe) {
          localStorage.setItem('authenticationToken', jwtToken);
          localStorage.setItem("expires_at", JSON.stringify(jwt.getExpiration()));
        } else {
          sessionStorage.setItem('authenticationToken', jwtToken);
          sessionStorage.setItem("expires_at", JSON.stringify(jwt.getExpiration()));
        }
      }
    }
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('expires_at');
    this.currentUserSubject.next(null);
  }

  getBasicAuthHeader(username: string, password: string) {
    return `Basic ${btoa(username + ':' + password)}`;
  }
}
