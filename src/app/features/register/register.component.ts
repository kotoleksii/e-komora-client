import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/_services/auth.service';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthValidators} from '../../shared/classes/AuthValidators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  errorMsg = AuthValidators.getErrorMessage;
  isSuccessful = false;
  isSignUpFailed = false;
  submitted = false;
  hide = true;
  errorMessage = '';
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        AuthValidators.onlyChar()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        AuthValidators.onlyChar()
      ]),
      email: new FormControl('', [
        Validators.required,
        AuthValidators.emailRegex()
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        AuthValidators.password()
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    AuthValidators.mustMatch('password', 'confirmPassword')
  );


  constructor(private authService: AuthService,
              private notifierService: NotifierService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  public checkControlUppercase(control: AbstractControl): boolean {
    return !(!control.value.split('').find((char: any) => !/[a-z]/.test(char) && /[A-Z]/.test(char)) &&
      control.touched);
  }

  public checkControlLowercase(control: AbstractControl): boolean {
    return !(!control.value.split('').find((char: any) => /[a-z]/.test(char) && !/[A-Z]/.test(char)) &&
      control.touched);
  }

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
        this.registerForm.value.password
      ).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.notifierService.notify('success', `Реєстрація успішна!`);
          this.router.navigate(['login']).then();
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
