import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-time-out',
  templateUrl: './time-out.component.html',
  styleUrls: ['./time-out.component.css'],
})
export class TimeOutComponent implements OnInit, OnDestroy {
  minutesLeft = 5;
  secondsLeft = 0;
  private countdownInterval: any;

  constructor(public dialogRef: MatDialogRef<TimeOutComponent>) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.secondsLeft === 0) {
        this.minutesLeft--;
        this.secondsLeft = 59;
      } else {
        this.secondsLeft--;
      }

      if (this.minutesLeft === 0 && this.secondsLeft === 0) {
        clearInterval(this.countdownInterval);
        this.dialogRef.close();
      }
    }, 1000);
  }
}
