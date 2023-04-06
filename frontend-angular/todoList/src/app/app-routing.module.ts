import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { FailComponent } from './shared/fail/fail.component';
import { SuccessComponent } from './shared/success/success.component';
import { AuthGuard } from './guards/auth.guard';
import { TimeOutComponent } from './shared/time-out/time-out.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'timeOut', component: TimeOutComponent },
  { path: '**', component: FailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
