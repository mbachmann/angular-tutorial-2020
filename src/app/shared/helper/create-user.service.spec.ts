import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CreateUserService} from './create-user.service';
import {User} from '../model/user';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MockBackendInterceptor} from './mock/mock-backend-interceptor.service';

describe('CreateUserService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        CreateUserService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        }]
    });

  });

  it('should be created', () => {
    const service = TestBed.inject(CreateUserService);
    expect(service).toBeTruthy();
  });

  it('should create a user', fakeAsync ( () => {
    const service = TestBed.inject(CreateUserService);
    // create test user
    const testuser = 'testuser';

    service.checkAndRegisterUser(testuser);
    tick(20000);

    // check
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user: User = users.find(x => x.username === testuser && x.password === testuser);
    expect(user.username).toEqual(testuser);

    // delete testuser
    users = users.filter(x => x.id !== user.id);
    localStorage.setItem('users', JSON.stringify(users));
  }));

  async function delay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }

});
