import * as uuid from 'uuid';
import {Buffer} from 'buffer';
import * as forge from 'node-forge';
import {pki} from 'node-forge';
import * as CryptoJS from 'crypto-js';
import base64url, {Base64Url} from './base64url';

/**
 * Creates a signed JWT token
 *
 * @param header     the header information (type and algorithm
 * @param payload    the standard claims to jwt
 * @param claims     the project specific claims
 * @param signingKey private key or shared secret
 * @param enforceFields recreate the fields
 */
export function createToken(header: IJwtHeader, payload: IJwtStdPayload, claims: any, signingKey: string, enforceFields = true): string {
  const union = {...payload, ...claims};
  const jwt = new Jwt(header, union, enforceFields);
  jwt.setSigningKey(signingKey);
  return jwt.getSignedToken();
}

/**
 * Decodes a token based and returns a Jwt object. The signature is NOT verified.
 * @param token the Token
 */
export function decodeToken(token: string): Jwt | JwtParseError {
  return new JwtParser().parse(token);
}

/**
 * Verifies the token signature
 * @param token the Token
 * @param key the Public Key
 */
export function verifyToken(token: string, key: string): boolean {

  const jwt = new JwtParser().parse(token);
  if (jwt instanceof Jwt) {
    jwt.setPublicKey(key);
    return jwt.verifySignature();
  }
  return false;
}

/**
 * Encrypt a message with symemtric aes algorithm
 * @param message the message to encrypt
 * @param secret the secret
 */
export function encrypt(message: string, secret: string): string {
  return CryptoJS.AES.encrypt(message, secret).toString();
}

/**
 * Decrypt a message with symmetric aes algorithm
 * @param message the message to decrypt
 * @param secret the secret
 */
