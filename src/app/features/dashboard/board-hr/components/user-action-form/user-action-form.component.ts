import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../../shared/_services/user.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthValidators} from '../../../../../shared/classes/AuthValidators';
import {SubSink} from 'subsink';
import {AuthService} from '../../../../../shared/_services/auth.service';

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
  errorMessage = '';
  imageWidth = 100;
  fieldColspan = 3;
  imageMargin = 2;

  constructor(private userService: UserService,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
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
      post: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        AuthValidators.password()
      ]),
    });
  }

  get f(): any {
    return this.userForm.controls;
  }

  saveUser(): void {
    if (this.userForm.dirty && this.userForm.valid) {
      // Copy the form values over the customer object values
      const user = Object.assign({}, this.user, this.userForm.value);

      this.subs.add(this.authService.register(user.firstName, user.lastName, user.email, user.post, user.password)
        .subscribe(
          () => this.router.navigate(['dashboard', 'hr']).then(),
          (error: any) => this.errorMessage = (error as any)
        ));
    } else if (!this.userForm.dirty) {
      this.router.navigate(['dashboard', 'hr']).then();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
