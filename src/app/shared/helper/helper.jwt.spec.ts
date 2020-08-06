
import {createToken, verifyToken, IJwtHeader, IJwtStdPayload, JwtParseError, Jwt} from './helper.jwt';



const issuer  = 'ZHAW';
const subject  = 'Auction-App';
const audience  = 'ASE2';

const sharedTestSecret = 'sharedsecret';

const private512TestKey =
  `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAICVyX5OguWsNi8lxzDEtVbFLeuW5pmQVPKdOY3FPPTrofDeWYVy
bMT7/3fcyP+L/CH4T7z9suw4c4FBB2SOso8CAwEAAQJAbKinFdIYsSbevubItYB0
0PddP6lMAtbBwid0nEXhpgFKHpBW3xVn7wv1dmzya8O8t7KNhMI/529+ScJ1PLca
SQIhALpptXYzj/3b6sACfeFKbwooHMHPk3kdTrZymBmiz/azAiEAsJXX5jrnl4bF
GBUAyV8Fv0Yu+eFhA8IvdhiBzJD4orUCIQCQnsolNcOUUzVAWa6HRlP3MT9+LShg
Yhha+3R9Dw8AeQIhAK/EJseKoFTKF8q1tTe7dowCPuYIuTk1g2poUGKfdmz1AiBg
JhyKTosBk1OzKz5DWD6k11pA9qpAXcMmvpUUcduCVw==
-----END RSA PRIVATE KEY-----`;

const public512TestKey =
  `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAICVyX5OguWsNi8lxzDEtVbFLeuW5pmQ
VPKdOY3FPPTrofDeWYVybMT7/3fcyP+L/CH4T7z9suw4c4FBB2SOso8CAwEAAQ==
-----END PUBLIC KEY-----`;

const private1024TestKey =
  `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQCsXOj094/oLd8/89ArzH5+MJ5j8Pd1UX4+9LLURHILwcrwBAbi
0l9VohJ4IA04rsjkUqLpZSjGzikOhFwNNiBcJ1xQ9A9bgoVqYFvJpNcG0xRFeHoT
ZnX7jcBQAyrUKioI7OQ/pUnqtNfXlK7cVSi+80+Bvwaa2Hwhcg66xUzcqwIDAQAB
AoGBAIooMuZgJS5yznbhhGQHFwEpEVyEgqW7+5iU5V61ukBoRrVaVPasr5PhRDKb
Zl2f5BD3l/PCjQvFpi0ntO02DHrdXDlLzG89XPaCylyHJhOS1eohtcS19oRxtq78
jMQChZ/OxedCtmsUiT3yX2bl0pyvwzoDkwjNAfe4XLa4ZwfhAkEA8Yjo6LBaqxSC
ls0eP+xUSc5Jn9tRhGzYBNlhX6+duMcc1WwWHhvpekcqLj95feH9V7Yh4XQJ8Pw5
CLKdug65ewJBALavfeVwRO13qRLpOU62BetF+CTvzGpdkmRLCo6B/Ryi6/4FuNgk
QRp/RvrG7JHEDnGJuPSdAfmFtBwMJtf1CpECQQDVYaix+SsAvSvpYej5fCWy1oYA
rddEcIwfLJRz3kgut+lnOwgHLY2Es142YWlJpt8UIBmqfcNSnOEeJ/5kIyIFAkBA
7I9migbFCiC5Ss+GDKR/38b3gY15Q7XyFMU0rjfBBJmwFmKB1iiY/SDBoQ6UI0Qq
z5I+xMnd3smKqjrnxvsxAkEA2I3Xvzn2kuW6KmUYHthBJkFS4ufrVTlv7foFgjOY
J/BSWpYaEqCCTLhPTUzaEer5w9SvTbWF9UYcb4OLa2c5JQ==
-----END RSA PRIVATE KEY-----`;

const public1024TestKey =
  `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsXOj094/oLd8/89ArzH5+MJ5j
8Pd1UX4+9LLURHILwcrwBAbi0l9VohJ4IA04rsjkUqLpZSjGzikOhFwNNiBcJ1xQ
9A9bgoVqYFvJpNcG0xRFeHoTZnX7jcBQAyrUKioI7OQ/pUnqtNfXlK7cVSi+80+B
vwaa2Hwhcg66xUzcqwIDAQAB
-----END PUBLIC KEY-----`;


const hmac256Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "HS256"
};

const hmac384Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "HS384"
};

const hmac512Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "HS512"
};


const rsa256Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "RS256"
};

const rsa384Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "RS384"
};

const rsa512Header: IJwtHeader = {
  "typ": "JWT",
  "alg": "RS512"
};



const payLoad: IJwtStdPayload = {
  iat: 1568394275,
  exp: 1568397875,
  iss: issuer,
  aud: audience,
  sub: 'admin',
};

const smallPayLoad: IJwtStdPayload = {
  iat: 1568394275,
  exp: 1568397875,
  sub: 'a',
};

const roles: Array<string> = ['admin','user'];
const claims = {
  roles: roles,
  accessToken: 'secretaccesstoken',
};

const rsa256Token512key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.NrV6aPYIr0yffWIGuLWRUPUNcUAJ14aaUteYgjDj92kGlGatacud9sLGeesZVlbz_ftwmFvaC2EGw-issPKT3w';
const rsa256Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.cJF7Z_4dbFkHdbx-2TogMqppa3MoLzjj7O0XOyl7ZMDSZDiyRvSZhwKOT40gdYO1iW65ZYnpeumEcCrYM_KnfMV3i9d9LOPBDYakerpA-lHD_tfaB2rNWFgjjtg1IhvI-_1tSYfTjosPB2KB110t3Jz_iTSAFV8AxM02UubddDo';
const rsaSmallPayload256Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwic3ViIjoiYSJ9.DZXu8tq3b-H0RL5zAO9pjWe9b4k1tOeTYh4on_Y050UdPUDrlqs-Cv1oasB8R4gwece-PG3_NbF2vWTfuDn1aQEUXCneCaHACu821am6AHhBZMkM99hVyZozWAvw3ORl3YyW2ZOvTsD1ohhtANRBePDT60iWurHocQs-yKi9J54';

