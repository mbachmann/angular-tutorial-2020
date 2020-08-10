import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mouse-event-display',
  templateUrl: './mouse-event-display.component.html',
  styleUrls: ['./mouse-event-display.component.scss']
})
export class MouseEventDisplayComponent implements OnInit {

  public event: MouseEvent;
  public clientX = 0;
  public clientY = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public onEvent(event: MouseEvent): void {
    this.event = event;
  }

  public coordinates(event: MouseEvent): void {
    this.clientX = event.clientX;
    this.clientY = event.clientY;
  }

}
