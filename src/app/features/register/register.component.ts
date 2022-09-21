import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/_services/auth.service';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../shared/classes/CustomValidators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    CustomValidators.mustMatch('password', 'confirmPassword')
  );

  submitted = false;

  constructor(private authService: AuthService,
              private notifierService: NotifierService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.subs.add(
      this.authService.register(
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.email,
        this.registerForm.value.password).subscribe(
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
            this.notifierService.notify('error', 'Такі Ім`я або Email вже зайняті!');
            return;
          }
          this.notifierService.notify('error', 'Signup failed!');
        }
      ));
    // this.success = JSON.stringify(this.registerForm.value);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
