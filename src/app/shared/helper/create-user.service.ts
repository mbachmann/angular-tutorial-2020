import {first} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../service/user.service';

@Injectable({providedIn: 'root'})
export class CreateUserService {

  constructor(
    // private router: Router,
    private userService: UserService
  ) {
  }

  private registerUser(user: User): void {

    this.userService.register(user)
      .pipe(first())
      .subscribe(
        data => {},
        error => {}
      );
  }

  checkAndRegisterUser(userName): void {

    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user: User = users.find(x => x.username === userName );
    if (users.length === 0 || !user) {
      // user not yet in localStorage
      user = {
        firstName: userName,
        lastName: userName,
        username: userName,
        password: userName,
        email: userName + '@mail.com',
        thresholdOpenPayment: 1000,
        locked: false,
        token: null,
        refreshToken: null,
        expires: null
      };
      this.registerUser(user);
    }
  }

  /**
   * Creates default users for test purposes
   * Used only in development environment
   */
  createDefaultUsers(): void {
    this.checkAndRegisterUser('admin');
    this.checkAndRegisterUser('user');
  }

}
