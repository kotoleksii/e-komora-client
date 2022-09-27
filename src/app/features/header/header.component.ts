import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../shared/_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private roles: string[] = [];
  logo = 'Є-Комора';
  flagUA = './assets/images/flag-ukraine.png';
  isLoggedIn = false;
  showAccountantBoard = false;
  showHRBoard = false;
  showEmployeeBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');
      this.showHRBoard = this.roles.includes('ROLE_HR');
      this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');

      this.username = `${user.firstName} ${user.lastName?.slice(0, 1)}.`;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
