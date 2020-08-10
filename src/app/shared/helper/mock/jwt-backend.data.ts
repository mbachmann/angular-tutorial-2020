
import {IJwtHeader, IJwtStdPayload, createToken, verifyToken} from '../helper.jwt';
import {User} from '../../model/user';

const issuer  = 'ZHAW';
const subject  = 'Auction-App';
const audience  = 'ASE2';

export const sharedSecret = 'sharedsecret';

export const privateKey =
  `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAICVyX5OguWsNi8lxzDEtVbFLeuW5pmQVPKdOY3FPPTrofDeWYVy
bMT7/3fcyP+L/CH4T7z9suw4c4FBB2SOso8CAwEAAQJAbKinFdIYsSbevubItYB0
0PddP6lMAtbBwid0nEXhpgFKHpBW3xVn7wv1dmzya8O8t7KNhMI/529+ScJ1PLca
SQIhALpptXYzj/3b6sACfeFKbwooHMHPk3kdTrZymBmiz/azAiEAsJXX5jrnl4bF
GBUAyV8Fv0Yu+eFhA8IvdhiBzJD4orUCIQCQnsolNcOUUzVAWa6HRlP3MT9+LShg
Yhha+3R9Dw8AeQIhAK/EJseKoFTKF8q1tTe7dowCPuYIuTk1g2poUGKfdmz1AiBg
JhyKTosBk1OzKz5DWD6k11pA9qpAXcMmvpUUcduCVw==
-----END RSA PRIVATE KEY-----`;

export const publicKey =
  `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAICVyX5OguWsNi8lxzDEtVbFLeuW5pmQ
VPKdOY3FPPTrofDeWYVybMT7/3fcyP+L/CH4T7z9suw4c4FBB2SOso8CAwEAAQ==
-----END PUBLIC KEY-----`;


const hmacHeader: IJwtHeader = {
  typ: 'JWT',
  alg: 'HS256'
};

const rsaHeader: IJwtHeader = {
  typ: 'JWT',
  alg: 'RS256'
};


export function createRsaJwtToken(payLoad: IJwtStdPayload, claims): string {
  return createToken(rsaHeader, payLoad, claims, privateKey);
}

export function createHmacJwtToken(payLoad: IJwtStdPayload, claims): string {
  return createToken(hmacHeader, payLoad, claims, sharedSecret);
}


export function verifyRsaJwtToken(token: string): boolean {
  return verifyToken(token, publicKey);
}

export function verifyHmacJwtToken(token: string): boolean {
  return verifyToken(token, sharedSecret);
}

export function createTestToken(username: string): string {
  const roles: Array<string> = username === 'admin' ? ['admin', 'user'] : ['user'];
  const payLoad: IJwtStdPayload = {
    iat: 0,
    exp: createExpiresDateTime(),
    iss: '',
    aud: '',
    sub: username,
  };

  const claims = {
    roles: roles,
    accessToken: 'secretaccesstoken',
  };
  return createRsaJwtToken(payLoad, claims);
  // console.log (verifyRsaJwtToken(token));
  // return token;
}

export function createTestRefreshToken(username: string): string {
  const payLoad: IJwtStdPayload = {
    iat: 0,
    exp: createExpiresDateTime(),
    iss: '',
    aud: '',
    sub: username,
  };
  const claims = {
    accessToken: 'secretaccesstoken',
  };
  return createRsaJwtToken(payLoad, claims);
  // console.log (verifyRsaJwtToken(token));
  // return token;
}

export function nowEpochSeconds(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function createExpiresDateTime(): number {
  const exp = (nowEpochSeconds() + (60 * 60)) * 1000;
  return Math.floor(new Date(exp).getTime() / 1000);
}

export class MockUser {
  id?: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  thresholdOpenPayment?: number;
  locked?: boolean;
  tokens?: Array<string>;
  refreshTokens?: Array<string>;
  expires?: number;
}


export const mockAdminData: MockUser = {
  id: 1,
  firstName: 'admin',
  lastName: 'admin',
  username: 'admin',
  password: 'admin',
  email: 'admin' + '@mail.com',
  thresholdOpenPayment: 1000,
  locked: false,
  tokens: [createTestToken('admin')],
  refreshTokens: [createTestRefreshToken('admin')],
  expires: createExpiresDateTime()
};

export const mockUserData: MockUser = {
  id: 2,
  firstName: 'user',
  lastName: 'user',
  username: 'user',
  password: 'user',
  email: 'user' + '@mail.com',
  thresholdOpenPayment: 1000,
  locked: false,
  tokens: [createTestToken('user')],
  refreshTokens: [createTestRefreshToken('user')],
  expires: createExpiresDateTime()
};

export function createUser(mockUser: MockUser): User {
  const user = new User();
  user.id = mockUser.id;
  user.firstName = mockUser.firstName;
  user.lastName = mockUser.lastName;
  user.username = mockUser.username;
  user.password = mockUser.password;
  user.email = mockUser.email;
  user.thresholdOpenPayment = mockUser.thresholdOpenPayment;
  user.locked = mockUser.locked;
  if (mockUser.tokens) { user.token = mockUser.tokens[mockUser.tokens.length - 1]; }
  if (mockUser.refreshTokens) { user.refreshToken = mockUser.refreshTokens[mockUser.refreshTokens.length - 1]; }
  user.expires = mockUser.expires;
  return user;
}

export function createMockUser(user: User): MockUser {
  const mockUser = new MockUser();
  mockUser.id = user.id;
  mockUser.firstName = user.firstName;
  mockUser.lastName = user.lastName;
  mockUser.username = user.username;
  mockUser.password = user.password;
  mockUser.email = user.email;
  mockUser.thresholdOpenPayment = user.thresholdOpenPayment;
  mockUser.locked = user.locked;
  (user.token) ? mockUser.tokens.push(user.token) : mockUser.tokens = [];
  (user.refreshToken) ? mockUser.refreshTokens.push(user.refreshToken) : mockUser.refreshTokens = [];
  mockUser.expires = user.expires;
  return mockUser;
}
