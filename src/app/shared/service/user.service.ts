import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {UserLocation} from '../model/user-location';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }),
    observe: 'response' as 'response'
  };

  private authApiUrl: string;
  constructor(private http: HttpClient) {
    this.authApiUrl = environment.endpoints.backendAuthUrl;
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.authApiUrl}/users/${id}`);
  }

  getByName(name: string): Observable<any> {
    return this.http.get<User>(`${this.authApiUrl}/users/${name}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authApiUrl}/users`);
  }

  register(user: User): Observable<any> {

    return this.http.post<Partial<User>>(`${this.authApiUrl}/users/register`, user, this.httpOptions);
  }

  getUserLocation(): Observable<UserLocation> {

    return this.http.get<UserLocation>('https://ipapi.co/json', this.httpOptions)
      .pipe(map(data => {
        // console.log(response);
        const userLocation: UserLocation = {
          countryCode: data.body['country_code'],
          iso3CountryCode: data.body['country_code_iso3'],
          countryName: data.body['country_name'],
          currency: data.body['currency'],
          countryCallingCode: data.body['country_calling_code'],
          countryLanguages: data.body['languages'],
          browserLanguage: navigator.language
        };
        return userLocation;

      }));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`this.authApiUrl/users/${id}`);
  }
}
