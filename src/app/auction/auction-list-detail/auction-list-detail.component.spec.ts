import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionListDetailComponent } from './auction-list-detail.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuctionDataService} from '../shared/auction-data.service';
import {HelperService} from '../../shared/helper';

const dummyAuction =
  {
    id: 1,
    seller: 'Felix',
    category: {id: 1, name: 'Bikes', description: 'Motor bikes'},
    auctionItem:
      {
        title: 'Yamaha YZF R1 Sports Bike',
        description: 'Ready to take a "walk" on the wild side ',
        picture: '01-yamaha-blue.png'
      },
    startDateTime: getDate(-5),
    startingPrice: 4000,
    fixedPrice: 5000,
    bids:
      [
        {id: 1, amount: 4100, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Max'},
        {id: 2, amount: 4200, cancelExplanation: '', placedAtDateTime: getDate(-3), buyer: 'Klaus'},
        {id: 3, amount: 4300, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Nadja'}
      ],
    endDateTime: getDate(1),
    isFixedPrice: false,
    minBidIncrement: 100
  };

function getDate(days: number): Date {
  return addDays(new Date(), days);
}

function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}


describe('AuctionListDetailComponent', () => {
  let component: AuctionListDetailComponent;
  let fixture: ComponentFixture<AuctionListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],

      declarations: [ AuctionListDetailComponent ],
      providers: [
        AuctionDataService,
        HelperService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionListDetailComponent);
    component = fixture.componentInstance;
    component.auction = dummyAuction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
