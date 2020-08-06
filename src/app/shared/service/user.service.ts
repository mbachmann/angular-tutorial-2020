import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';


@Injectable({providedIn: 'root'})
export class UserService {

  private authApiUrl: string;
  constructor(private http: HttpClient) {
    this.authApiUrl = environment.endpoints.backendAuthUrl
  }

  get(id: number) {
    return this.http.get<User>(`${this.authApiUrl}/users/${id}`);
  }

  getByName(name: string) {
    return this.http.get<User>(`${this.authApiUrl}/users/${name}`);
  }

  getAll() {
    return this.http.get<User[]>(`${this.authApiUrl}/users`);
  }

  register(user: User) {
    return this.http.post<any>(`${this.authApiUrl}/users/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`this.authApiUrl/users/${id}`);
  }
}
