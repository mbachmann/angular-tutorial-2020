import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';

describe('BrowserStorageService', () => {
  let service: BrowserStorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(BrowserStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should write to local store', () => {
    service.rememberMe = true;
    service.setItem('dummyTestItem', 'item');
    expect(service.getItem('dummyTestItem')).toEqual('item');
    expect(localStorage.getItem('dummyTestItem')).toEqual('item');

  });

  it('should write to session store', () => {
    service.rememberMe = false;
    service.setItem('dummyTestItem', 'item');
    expect(service.getItem('dummyTestItem')).toEqual('item');
    expect(sessionStorage.getItem('dummyTestItem')).toEqual('item');
  });

});
