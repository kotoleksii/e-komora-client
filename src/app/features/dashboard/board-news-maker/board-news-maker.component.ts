import {Component, OnInit} from '@angular/core';
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
    public showNewsMakerBoard: boolean = false;
    public posts?: IPost[];
    public currentPost: IPost = {};
    public pageTitle: string = 'Менеджер новин';

    public constructor(private postService: PostService,
                       private notifierService: NotifierService,
                       private route: ActivatedRoute,
                       private router: Router,
                       private token: TokenStorageService) {
    }

    public ngOnInit(): void {
        const user = this.token.getUser();
        this.roles = user.roles;
        this.showNewsMakerBoard = this.roles.includes('ROLE_NEWS_MAKER');

        this.getAllPosts();
    }

    public getPostById(id: number): any {
        return this.posts?.find((el: IPost) => el.id === id);
    }

    public updatePublished(id: number, status: boolean): void {
        const data = {
            title: this.getPostById(id).title,
            description: this.getPostById(id).description,
            published: status
        };

        this.subs.add(this.postService.update(id, data)
            .pipe(first())
            .subscribe({
                next: (res) => {
                    // console.log(res);
                    this.currentPost.published = status;
                    this.notifierService.notify('success', 'Статус новини оновлено успішно!');
                    BoardNewsMakerComponent.refreshPage();
                },
                error: (e) => {
                    // console.error(e)
                }
            }));
    }

    public deletePost(id: number): void {
        if (confirm('Ви впевнені, що хочете видалити цей пост?')) {
            this.subs.add(this.postService.delete(id)
                .subscribe({
                    next: () => {
                        BoardNewsMakerComponent.refreshPage();
                    },
                    error: (e) => {
                        // console.error(e)
                    }
                }));
            // console.log('Видалено');
        } else {
            // console.log('Скасувати.');
            return;
        }

    }

    private getAllPosts(): void {
        this.postService.getAllDesc()
            .subscribe({
                next: (data) => {
                    this.posts = data;
                    // console.log(data);
                },
                error: (e) => {
                    // console.error(e)
                }
            });
    }

    private getPost(id: number): void {
        this.postService.get(id)
            .subscribe({
                next: (data) => {
                    this.currentPost = data;
                    // console.log(data);
                },
                error: (e) => {
                    // console.error(e);
                }
            });
    }

    private static refreshPage(): void {
        window.location.reload();
    }
}
