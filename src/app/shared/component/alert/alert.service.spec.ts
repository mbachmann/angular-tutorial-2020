import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import {AlertType} from './alert.model';

describe('AlertService', () => {
  let service: AlertService;
  const options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create an info message', () => {
    service.onAlert()
      .subscribe(alert => {
        expect(alert.type).toBe(AlertType.Info);
        expect(alert.message).toEqual('Info Message');
        expect(alert.id).toEqual('default-alert');
        expect(alert.autoClose).toBe(options.autoClose);
        expect(alert.keepAfterRouteChange).toBe(options.keepAfterRouteChange);
      });

    service.info('Info Message', options);

  });

  it('clears all messages', () => {

    service.onAlert()
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          expect(alert.message).toBeFalsy();
        } else {
          expect(alert.message).toEqual('Success Message');
        }
    });

    service.success('Success Message', options);
    service.clear();

  });

});

