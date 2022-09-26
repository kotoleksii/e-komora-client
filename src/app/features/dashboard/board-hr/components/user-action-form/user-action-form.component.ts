import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../../shared/_services/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthValidators} from '../../../../../shared/classes/AuthValidators';
import {SubSink} from 'subsink';
import {AuthService} from '../../../../../shared/_services/auth.service';
import {first} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-user-action-form',
  templateUrl: './user-action-form.component.html',
  styleUrls: ['./user-action-form.component.scss']
})
export class UserActionFormComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  errorMsg = AuthValidators.getErrorMessage;
  userForm: any;
  user: any;
  username = '';
  imageWidth = 100;
  imageMargin = 2;
  isAddMode = true;
  pageTitle = '';
  userId = 0;

  constructor(private userService: UserService,
              private authService: AuthService,
              private notifierService: NotifierService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
    this.isAddMode = !this.userId;
    this.pageTitle = 'Нова картка';

    this.userForm = this.fb.group({
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
      profile: this.fb.group({
        post: new FormControl('')
      })
    });

    if (!this.isAddMode) {
      this.pageTitle = 'Редагування картки працівника';
      this.userService.getById(this.userId)
        .pipe(first())
        .subscribe((res) => {
          this.user = res;
          console.log(this.user);
          if (this.user.avatar == null) {
            this.user.avatar = './assets/images/profile-img.png';
          }
          this.userForm.patchValue(res);
        });
    }
  }

  get f(): any {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser(): void {
    const user = Object.assign({}, this.user, this.userForm.value);

    this.subs.add(this.authService.register(user.firstName, user.lastName, user.email, user.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notifierService.notify('success', `Користувача ${user.firstName} ${user.lastName} створено!`);
          this.router.navigate(['dashboard', 'hr']).then();
        },
        error: error => {
          if (error.status === 400) {
            this.notifierService.notify('error', '🙈 Ймовірно користувач з таким Email вже існує');
            return;
          }
          this.notifierService.notify('error', error.message);
        }
      }));
  }

  private updateUser(): void {
    this.userService.update(this.userId, this.userForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notifierService.notify('success', `Користувача оновлено!`);
          this.router.navigate(['dashboard', 'hr']).then();
        },
        error: error => {
          this.notifierService.notify('error', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