export function decrypt(message: string, secret: string): string {
  const bytes = CryptoJS.AES.decrypt(message, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generates a keypair with a public and a private key
 * @param bits 512, 1024, 2048
 *
 */
export function createKeyPair(bits: number): pki.rsa.KeyPair {
  return pki.rsa.generateKeyPair({bits: bits, e: 0x10001});
}

/**
 * Interface JwtHeader
 */
export interface IJwtHeader {
  typ: string;
  alg: string;
}

/**
 * Interface for the standard claims
 */
export interface IJwtStdPayload {
  iss?: string; // (issuer): Issuer of the JWT
  sub?: string; // (subject): Subject of the JWT (the user)
  aud?: string; // audience): Recipient for which the JWT is intended
  exp?: number; // (expiration time): Time after which the JWT expires
  nbf?: number; // (not before time): Time before which the JWT must not be accepted for processing
  iat?: number; // issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
  jti?: string; // JWT ID): Unique identifier;
}

/**
 * All supported crypto algorithms
 */
const algCryptoMap = {
  HS256: 'SHA256',
  HS384: 'SHA384',
  HS512: 'SHA512',
  RS256: 'RSA-SHA256',
  RS384: 'RSA-SHA384',
  RS512: 'RSA-SHA512',
  none: 'none'
};

/**
 * Error text
 */

const properties = {
  errors: {
    PARSE_ERROR: 'Jwt cannot be parsed',
    EXPIRED: 'Jwt is expired',
    UNSUPPORTED_SIGNING_ALG: 'Unsupported signing algorithm',
    SIGNING_KEY_REQUIRED: 'Signing key is required',
    PUBLIC_KEY_REQUIRED: 'Signing key is required',
    SIGNATURE_MISMATCH: 'Signature verification failed',
    SIGNATURE_ALGORITHM_MISMATCH: 'Unexpected signature algorithm',
    NOT_ACTIVE: 'Jwt not active',
    KEY_RESOLVER_ERROR: 'Error while resolving signing key for kid \"%s\"'
  }
};

/**
 * sigBase64EncodeUrl encoder for the rsa signature
 * @param str the string to encode
 */
function sigBase64EncodeUrl(str: string): string {
  return base64url.fromBase64(str);
}

/**
 * Base64 encoder for body and header
 * @param data the data to encode
 */
function base64urlEncode(data: string | number): string {

  const str = typeof data === 'number' ? data.toString() : data;
  return base64url.fromString(str);
}

/**
 * Error class for the Jwt class
 */
class JwtError extends Error {
  constructor(public message) {
    super('JwtError: ' + message);
  }
}

/**
 * Error class for the parser class
 */
export class JwtParseError extends Error {
  constructor(public message) {
    super('JwtParseError: ' + message);
  }
}

/**
 * Represents a token consisting of 3 parts:
 * header, body and signature
 * The claims are stored in the body (standard claims and extra claims)
 * For the signing is a private key or a shared secret necessary
 * The function getSignedToken creates the final token string
 */
export class Jwt {

  body: JwtBody;
  header: JwtHeader;          //
  signingKey: string;         // contains the private key in pem with -----BEGIN RSA PRIVATE KEY----- header
  publicKey: string;          // contains the private key in pem with -----BEGIN PUBLIC KEY----- header
  signature: string;          // contains the segement 3
  verificationInput: string;  // contains the segements 0 and 1

  private algTypeMap = {
    HS256: 'hmac',
    HS384: 'hmac',
    HS512: 'hmac',
    RS256: 'sign',
    RS384: 'sign',
    RS512: 'sign',
  };


  constructor(header, claims, enforceDefaultFields) {

    this.header = new JwtHeader(header);
    this.body = new JwtBody(claims);

    if (enforceDefaultFields === true) {

      if (!this.body.jti) {
        this.setJti(uuid.v4());
      }

      if (!this.body.iat) {
        this.setIssuedAt(this.nowEpochSeconds());
      }

      if (this.body.exp) {
        if (this.body.exp === 0) {
          this.setExpiration((this.nowEpochSeconds() + (60 * 60)) * 1000);
        }
      } else {
        this.setExpiration((this.nowEpochSeconds() + (60 * 60)) * 1000);
      }

      if (!this.isSupportedAlg(this.header.alg)) {
        throw new Error(`ERROR algorithm ${this.header.alg}  is not supported`);
      }

    }
  }

  nowEpochSeconds(): number {
    return Math.floor(new Date().getTime() / 1000);
  }

  setClaim(claim, value): Jwt {
    this.body[claim] = value;
    return this;
  }

  setHeader(param, value): Jwt {
    this.header[param] = value;
    return this;
  }

  setJti(jti): Jwt {
    this.body.jti = jti;
    return this;
  }

  setSubject(sub): Jwt {
    this.body.sub = sub;
    return this;
  }

  setIssuer(iss): Jwt {
    this.body.iss = iss;
    return this;
  }

  setIssuedAt(iat): Jwt {
    this.body.iat = iat;
    return this;
  }

  setExpiration(exp): Jwt {
    if (exp) {
      this.body.exp = Math.floor((exp instanceof Date ? exp : new Date(exp)).getTime() / 1000);
    }
    return this;
  }

  getExpiration(): number {
    return this.body.exp;
  }

  getExpirationDate(): Date {
    const date = new Date(0);
    date.setUTCSeconds(this.body.exp);
    return date;
  }

  setNotBefore(nbf): Jwt {
    if (nbf) {
      this.body.nbf = Math.floor((nbf instanceof Date ? nbf : new Date(nbf)).getTime() / 1000);
    }
    return this;
  }

  isSupportedAlg(alg): boolean {
    return !!algCryptoMap[alg];
  }

  setSigningAlgorithm(alg): Jwt {
    if (!this.isSupportedAlg(alg)) {
      throw new JwtError(properties.errors.UNSUPPORTED_SIGNING_ALG);
    }
    this.header.alg = alg;
    return this;
  }

  isExpired(): boolean {
    return new Date(this.body.exp * 1000) < new Date();
  }

  isNotBefore(): boolean {
    return new Date(this.body.nbf * 1000) >= new Date();
  }

  setSigningKey(privateKEY: string): Jwt {
    this.signingKey = privateKEY;
    return this;
  }

  setPublicKey(publicKEY: string): Jwt {
    this.publicKey = publicKEY;
    return this;
  }

  /**
   * Signs the token
   *
   * @param payload the data to be signed (part 1 and part 2 of the token)
   * @param algorithm HMAC or RAS algorithm
   * @param cryptoInput  privateKey of sharedSecret
   */
  private sign(payload, algorithm, cryptoInput): string {
    let buffer: string;

    const cryptoAlgName = algCryptoMap[algorithm];
    const signingType = this.algTypeMap[algorithm];

    if (!cryptoAlgName) {
      throw new JwtError(properties.errors.UNSUPPORTED_SIGNING_ALG);
    }

    if (signingType === 'hmac') {
      switch (algorithm) {
        case 'HS256':
          buffer = this.hmacBase64url(CryptoJS.HmacSHA256(payload, cryptoInput));
          break;
        case 'HS384':
          buffer = this.hmacBase64url(CryptoJS.HmacSHA384(payload, cryptoInput));
          break;
        case 'HS512':
          buffer = this.hmacBase64url(CryptoJS.HmacSHA512(payload, cryptoInput));
          break;
      }
    } else {
      const privateKey1 = forge.pki.privateKeyFromPem(cryptoInput) as pki.rsa.PrivateKey;
      let md;
      switch (algorithm) {
        case 'RS256':
          md = forge.md.sha256.create();
          break;
        case 'RS384':
          md = forge.md.sha384.create();
          break;
        case 'RS512':
          md = forge.md.sha512.create();
          break;
      }
      md.update(payload, 'utf8');
      buffer = sigBase64EncodeUrl(btoa(privateKey1.sign(md)));
    }
    return buffer;
  }

  private hmacBase64url(source): string {
    // Encode in classical base64
    const base64 = CryptoJS.enc.Base64.stringify(source);
    return base64url.fromBase64(base64);
  }

  /**
   * The Jwt will be Signed and the 3-parts token is returns
   */
  getSignedToken(): string {

    const segments = [];
    segments.push(this.header.compact());
    segments.push(this.body.compact());

    if (this.header.alg !== 'none') {
      if (this.signingKey) {
        this.signature = this.sign(segments.join('.'), this.header.alg, this.signingKey);
        segments.push(this.signature);
      } else {
        throw new Error(properties.errors.SIGNING_KEY_REQUIRED);
      }
    }
    this.verificationInput = segments[0] + '.' + segments[1];
    return segments.join('.');
  }


  /**
   * Verifies if a the Jwt token class has a valid token
   */
  verifySignature(): boolean {

    if (this.publicKey === 'undefined' || this.publicKey === '') {
      throw new Error(properties.errors.PUBLIC_KEY_REQUIRED);
    }
    const signingType = this.algTypeMap[this.header.alg];
    if (signingType === 'hmac') {
      return (this.signature === this.sign(this.verificationInput, this.header.alg, this.publicKey));
    } else if (signingType === 'sign') {
      const publicKey = forge.pki.publicKeyFromPem(this.publicKey) as pki.rsa.PublicKey;
      let md;
      switch (this.header.alg) {
        case 'RS256':
          md = forge.md.sha256.create();
          break;
        case 'RS384':
          md = forge.md.sha384.create();
          break;
        case 'RS512':
          md = forge.md.sha512.create();
          break;
      }
      md.update(this.verificationInput, 'utf8');

      const decodedSignature = base64url.toBase64(this.signature);
      return publicKey.verify(md.digest().bytes(), atob(decodedSignature));
    } else {
      throw new Error(properties.errors.SIGNATURE_ALGORITHM_MISMATCH);
    }
  }
}

/**
 * The parser is used to inspect and decode a token
 * The parse function returns a Jwt object for a valid token
 */

export class JwtParser {

  private safeJsonParse(input: any): any {
    let result: string;
    try {
      result = JSON.parse(Buffer.from(base64url.toBase64(input), 'base64').toString());
    } catch (e) {
      return e;
    }
    return result;
  }

  /**
   * parse is creating a Jwt token class
   * @param jwtString the encoded 3-parts jwt token
   */
  parse(jwtString): Jwt | JwtParseError {

    const segments = jwtString.split('.');
    let signature;

    if (segments.length < 2 || segments.length > 3) {
      return new JwtParseError(properties.errors.PARSE_ERROR);
    }

    const header = this.safeJsonParse(segments[0]);
    const body = this.safeJsonParse(segments[1]);

    if (segments[2]) {
      signature = segments[2];
    }

    if (header instanceof Error) {
      return new JwtParseError(properties.errors.PARSE_ERROR);
    }
    if (body instanceof Error) {
      return new JwtParseError(properties.errors.PARSE_ERROR);
    }
    const jwt = new Jwt(header, body, false);
    jwt.setSigningAlgorithm(header.alg);
    jwt.signature = signature;
    jwt.verificationInput = segments[0] + '.' + segments[1];
    jwt.header = new JwtHeader(header);
    return jwt;
  }

}

/**
 * Represents the body of the jwt token, which consists of the standard payload
 * and the project specific claims
 */

class JwtBody implements IJwtStdPayload {

  iss?: string; // (issuer): Issuer of the JWT
  sub?: string;  // (subject): Subject of the JWT (the user)
  aud?: string; // audience): Recipient for which the JWT is intended
  exp?: number; // (expiration time): Time after which the JWT expires
  nbf?: number; // (not before time): Time before which the JWT must not be accepted for processing
  iat?: number; // issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
  jti?: string; // JWT ID): Unique identifier;

  constructor(claims) {
    const self = this;
    if (claims) {
      Object.keys(claims).forEach((k)  => {
        self[k] = claims[k];
      });
    }
  }

  toJSON(): any {

    const acc = {};
    Object.keys(this).forEach(key => {

      if (typeof (this[key]) !== 'undefined' && this[key] !== '') {
        acc[key] = this[key];
      }
    });

    return acc;
  }

  compact(): string {
    return base64urlEncode(JSON.stringify(this));
  }

}

/**
 * Represents the header of the JWT token
 * Contains the type and the algorithm
 * The default is HMAC 256
 */
class JwtHeader implements IJwtHeader {

  typ;
  alg;

  constructor(header: IJwtHeader) {
    this.typ = header && header.typ || 'JWT';
    this.alg = header && header.alg || 'HS256';
  }

  compact(): string {
    return base64urlEncode(JSON.stringify(this));
  }

}
