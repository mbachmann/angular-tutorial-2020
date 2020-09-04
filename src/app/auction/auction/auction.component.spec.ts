import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionComponent } from './auction.component';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';

describe('AuctionComponent', () => {
  let component: AuctionComponent;
  let fixture: ComponentFixture<AuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
      ],
      declarations: [
        AuctionComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
