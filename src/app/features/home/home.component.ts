import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/_services/user.service';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  content?: string;
  private subs: SubSink = new SubSink();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.subs.add(
      this.userService.getPublicContent().subscribe(
        data => {
          this.content = data;
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
