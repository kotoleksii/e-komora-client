import {Component, OnInit} from '@angular/core';
import {IPost} from '../../../shared/interfaces/Post';
import {PostService} from '../../../shared/_services/post.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {SubSink} from 'subsink';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-board-news-maker',
  templateUrl: './board-news-maker.component.html',
  styleUrls: ['./board-news-maker.component.scss']
})
export class BoardNewsMakerComponent implements OnInit {
  private subs: SubSink = new SubSink();
  posts?: IPost[];
  currentPost: IPost = {};
  currentIndex = -1;
  title = '';

  constructor(private postService: PostService,
              private notifierService: NotifierService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAll()
      .subscribe({
        next: (data) => {
          this.posts = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  getPost(id: number): void {
    this.postService.get(id)
      .subscribe({
        next: (data) => {
          this.currentPost = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  public getPostById(id: number): any {
    return this.posts?.find((el: IPost) => el.id === id);
  }

  updatePublished(id: number, status: boolean): void {
    const data = {
      title: this.getPostById(id).title,
      description: this.getPostById(id).description,
      published: status
    };

    this.subs.add(this.postService.update(id, data)
      .pipe(first())
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentPost.published = status;
          this.notifierService.notify('success', `Статус новини оновлено успішно!`);
          this.refreshPage();
        },
        error: (e) => console.error(e)
      }));
  }

  refreshPage(): void {
    window.location.reload();
  }

  refreshList(): void {
    this.getAllPosts();
    this.currentPost = {};
    this.currentIndex = -1;
  }

  setActivePost(post: IPost, index: number): void {
    this.currentPost = post;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.currentPost = {};
    this.currentIndex = -1;

    this.postService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.posts = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

}