const rsa384Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzM4NCJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.UtwZwkwHunSP-OI-Pa0O9Mk4SAP32oPEd-uSWadpDA8JN3m99azOwjdRKEA5t073nkEwj8aogG0Zgb4qi7VvLalzsX7fKtu5I0SncLCIVq4aATd-u4l-Tfs3lfcESEwJ3dJgZ1dFWDFsfxWNxmBhVHPeeRKZglg-3pLkYgv6-VQ';
const rsa512Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.U-pVG60rIETwAIbwU3kHtq4bJzqsxpIrEhhgpnd8eOVjOnj6PyjDpP2pUn6G7-QdmjQ1aQq2qafXmIvDsCGcPIq8hT62kBMywi0uKnxmDOKX7iEvD-8KYVezEUs-gynIOJUe_ONLeAjwlWs5mMi0Wi4jSakz_JQ9Dl-V3rn5pas';

const hmac256Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.4LVHe-BndqFFe6hTm-DH6K8KHZtE9tH67iEOpk81gaw';
const hmac384Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.hdJ5z95tUb-NzeS_jKclAxoQV32Bb8x8KRAGKh-RJviOIr2o35-88bk0Aed1DMSS';
const hmac512Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1NjgzOTQyNzUsImV4cCI6MTU2ODM5Nzg3NSwiaXNzIjoiWkhBVyIsImF1ZCI6IkFTRTIiLCJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJhY2Nlc3NUb2tlbiI6InNlY3JldGFjY2Vzc3Rva2VuIn0.EiIsWGjsTSpxtD0CBhQy4PxRr2ZcCkdVXR7OaV6-8dZp0jDBdjFxlwVFJ-X4hhZ8fcnb4L3LL1dR5-OCPEXJBA';


function createRsaJwtToken(header: IJwtHeader, payLoad: IJwtStdPayload, claims): string {
  return createToken(header, payLoad, claims, private1024TestKey, false);
}

function createHmacJwtToken(header: IJwtHeader, payLoad: IJwtStdPayload, claims): string {
  return createToken(header, payLoad, claims, sharedTestSecret, false);
}

function verifyRsaJwtToken(token: string): boolean {
  return verifyToken(token, public1024TestKey);
}

export function verifyHmacJwtToken(token: string): boolean {
  return verifyToken(token, sharedTestSecret);
}


describe('Helper JWT', () => {
  // beforeEach(() => TestBed.configureTestingModule({}));

  it('RSA256 token with key 512 should be created', () => {
    const token = createToken(rsa256Header, payLoad, claims, private512TestKey, false);
    expect(token).toEqual(rsa256Token512key);
  });

  it('RSA256 token should be created', () => {
    const token = createRsaJwtToken(rsa256Header, payLoad, claims);
    expect(token).toEqual(rsa256Token);
  });

  it('RSA256 token with small payload should be created', () => {
    const token = createRsaJwtToken(rsa256Header, smallPayLoad, null);
    expect(token).toEqual(rsaSmallPayload256Token);
  });

  it('RSA384 token should be created', () => {
    const token = createRsaJwtToken(rsa384Header, payLoad, claims);
    expect(token).toEqual(rsa384Token);
  });

  it('RSA512 token should be created', () => {
    const token = createRsaJwtToken(rsa512Header, payLoad, claims);
    expect(token).toEqual(rsa512Token);
  });

  it('HMAC256 token should be created', () => {
    const token = createHmacJwtToken(hmac256Header, payLoad, claims);
    expect(token).toEqual(hmac256Token);
  });

  it('HMAC384 token should be created', () => {
    const token = createHmacJwtToken(hmac384Header, payLoad, claims);
    expect(token).toEqual(hmac384Token);
  });

  it('HMAC512 token should be created', () => {
    const token = createHmacJwtToken(hmac512Header, payLoad, claims);
    expect(token).toEqual(hmac512Token);
  });

  it('RSA256 token with key 512 should be verified', () => {
    const result = verifyToken(rsa256Token512key, public512TestKey);
    expect(result).toBe(true);
  });


  it('RSA256 token should be verified', () => {
    const result = verifyRsaJwtToken(rsa256Token);
    expect(result).toBe(true);
  });

  it('RSA256 token with small payload should be verified', () => {
    const result = verifyRsaJwtToken(rsaSmallPayload256Token);
    expect(result).toBe(true);
  });

  it('RSA384 token should be verified', () => {
    const result = verifyRsaJwtToken(rsa384Token);
    expect(result).toBe(true);
  });

  it('RSA512 token should be verified', () => {
    const result = verifyRsaJwtToken(rsa512Token);
    expect(result).toBe(true);
  });

  it('HMAC256 token should be verified', () => {
    const result = verifyHmacJwtToken(hmac256Token);
    expect(result).toBe(true);
  });

  it('HMAC384 token should be verified', () => {
    const result = verifyHmacJwtToken(hmac384Token);
    expect(result).toBe(true);
  });

  it('HMAC512 token should be verified', () => {
    const result = verifyHmacJwtToken(hmac512Token);
    expect(result).toBe(true);
  });

  it('HMAC512 token should not be verified', () => {
    const result = verifyHmacJwtToken(hmac512Token + 't');
    expect(result).toBe(false);
  });

});
