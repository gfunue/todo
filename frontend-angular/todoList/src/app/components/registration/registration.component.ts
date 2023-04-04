import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/registration.module';
import { LoginResponse } from '../../models/log-response.module';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {}

  passwordsMatch: boolean = false;

  ngOnInit(): void {}

  registrationForm = this.formBuilder.group(
    {
      firstName: [
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.required,
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.required,
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ],
    },
    { validator: this.checkPasswords }
  );

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.passwordsMatch = this.checkPasswords(this.registrationForm) === null;
    if (this.registrationForm.valid && this.passwordsMatch) {
      const newUser: User = {
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        email: this.email?.value,
        password: this.password?.value,
      };

      this.todoService.registerUser(newUser).subscribe({
        next: (response: LoginResponse) => {
          console.log(response);
          this.router.navigate(['../success']);
          console.log('New user:', newUser);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
          this.registrationForm.reset;
        },
        complete: () => console.log('Registration succesfull'),
      });
    }
  }

  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }
}
