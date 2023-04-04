import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/log-response.module';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {}

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user = {
        email: this.email?.value,
        password: this.password?.value,
      };

      this.todoService.login(user.email, user.password).subscribe({
        next: (response: LoginResponse) => {
          console.log(response);
          this.router.navigate(['/home']);
          console.log('User signIn:', user);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
          this.loginForm.reset;
        },
        complete: () => console.log('Login successfull'),
      });
    }
  }
}
