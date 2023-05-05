import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-time-out',
  templateUrl: './time-out.component.html',
  styleUrls: ['./time-out.component.css'],
})
export class TimeOutComponent implements OnInit, OnDestroy {
  minutesLeft = 1;
  secondsLeft = 0;
  private countdownInterval: any;

  constructor(public dialogRef: MatDialogRef<TimeOutComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.startCountdown();
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.type === 'keydown') {
        AppComponent.resetTimerEvent.emit();
      }
    });
    this.dialogRef.backdropClick().subscribe(() => {
      AppComponent.resetTimerEvent.emit();
    });
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
