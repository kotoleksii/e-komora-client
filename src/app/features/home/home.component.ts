import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/_services/user.service';
import {SubSink} from 'subsink';
import {PostService} from '../../shared/_services/post.service';
import {IPost} from '../../shared/interfaces/Post';
import {TestService} from '../../shared/_services/test.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    posts: any;
    p: number = 1;
    content?: string;
    private subs: SubSink = new SubSink();

    constructor(private userService: UserService,
                private postService: PostService,
                private testService: TestService) {
    }

    ngOnInit(): void {
        this.getAllPosts();
    }

    getAllPosts(): void {
        this.subs.add(this.postService.getAllPublishedDesc()
            .subscribe({
                next: (data) => {
                    this.posts = data;
                },
                error: (e) => console.error(e)
            }));
    }

    getHomeServerContent(): void {
        this.subs.add(
            this.testService.getPublicContent().subscribe(
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
