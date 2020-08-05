import { TestBed } from '@angular/core/testing';

import { AngularDateHttpInterceptorService } from './angular-date-http-interceptor.service';

describe('AngularDateHttpInterceptorService', () => {
  let service: AngularDateHttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDateHttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
