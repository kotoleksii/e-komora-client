import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {PostService} from '../../shared/_services/post.service';
import {IPost} from '../../shared/interfaces/post';
import {TestService} from '../../shared/_services/test.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public posts: any;
    public p: number = 1;
    public content?: string;

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
