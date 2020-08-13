import {decodeToken, Jwt} from '../helper/helper.jwt';


export class User {

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  id?: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  thresholdOpenPayment?: number;
  locked?: boolean;
  token?: string;
  refreshToken?: string;
  roles?: Array<string>;
  expires?: number;
  publicKey?: string;

  public isLoggedIn(): boolean {
    if (this.token) {
      this.extractTokenInfo();
      if ( !this.isTokenExpired() ) { return true; }
    }
    return false;
  }

  public extractTokenInfo(): void {
    const jwt = decodeToken(this.token);
    if (jwt instanceof Jwt) {
      this.expires = +JSON.stringify(jwt.getExpiration());
      this.roles = jwt.body['roles'];
    }
  }

  public isTokenExpired(): boolean {
    if (this.expires) {
      const expiresDate = new Date(this.expires * 1000);
      return expiresDate.getTime() - Date.now() <= 0;
    }
    return true;
  }
}
