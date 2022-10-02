import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {PostService} from '../../shared/_services/post.service';
import {IPost} from '../../shared/interfaces/Post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  posts?: IPost[];
  content?: string;
  private subs: SubSink = new SubSink();

  constructor(private userService: UserService,
              private postService: PostService) {
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.subs.add(this.postService.getAllPublished()
      .subscribe({
        next: (data) => {
          this.posts = data;
        },
        error: (e) => console.error(e)
      }));
  }

  getHomeServerContent(): void {
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
