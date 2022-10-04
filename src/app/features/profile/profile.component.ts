import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenStorageService} from '../../shared/_services/token-storage.service';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AuthValidators} from '../../shared/classes/AuthValidators';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {SubSink} from 'subsink';
import {NotifierService} from 'angular-notifier';
import {UserService} from '../../shared/_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  currentUser: any;
  submitted: boolean = false;
  hide: boolean = true;
  userId: number = 0;
  profileForm = new UntypedFormGroup(
    {
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        AuthValidators.password()
      ]),
      confirmPassword: new UntypedFormControl('', [Validators.required])
    },
    AuthValidators.mustMatch('password', 'confirmPassword')
  );


  constructor(private token: TokenStorageService,
              private userService: UserService,
              private notifierService: NotifierService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.userId = this.currentUser.id;
    console.log(this.currentUser);
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
    return this.profileForm.controls;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.updatePassword();
  }

  private updatePassword(): void {
    this.subs.add(this.userService.changePassword(this.userId, this.profileForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notifierService.notify('success', `Пароль змінено!`);
          this.reloadPage();
        },
        error: error => {
          this.notifierService.notify('error', error.message);
        }
      }));
  }

  reloadPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
