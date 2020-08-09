import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  // Remember-me is influenced by the user signing the data protection contract
  // or can be part of the login dialog
  private _rememberMe: boolean = false;

  constructor() {
  }

  get rememberMe(): boolean {
    return this._rememberMe;
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  removeItem(name: string) {
    if (this._rememberMe) localStorage.removeItem(name);
    else sessionStorage.removeItem(name)
  }

  getItem(name: string): string {
    if (this._rememberMe) return localStorage.getItem(name);
    else return sessionStorage.getItem(name)
  }

  setItem(name: string, value: string) {
    if (this._rememberMe) localStorage.setItem(name, value);
    else sessionStorage.setItem(name, value)
  }

  clear() {

    if (this._rememberMe) localStorage.clear();
    else sessionStorage.clear();
  }
}
