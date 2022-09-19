import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/_services/auth.service';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
              private notifierService: NotifierService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const {username, email, password} = this.form;

    this.subs.add(
      this.authService.register(username, email, password).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.notifierService.notify('success', `Реєстрація успішна!`);
          this.router.navigate(['login']).then(() => {
            window.location.reload();
          });
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
          if (err.status === 400) {
            this.notifierService.notify('error', 'Такі Ім`я або Email вже існують!');
            return;
          }
          this.notifierService.notify('error', 'Signup failed!');
        }
      ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
