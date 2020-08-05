import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  timeConversion(millisec): string {

    const seconds: number = (millisec / 1000);
    const minutes: number = (millisec / (1000 * 60));
    const hours: number = (millisec / (1000 * 60 * 60));
    const days: number = (millisec / (1000 * 60 * 60 * 24));

    if (seconds < 60) {
      return seconds.toFixed(1) + ' Sec';
    } else if (minutes < 60) {
      return minutes.toFixed(1) + ' Min';
    } else if (hours < 24) {
      return hours.toFixed(1) + ' Hrs';
    } else {
      return days.toFixed(1) + ' Days';
    }
  }

  computeTimeLeft(endDateTime: Date): string {
    const currentTime = new Date();
    if (endDateTime.valueOf() - currentTime.valueOf() > 0) {
      return this.timeConversion(endDateTime.valueOf() - currentTime.valueOf());
    } else {
      return '0';
    }
  }

}
