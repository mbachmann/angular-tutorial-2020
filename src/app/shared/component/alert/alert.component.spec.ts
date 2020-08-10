import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import {AlertService} from './alert.service';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ],
      declarations: [ AlertComponent ],
      providers: [
        AlertService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write an INFO alert to the component', () => {
    const alertService: AlertService = TestBed.inject(AlertService);
    alertService.info('INFO');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('span')).nativeNode.innerHTML).toEqual('INFO');
    expect(fixture.debugElement.query(By.css('.alert-info'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.alert'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.close'))).toBeTruthy();
  });

  it('should write an ERROR alert to the component', () => {
    const alertService: AlertService = TestBed.inject(AlertService);
    alertService.error('ERROR');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('span')).nativeNode.innerHTML).toEqual('ERROR');
    expect(fixture.debugElement.query(By.css('.alert-danger'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.alert'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.close'))).toBeTruthy();
  });

  it('should write an SUCCESS alert to the component', () => {
    const alertService: AlertService = TestBed.inject(AlertService);
    alertService.success('SUCCESS');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('span')).nativeNode.innerHTML).toEqual('SUCCESS');
    expect(fixture.debugElement.query(By.css('.alert-success'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.alert'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.close'))).toBeTruthy();

    alertService.clear();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.alert'))).toBeFalsy();

  });

});
