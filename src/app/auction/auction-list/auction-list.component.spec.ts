import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionListComponent } from './auction-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuctionListDetailComponent} from '../auction-list-detail/auction-list-detail.component';
import {AuctionDataService} from '../shared/auction-data.service';
import {HelperService} from '../../shared/helper/helper.service';


describe('AuctionListComponent', () => {
  let component: AuctionListComponent;
  let fixture: ComponentFixture<AuctionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [
        AuctionListComponent,
        AuctionListDetailComponent
      ],
      providers: [
        AuctionDataService,
        HelperService
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
