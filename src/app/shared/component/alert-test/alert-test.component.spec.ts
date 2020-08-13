import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTestComponent } from './alert-test.component';

describe('AlertTestComponent', () => {
  let component: AlertTestComponent;
  let fixture: ComponentFixture<AlertTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AlertTestComponent', () => {
    expect(component).toBeTruthy();
  });
});
