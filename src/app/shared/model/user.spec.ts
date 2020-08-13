import { TestBed } from '@angular/core/testing';
import {
  createRsaJwtToken,
  createTestRefreshToken,
} from '../helper/mock/jwt-backend.data';
import {User} from './user';
import {IJwtStdPayload} from '../helper/helper.jwt';
import {nowEpochSeconds} from '../helper/util';


describe('UserModel', () => {
  let user: User;
  let futureAdminUser: User;
  let pastAdminUser: User;

  const testFutureAdmin: Partial<User> = {
    id: 1,
    firstName: 'admin',
    lastName: 'admin',
    username: 'admin',
    password: 'admin',
    email: 'admin' + '@mail.com',
    thresholdOpenPayment: 1000,
    locked: false,
    token: createInFutureTestToken('admin'),
    refreshToken: createTestRefreshToken('admin'),
    expires: createInFutureExpiresDateTime()
  };

  const testPastAdmin: Partial<User> = {
    id: 1,
    firstName: 'admin',
    lastName: 'admin',
    username: 'admin',
    password: 'admin',
    email: 'admin' + '@mail.com',
    thresholdOpenPayment: 1000,
    locked: false,
    token: createInPastTestToken('admin'),
    refreshToken: createTestRefreshToken('admin'),
    expires: createInPastExpiresDateTime()
  };

  function createInFutureExpiresDateTime(): number {
    const exp = (nowEpochSeconds() + (60 * 60)) * 1000;
    return Math.floor(new Date(exp).getTime() / 1000);
  }

  function createInFutureTestToken(username: string): string {
    const roles: Array<string> = username === 'admin' ? ['admin', 'user'] : ['user'];
    const payLoad: IJwtStdPayload = {
      iat: 0,
      exp: createInFutureExpiresDateTime(),
      iss: '',
      aud: '',
      sub: username,
    };

    const claims = {
      roles: roles,
      accessToken: 'secretaccesstoken',
    };
    return createRsaJwtToken(payLoad, claims);

  }

  function createInPastExpiresDateTime(): number {
    const exp = (nowEpochSeconds() - (60 * 60)) * 1000;
    return Math.floor(new Date(exp).getTime() / 1000);
  }
  function createInPastTestToken(username: string): string {
    const roles: Array<string> = username === 'admin' ? ['admin', 'user'] : ['user'];
    const payLoad: IJwtStdPayload = {
      iat: 0,
      exp: createInPastExpiresDateTime(),
      iss: '',
      aud: '',
      sub: username,
    };

    const claims = {
      roles: roles,
      accessToken: 'secretaccesstoken',
    };
    return createRsaJwtToken(payLoad, claims);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    user = new User();
    futureAdminUser = new User(testFutureAdmin);
    pastAdminUser = new User(testPastAdmin);
  });

  it('should be created', () => {
    expect(user).toBeTruthy();
    expect(futureAdminUser).toBeTruthy();
    expect(pastAdminUser).toBeTruthy();
  });

  it('The user with not expired token should be logged in', () => {
    expect(futureAdminUser.isLoggedIn()).toBeTrue();
  });

  it('The user with the expired token should be logged out', () => {
    expect(pastAdminUser.isLoggedIn()).toBeFalse();

  });

  it('The empty user should be logged out', () => {
    expect(user.isLoggedIn()).toBeFalse();
  });

  it('The paritals initialization is working', () => {
    expect(futureAdminUser.username).toEqual('admin');
    futureAdminUser.extractTokenInfo();
    expect(futureAdminUser.roles[0]).toEqual('admin');
    expect(futureAdminUser.roles[1]).toEqual('user');
  });

});


