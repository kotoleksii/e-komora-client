import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IPost} from '../../../shared/interfaces/Post';
import {PostService} from '../../../shared/_services/post.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {SubSink} from 'subsink';
import {first} from 'rxjs/operators';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';

@Component({
  selector: 'app-board-news-maker',
  templateUrl: './board-news-maker.component.html',
  styleUrls: ['./board-news-maker.component.scss']
})
export class BoardNewsMakerComponent implements OnInit {
  private subs: SubSink = new SubSink();
  private roles: string[] = [];
  public showNewsMakerBoard = false;
  public posts?: IPost[];
  public currentPost: IPost = {};
  public pageTitle = 'Менеджер новин';

  constructor(private postService: PostService,
              private notifierService: NotifierService,
              private route: ActivatedRoute,
              private router: Router,
              private token: TokenStorageService) {
  }

  ngOnInit(): void {
    const user = this.token.getUser();
    this.roles = user.roles;
    this.showNewsMakerBoard = this.roles.includes('ROLE_NEWS_MAKER');

    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAllDesc()
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
}
