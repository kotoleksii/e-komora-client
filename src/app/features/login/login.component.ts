import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/_services/auth.service';
import {TokenStorageService} from '../../shared/_services/token-storage.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs: SubSink = new SubSink();
  hide = true;
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.username = this.tokenStorage.getUser().firstName;
      this.notifierService.notify('success', `👋 Вітаємо Вас знову, ${this.username}!`);
      this.reloadByRole(this.roles[0]);
    }
  }

  onSubmit(): void {
    const {email, password} = this.form;

    this.subs.add(
      this.authService.login(email, password).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.username = this.tokenStorage.getUser().firstName;
          this.notifierService.notify('success', `👋 Привіт, ${this.username}!`);
          // this.reloadByRole(this.roles[0]);
          this.router.navigate(['home']).then(() => {
            this.reloadPage();
          });
        },
        err => {
          this.isLoginFailed = true;
          this.errorMessage = err.error?.message;
          this.notifierService.notify('error', 'Login failed!');
          // this.reloadByRole(this.roles[0]);
        }
      ));
  }

  reloadByRole(role: string): void {
    switch (role) {
      case 'ROLE_EMPLOYEE':
        this.router.navigate(['dashboard', 'employee']).then(() => {
          this.reloadPage();
        });
        break;
      case 'ROLE_HR':
        this.router.navigate(['dashboard', 'hr']).then(() => {
          this.reloadPage();
        });
        break;
      case 'ROLE_ACCOUNTANT':
        this.router.navigate(['dashboard', 'accountant']).then(() => {
          this.reloadPage();
        });
        break;
      default:
        this.router.navigate(['login']).then(() => {
          this.reloadPage();
        });
        break;
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
