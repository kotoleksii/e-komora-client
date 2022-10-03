import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {TestService} from '../../../shared/_services/test.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-board-accountant',
  templateUrl: './board-accountant.component.html',
  styleUrls: ['./board-accountant.component.scss']
})
export class BoardAccountantComponent implements OnInit, OnDestroy {
  content?: string;
  showAccountantBoard = false;
  private roles: string[] = [];
  private subs: SubSink = new SubSink();

  constructor(private userService: UserService,
              private testService: TestService,
              private token: TokenStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    const user = this.token.getUser();
    this.roles = user.roles;
    this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');

    if (!this.showAccountantBoard) {
      this.router.navigate(['home']).then();
    }

    this.subs.add(
      this.testService.getAccountantBoard().subscribe(
        data => {
          this.content = data;
          console.log(this.content);
        },
        err => {
          this.content = err?.message;
        }
      ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
