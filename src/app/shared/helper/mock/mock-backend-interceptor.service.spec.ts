import {TestBed} from '@angular/core/testing';

import {MockBackendInterceptor} from './mock-backend-interceptor.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpHeaders} from '@angular/common/http';
import {Auction} from '../../../auction/shared/auction';
import {decodeToken, Jwt} from '../helper.jwt';
import {environment} from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  }),
  observe: 'response' as 'response'
};

const httpOptionsJwtToken = {
  headers: null,
  observe: 'response' as 'response'
};

const httpOptionsExpiredJwtToken = {
  headers: null,
  observe: 'response' as 'response'
};

const httpOptionsInvalidJwtToken = {
  headers: null,
  observe: 'response' as 'response'
};

class User {
  id?: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  thresholdOpenPayment?: number;
  locked?: boolean;
  token?: string;
  refreshToken?: string;
  expires?: number;
}

const postUser: User = {
  firstName: 'post',
  lastName: 'post',
  username: 'post',
  password: 'post',
  email: 'post' + '@mail.com',
  thresholdOpenPayment: 1000,
  locked: false,
  token: null,
  refreshToken: null,
  expires: null
};

const regUserId = 0;
let postUserId = 0;
const adminUserId = 0;

const regUser: User = {
  id: 0,
  firstName: 'default',
  lastName: 'default',
  username: 'default',
  password: 'default',
  email: 'default1' + '@mail.com',
  thresholdOpenPayment: 1000,
  locked: false,
  token: null,
  refreshToken: null,
  expires: null
};

const adminRegUser: User = {
  id: 0,
  firstName: 'admin',
  lastName: 'admin',
  username: 'admin',
  password: 'admin',
  email: 'admin' + '@mail.com',
  thresholdOpenPayment: 1000,
  locked: false,
  token: null,
  refreshToken: null,
  expires: null
};


const loginUser: User = {
  username: 'default',
  password: 'default'
};

const loginUserRefresh = {
  username: 'default',
  refreshToken: 'default'
};


const loginAdminUser: User = {
  username: 'admin',
  password: 'admin'
};

const unknowLoginUser: User = {
  username: 'unknown',
  password: 'default'
};

const wrongPasswordLoginUser: User = {
  username: 'default',
  password: 'unknown'
};

const expiredRsa256Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.cJF7Z_4dbFkHdbx-2TogMqppa3MoLzjj7O0XOyl7ZMDSZDiyRvSZhwKOT40gdYO1iW65ZYnpeumEcCrYM_KnfMV3i9d9LOPBDYakerpA-lHD_tfaB2rNWFgjjtg1IhvI-_1tSYfTjosPB2KB110t3Jz_iTSAFV8AxM02UubddDo';


