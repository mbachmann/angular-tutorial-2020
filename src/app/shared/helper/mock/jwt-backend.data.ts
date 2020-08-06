
import {IJwtHeader, IJwtStdPayload, createToken, verifyToken} from '../helper.jwt';

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
  "typ": "JWT",
  "alg": "HS256"
};

const rsaHeader: IJwtHeader = {
  "typ": "JWT",
  "alg": "RS256"
};


export function createRsaJwtToken(payLoad: IJwtStdPayload, claims) {
  return createToken(rsaHeader, payLoad, claims, privateKey);
}

export function createHmacJwtToken(payLoad: IJwtStdPayload, claims) {
  return createToken(hmacHeader, payLoad, claims, sharedSecret);
}


export function verifyRsaJwtToken(token: string) {
  return verifyToken(token, publicKey);
}

export function verifyHmacJwtToken(token: string) {
  return verifyToken(token, sharedSecret);
}
