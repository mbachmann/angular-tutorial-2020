import { TestBed } from '@angular/core/testing';

import { MockBackendInterceptor } from './mock-backend-interceptor.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('MockBackendInterceptor', () => {

  let service: MockBackendInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        MockBackendInterceptor
      ]

    });
    service = TestBed.get(MockBackendInterceptor);
  });

  it('should be created', () => {
    const service: MockBackendInterceptor = TestBed.get(MockBackendInterceptor);
    expect(service).toBeTruthy();
  });
});
