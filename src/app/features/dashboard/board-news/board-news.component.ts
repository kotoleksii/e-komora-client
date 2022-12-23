import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {UserService} from '../../../shared/_services/user.service';
import {PostService} from '../../../shared/_services/post.service';
import {TestService} from '../../../shared/_services/test.service';

@Component({
    selector: 'app-board-news',
    templateUrl: './board-news.component.html',
    styleUrls: ['./board-news.component.scss']
})
export class BoardNewsComponent implements OnInit, OnDestroy {

    private subs: SubSink = new SubSink();
    public posts: any;
    public currentPage: number = 1;
    public content?: string;
    public btnLikeColor: string = '#9b9bab';

    public constructor(private userService: UserService,
                       private postService: PostService,
                       private testService: TestService) {
    }

    public ngOnInit(): void {
        this.getAllPosts();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public toggleLikeButton(): void {
        if (this.btnLikeColor === '#9b9bab') {
            this.btnLikeColor = '#ffffff';
        } else {
            this.btnLikeColor = '#9b9bab';
        }
    }

    private getAllPosts(): void {
        this.subs.add(this.postService.getAllPublishedDesc()
            .subscribe({
                next: (data) => {
                    this.posts = data;
                },
                error: (e) => {
                    // console.error(e);
                }
            }));
    }

    private getHomeServerContent(): void {
        this.subs.add(
            this.testService.getPublicContent().subscribe(
                (data) => {
                    this.content = data;
                },
                (error) => {
                    // this.content = JSON.parse(error.error).message;
                }
            ));
    }

}
