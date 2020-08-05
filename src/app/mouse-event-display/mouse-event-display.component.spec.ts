import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseEventDisplayComponent } from './mouse-event-display.component';

describe('MouseEventDisplayComponent', () => {
  let component: MouseEventDisplayComponent;
  let fixture: ComponentFixture<MouseEventDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouseEventDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouseEventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
