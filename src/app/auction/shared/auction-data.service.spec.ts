import {TestBed} from '@angular/core/testing';

import {AuctionDataService} from './auction-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MockBackendInterceptor} from '../../shared/helper/mock/mock-backend-interceptor.service';

describe('AuctionDataService', () => {
  let service: AuctionDataService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', redirectTo: ''}]),
        HttpClientTestingModule,

      ],
      providers: [
        AuctionDataService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockBackendInterceptor,
          multi: true
        }
      ]
    });
    service = TestBed.inject(AuctionDataService);

  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load an auction', (done) => {
    service.getHttpAuction(1).subscribe(
      (data) => {
        console.log('auctionData=' + data.id);
        expect(data.id).toBe(1);
        done();
      },
      (err) => {
        console.log('auctionResponse', err);
        fail();
        done();
      }, () => {
        // console.log('Test complete');
        done();
      });
  });

});
