import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';

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
              private token: TokenStorageService) {
  }

  ngOnInit(): void {
    const user = this.token.getUser();
    this.roles = user.roles;
    this.showAccountantBoard = this.roles.includes('ROLE_ACCOUNTANT');

    this.subs.add(
      this.userService.getAccountantBoard().subscribe(
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
