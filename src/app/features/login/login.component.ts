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
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
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
      this.notifierService.notify('success', `Ви зайшли як ${this.roles[0].substr(5)}`);
      this.reloadByRole(this.roles[0]);
    }
  }

  onSubmit(): void {
    const {username, password} = this.form;

    this.subs.add(
      this.authService.login(username, password).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.notifierService.notify('success', `Ви зайшли як ${this.roles[0].substr(5)}`);
          this.reloadByRole(this.roles[0]);
        },
        err => {
          this.isLoginFailed = true;
          this.errorMessage = err.error?.message;
          this.notifierService.notify('error', 'Login failed!');
          // this.form.username = '';
          // this.form.password = '';
        }
      ));
  }

  reloadByRole(role: string): void {
    switch (role) {
      case 'ROLE_USER':
        this.router.navigate(['dashboard', 'user']).then(() => {
          this.reloadPage();
        });
        break;
      case 'ROLE_MODERATOR':
        this.router.navigate(['dashboard', 'mod']).then(() => {
          this.reloadPage();
        });
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['dashboard', 'admin']).then(() => {
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
