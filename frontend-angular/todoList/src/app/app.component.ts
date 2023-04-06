import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoService } from './services/todo.service';
import { MatDialog } from '@angular/material/dialog';
import { TimeOutComponent } from './shared/time-out/time-out.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private idleTimer: any;
  private idleTimeout = 1000 * 60 * 2; // 30 minutes
  private warningTimeout = 1000 * 60 * 1; // 5 minutes
  private warningShown = false;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.validateSingleSession();
    this.resetTimer();
    document.body.addEventListener('mousemove', () => this.resetTimer());
    document.body.addEventListener('keypress', () => this.resetTimer());
  }

  ngOnDestroy(): void {
    clearTimeout(this.idleTimer);
    document.body.removeEventListener('mousemove', () => this.resetTimer());
    document.body.removeEventListener('keypress', () => this.resetTimer());
  }

  resetTimer(): void {
    clearTimeout(this.idleTimer);
    this.warningShown = false;
    if (this.todoService.isLoggedIn()) {
      this.todoService.updateLastActivity();
      this.idleTimer = setTimeout(() => {
        if (!this.warningShown) {
          this.showWarningPopup();
        }
      }, this.idleTimeout - this.warningTimeout);

      this.idleTimer = setTimeout(() => {
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

    dialogRef.afterClosed().subscribe(() => {
      this.warningShown = false;
      this.resetTimer();
    });
  }
}
