import { Component, OnInit } from '@angular/core';
import {AlertService} from '../alert/alert.service';

@Component({
  selector: 'app-alert-test',
  templateUrl: './alert-test.component.html',
  styleUrls: ['./alert-test.component.scss']
})
export class AlertTestComponent implements OnInit {
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  constructor(public alertService: AlertService) { }

  ngOnInit(): void {
  }

}
