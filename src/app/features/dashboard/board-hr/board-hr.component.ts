import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../shared/_services/user.service';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-board-hr',
  templateUrl: './board-hr.component.html',
  styleUrls: ['./board-hr.component.scss']
})
export class BoardHrComponent implements OnInit, OnDestroy {
  content?: string;
  private subs: SubSink = new SubSink();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.subs.add(
      this.userService.getHRBoard().subscribe(
        data => {
          this.content = data;
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
