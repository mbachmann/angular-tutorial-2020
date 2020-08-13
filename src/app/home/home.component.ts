import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/service/authentication.service';
import {Subscription} from 'rxjs';
import {User} from '../shared/model/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private authenticationSubscription: Subscription;
  user: User;
  userName: string;
  isLoggedIn: boolean;

  constructor(private authenticationService: AuthenticationService) { }


  ngOnInit(): void {
    this.authenticationSubscription = this.authenticationService.currentUser
      .subscribe(user => {

        if (user) {
          this.user = user;
          this.userName = user.username;
          this.isLoggedIn = user.isLoggedIn();
        }

      });
  }
  ngOnDestroy(): void {
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }

  }

}
