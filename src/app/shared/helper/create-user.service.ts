import {first} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {UserService} from '../service/user.service';

@Injectable({providedIn: 'root'})
export class CreateUserService {

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  private registerUser(user: User) {

    this.userService.register(user)
      .pipe(first())
      .subscribe(
        data => {},
        error => {}
      );
  }

  checkAndRegisterUser(userName) {

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user: User = users.find(x => x.username === userName );
    if (users.length === 0 || !user) {
      // user not yet in localStorage
      const user = {
        firstName: userName,
        lastName: userName,
        username: userName,
        password: userName,
        email: userName + '@mail.com',
        thresholdOpenPayment: 1000,
        locked: false
      };
      this.registerUser(user);
    }
  }

  /**
   * Creates default users for test purposes
   * Used only in development environment
   */
  createDefaultUsers() {
    this.checkAndRegisterUser('admin');
    this.checkAndRegisterUser('user');
  }

}
