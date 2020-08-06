import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';


describe('UserService', () => {
  let service: UserService;
  let httpMock;
  let expectedResult;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ]
    });
    expectedResult = {};
    service = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should call correct URL', () => {
    const userName = 'user';
    service.getByName(userName).subscribe(() => {});

    const req = httpMock.expectOne({ method: 'GET' });
    const resourceUrl = `${environment.endpoints.backendAuthUrl}/users/${userName}`;
    expect(req.request.url).toEqual(`${resourceUrl}`);
  });

  it('should return User', () => {
    const userName = 'user';
    service.getByName(userName).subscribe(received => {
      expectedResult = received;
    });

    const req = httpMock.expectOne({ method: 'GET' });
    const user = {
      firstName: userName,
      lastName: userName,
      username: userName,
      password: userName,
      email: userName + '@mail.com',
      thresholdOpenPayment: 1000,
      locked: false
    };
    req.flush(user);
    expect(expectedResult).toEqual(user);
  });

  it('should propagate not found response', () => {
    service.getByName('user').subscribe(null, (_error: any) => {
      expectedResult = _error.status;
    });

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush('Invalid request parameters', {
      status: 404,
      statusText: 'Bad Request'
    });
    expect(expectedResult).toEqual(404);
  });

});
