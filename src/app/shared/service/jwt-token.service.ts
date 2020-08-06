import {Injectable} from '@angular/core';
import {createToken, decodeToken, verifyToken, IJwtHeader, IJwtStdPayload, Jwt, JwtParseError} from '../helper/helper.jwt';

export interface JWTClaims {
  roles: Array<string>;
  accessToken: string;
}


@Injectable({providedIn: 'root'})
// @ts-ignore
export class JwtTokenService {

  createToken(header: IJwtHeader, payload: IJwtStdPayload, claims: JWTClaims, signingKey: string): string {
    return createToken(header, payload, claims, signingKey);
  }

  decodeToken(token: string): Jwt | JwtParseError {
    return decodeToken(token);
  }

  verifyToken(token: string, key: string): boolean {
    return verifyToken(token, key);
  }
}
