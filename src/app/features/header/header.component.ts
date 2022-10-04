import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../../shared/_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private roles: string[] = [];
  public logo: string = 'Є-Робота';
  public flagUA: string = './assets/images/flag-ukraine.png';

  public isLoggedIn: boolean = false;
  public showHome: boolean = true;
  public showAccountantBoard: boolean = false;
  public showHRBoard: boolean = false;
  public showEmployeeBoard: boolean = false;
  public showNewsMakerBoard: boolean = false;
  public username?: string;
  public menuItems: Array<any> = [];

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
      this.showNewsMakerBoard = this.roles.includes('ROLE_NEWS_MAKER');

      this.username = `${user.firstName} ${user.lastName?.slice(0, 1)}.`;
    }

    this.menuItems = this.initMenuItems();
  }

  initMenuItems(): Array<any> {
    return [
      {
        icon: 'fa-solid fa-house',
        title: 'Головна',
        access: this.showHome,
        link: '/home',
        dropMenu: false,
        dropMenuType: ''
      },
      {
        icon: 'fa-solid fa-box-open',
        title: 'Мій Інвентар',
        access: this.showEmployeeBoard,
        link: '/dashboard/employee',
        dropMenu: false,
        dropMenuType: ''
      },
      {
        icon: 'fa-solid fa-folder-open',
        title: 'Особові справи',
        access: this.showHRBoard,
        link: '/dashboard/hr',
        dropMenu: false,
        dropMenuType: ''
      },
      {
        icon: 'fa-solid fa-hand-holding-dollar',
        title: 'Матеріальні цінності',
        access: this.showAccountantBoard,
        link: '/dashboard/accountant',
        dropMenu: false,
        dropMenuType: ''
      },
      {
        icon: 'fa-solid fa-newspaper',
        title: 'Менеджер новин',
        access: this.showNewsMakerBoard,
        link: '/dashboard/news-maker',
        dropMenu: true,
        dropMenuType: 'newsMaker'
      }
    ];
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