describe('MockBackendInterceptor', () => {

  let http: HttpTestingController;
  let httpClient: HttpClient;
  const authApiUrl: string = environment.endpoints.backendAuthUrl;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        }
      ]
    });
    http = testBed.inject(HttpTestingController);
    httpClient = testBed.inject(HttpClient);
  });

  it('should catch 401', (done) => {
    httpClient.get(`${authApiUrl}/error`, httpOptions)
      .subscribe((data) => {
        expect(data.status).toBe(401);
        done();
      }, (err) => {
        expect(err.status).toBe(401);
        // Perform test
        done();
      });

    http.expectOne(`${authApiUrl}/error`).error(new ErrorEvent('Unauthorized error'), {
      status: 401
    });
    http.verify();
  });

  it('should catch 401 at get users', (done) => {
    httpClient.get(`${authApiUrl}/users`, httpOptions)
      .subscribe((data) => {
        expect(data.status).toBe(401);
        done();
      }, (err) => {
        expect(err.status).toBe(401);
        done();
      });
  });

  it('should return an auction', (done) => {
    httpClient.get<Auction>(`${authApiUrl}/auctions/1`, httpOptions)
      .subscribe((data) => {
          const auction: Auction = data.body;
          const status: number = data.status;
          expect(status).toBe(200);
          expect(auction.id).toBe(1);
          done();
        },
        (err) => {
          fail();
          done();
        }, () => {
          done();
        });
  });

  it('should register a user', (done) => {
    httpClient.post<User>(`${authApiUrl}//users/register`, regUser, httpOptions)
      .subscribe((data) => {
          const user: User = data.body;
          const status: number = data.status;
          expect(status).toBe(200);
          expect(user.username).toEqual(regUser.username);
          done();
        },
        (err) => {
          done();
        }, () => {
          done();
        });
  });

  it('should not register an admin because already registered', (done) => {
    httpClient.post<User>(`${authApiUrl}//users/register`, adminRegUser, httpOptions)
      .subscribe((data) => {
          const status: number = data.status;
          expect(status).toBe(404);
          const user: User = data.body;
          done();
        },
        (err) => {
          // console.log('mockTestResponse', err);
          const status: number = err.status;
          expect(status).toBe(404);
          done();
        }, () => {
          done();
        });
  });

  it('should authenticate an admin', (done) => {
    httpClient.post<User>(`${authApiUrl}//users/authenticate`, loginAdminUser, httpOptions)
      .subscribe((data) => {
          const bearerToken = data.headers.get('Authorization');
          if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
            const jwtToken = bearerToken.slice(7, bearerToken.length);
            const token = decodeToken(jwtToken);
            if (token instanceof Jwt) {
              expect(token.body.sub).toEqual(loginAdminUser.username);
              httpOptionsJwtToken.headers = new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
              });
            } else { fail(); }
          } else { fail(); }
          const user: User = data.body;
          const status: number = data.status;
          expect(status).toBe(200);
          expect(user.username).toEqual(loginAdminUser.username);
          done();
        },
        (err) => {
          fail();
          done();
        }, () => {
          done();
        });
  });

  it('should not authenticate an unknown user', (done) => {
    httpClient.post<User>(`${authApiUrl}//users/authenticate`, unknowLoginUser, httpOptions)
      .subscribe(data => {
          expect(data.status).toBe(401);

          done();
        },
        (err) => {
          expect(err.status).toBe(401);
          if (err.headers) {
            const bearerToken = err.headers.get('Authorization');
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
              fail();
            }
          }
          done();
        }, () => {
          done();
        });
  });

  it('should not authenticate a user with wrong password', (done) => {
    httpClient.post<User>(`${authApiUrl}//users/authenticate`, wrongPasswordLoginUser, httpOptions)
      .subscribe((data) => {
          const status: number = data.status;
          expect(status).toBe(401);
          done();
        },
        (err) => {
          expect(err.status).toBe(401);
          if (err.headers) {
            const bearerToken = err.headers.get('Authorization');
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
              fail();
            }
          }
          done();
        }, () => {
          done();
        });
  });

  it('should get all users with valid token and role admin', (done) => {
    httpClient.get<User>(`${authApiUrl}/users`, httpOptionsJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(200);
          expect(data.body[0].id).toBeGreaterThan(0);
          done();
        },
        (err) => {
          fail();
          done();
        }, () => {
          done();
        });
  });

  it('should NOT get all users with an EXPIRED token and role admin with return 401', (done) => {
    httpOptionsExpiredJwtToken.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + expiredRsa256Token
    });

    httpClient.get<User>(`${authApiUrl}/users`, httpOptionsExpiredJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(401);
          done();
        },
        (err) => {
          expect(err.status).toBe(401);
          done();
        }, () => {
          done();
        });
  });

  it('should NOT get all users with an INVALID token and role admin with return 401', (done) => {
    let bearerToken = httpOptionsJwtToken.headers.get('Authorization');
    bearerToken = bearerToken.slice(0, -1) + '0';
    httpOptionsInvalidJwtToken.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + bearerToken
    });

    httpClient.get<User>(`${authApiUrl}/users`, httpOptionsInvalidJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(401);
          done();
        },
        (err) => {
          expect(err.status).toBe(401);
          done();
        }, () => {
          done();
        });
  });

  it('should create a postUser with valid token and role admin', (done) => {
    httpClient.post<User>(`${authApiUrl}/users`, postUser, httpOptionsJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(200);
          expect(data.body.id).toBeGreaterThan(0);
          postUserId = data.body.id;
          done();
        },
        (err) => {
          done();
        }, () => {
          done();
        });
  });

  it('should change a postUser with valid token and role admin', (done) => {
    postUser.firstName = 'changed';
    httpClient.put<User>(`${authApiUrl}/users/` + postUserId, postUser, httpOptionsJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(200);
          expect(data.body.id).toBeGreaterThan(0);
          expect(data.body.id).toBe(postUser.id);
          expect(data.body.firstName).toEqual('changed');
          done();
        },
        (err) => {
          done();
        }, () => {
          done();
        });
  });


  it('should delete the postUser with valid token and role admin', (done) => {
    httpClient.delete<User>(`${authApiUrl}/users/` + postUserId, httpOptionsJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(200);
          done();
        },
        (err) => {
          done();
          fail();
        }, () => {
          done();
        });
  });


  it('should authenticate a user', (done) => {
    httpClient.post<User>(`${authApiUrl}/users/authenticate`, loginUser, httpOptions)
      .subscribe((data) => {
          const bearerToken = data.headers.get('Authorization');
          if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
            const jwtToken = bearerToken.slice(7, bearerToken.length);
            const token = decodeToken(jwtToken);
            if (token instanceof Jwt) {
              expect(token.body.sub).toEqual(loginUser.username);
              httpOptionsJwtToken.headers = new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
              });
              loginUserRefresh.refreshToken = data.body.refreshToken;
            } else { fail(); }
          } else { fail(); }
          const user: User = data.body;
          const status: number = data.status;
          expect(status).toBe(200);
          expect(user.username).toEqual(loginUser.username);
          done();
        },
        (err) => {
          fail();
          done();
        }, () => {
          done();
        });

  });

  it('should NOT get all users with valid token and role user with return 403 forbidden', (done) => {
    httpClient.get<User>(`${authApiUrl}/users`, httpOptionsJwtToken)
      .subscribe((data) => {
          expect(data.status).toBe(403);
          done();
        },
        (err) => {
          expect(err.status).toBe(403);
          done();
        }, () => {
          done();
        });
  });

  it('should send a refresh token', (done) => {
    httpClient.post<User>(`${authApiUrl}/users/refresh_token`, loginUserRefresh, httpOptionsJwtToken)
      .subscribe((data) => {
          const bearerToken = data.headers.get('Authorization');
          if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
            const jwtToken = bearerToken.slice(7, bearerToken.length);
            const token = decodeToken(jwtToken);
            if (token instanceof Jwt) {
              expect(token.body.sub).toEqual(loginUser.username);
              httpOptionsJwtToken.headers = new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken
              });
              const refreshToken = decodeToken(data.body.refreshToken);
              if (refreshToken instanceof Jwt) {
                expect(refreshToken.body.sub).toEqual(loginUser.username);
              } else { fail(); }
              loginUserRefresh.refreshToken = data.body.refreshToken;

            } else { fail(); }
          } else { fail(); }
          const user: User = data.body;
          const status: number = data.status;
          expect(status).toBe(200);
          expect(user.username).toEqual(loginUser.username);
          done();
        },
        (err) => {
          expect(err.status).toBe(200);
          done();
        }, () => {
          done();
        });
  });

});
