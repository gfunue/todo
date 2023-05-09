import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from './services/todo.service';
import { MatDialog } from '@angular/material/dialog';
import { TimeOutComponent } from './shared/time-out/time-out.component';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private warningTimer: any;
  private logoutTimer: any;
  private idleTimeout = 1000 * 60 * 2; // 30 minutes
  private warningTimeout = 1000 * 60 * 1; // 5 minutes
  private warningShown = false;
  resetTimerEvent = new EventEmitter<void>();
  private resetTimerOnMouseMove = this.resetTimer.bind(this);
  private resetTimerOnKeyPress = this.resetTimer.bind(this);

  constructor(
    private todoService: TodoService,
    private router: Router,
    private dialog: MatDialog
  ) {
    //AppComponent.resetTimerEvent = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.validateSingleSession();
    this.resetTimer();
    document.body.addEventListener('mousemove', this.resetTimerOnMouseMove);
    document.body.addEventListener('keypress', this.resetTimerOnKeyPress);
    //AppComponent.resetTimerEvent.subscribe(() => this.resetTimer());
  }

  ngOnDestroy(): void {
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);
    document.body.removeEventListener('mousemove', this.resetTimerOnMouseMove);
    document.body.removeEventListener('keypress', this.resetTimerOnKeyPress);
  }

  resetTimer(): void {
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);
    this.warningShown = false;
    if (this.todoService.isLoggedIn()) {
      this.todoService.updateLastActivity();
      this.warningTimer = setTimeout(() => {
        if (!this.warningShown) {
          this.showWarningPopup();
        }
      }, this.idleTimeout - this.warningTimeout);

      this.logoutTimer = setTimeout(() => {
        if (this.warningShown) {
          this.todoService.logout();
          this.router.navigate(['/']);
        }
      }, this.idleTimeout);
    }
  }

  validateSingleSession(): void {
    const lastActivity = Number(localStorage.getItem('lastActivity'));
    const now = Date.now();
    if (now - lastActivity > this.idleTimeout) {
      this.todoService.logout();
      this.router.navigate(['/']);
    }
  }

  showWarningPopup(): void {
    this.warningShown = true;
    const dialogRef = this.dialog.open(TimeOutComponent, {
      width: '300px',
      data: {
        title: 'Inactivity Warning',
        message: 'You will be logged out in 5 minutes due to inactivity.',
      },
    });

    dialogRef.componentInstance.activityDetected.subscribe(() => {
      this.resetTimer();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.warningShown = false;
      this.resetTimer();
    });
  }
}
