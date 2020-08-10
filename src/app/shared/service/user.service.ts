import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class UserService {

  private authApiUrl: string;
  constructor(private http: HttpClient) {
    this.authApiUrl = environment.endpoints.backendAuthUrl;
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.authApiUrl}/users/${id}`);
  }

  getByName(name: string): Observable<User> {
    return this.http.get<User>(`${this.authApiUrl}/users/${name}`);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authApiUrl}/users`);
  }

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/users/register`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`this.authApiUrl/users/${id}`);
  }
}
