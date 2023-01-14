import {Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {SubSink} from 'subsink';
import {UserService} from '../../../shared/_services/user.service';
import {PostService} from '../../../shared/_services/post.service';
import {TestService} from '../../../shared/_services/test.service';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {BehaviorSubject} from 'rxjs';
import {IPost} from '../../../shared/interfaces/post';
import {IUserPostLikes} from '../../../shared/interfaces/user-post-like';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-board-news',
    templateUrl: './board-news.component.html',
    styleUrls: ['./board-news.component.scss']
})
export class BoardNewsComponent implements OnInit, OnDestroy {
    @ViewChildren('like_icon') private iconRefs: QueryList<ElementRef> | any;
    private subs: SubSink = new SubSink();
    public posts: any;
    public currentPage: number = 1;
    public content?: string;
    public isLiked: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public likes: any[] = [];
    public userId: number = 0;

    public constructor(private userService: UserService,
                       private postService: PostService,
                       private testService: TestService,
                       private token: TokenStorageService,
                       private renderer: Renderer2) {
    }

    public ngOnInit(): void {
        const user = this.token.getUser();
        this.userId = user.id;
        this.getAllPosts();
        this.getLikesByUserId(this.userId);
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public incrementViews(post: any): void {
        this.postService.incrementViews(post);
    }

    public onLikeChange(post: any): void {
        const postId = post.id;
        // TODO: change to @ViewChildren
        const icon = document.querySelector(`#icon_${postId}`);

        this.subs.add(
            this.postService.getLikeStatus(postId, this.userId)
                .subscribe((likeStatus) => {
                        this.isLiked = likeStatus;
                        // console.log(likeStatus, this.isLiked);
                        if (likeStatus) {
                            this.subs.add(
                                this.postService.dislikePost(postId, this.userId)
                                    .pipe(debounceTime(3000))
                                    .subscribe(() => {
                                            post.likes--;
                                            this.renderer.removeClass(icon, 'like-active');
                                            this.renderer.addClass(icon, 'like-inactive');
                                            // console.log('dislike');
                                        },
                                        (error) => {
                                            // console.log(error);
                                        },
                                        () => {
                                            this.subs.unsubscribe();
                                        }));
                        } else {
                            this.subs.add(
                                this.postService.likePost(postId, this.userId)
                                    .pipe(debounceTime(3000))
                                    .subscribe(() => {
                                            post.likes++;
                                            this.renderer.removeClass(icon, 'like-inactive');
                                            this.renderer.addClass(icon, 'like-active');
                                            // console.log('like');
                                        },
                                        (error) => {
                                            // console.log(error);
                                        },
                                        () => {
                                            this.subs.unsubscribe();
                                        }));
                        }
                    }
                )
        );
    }

    public isPostLiked(post: IPost): any {
        let like = this.likes.find((like: IUserPostLikes) => like.postId === post.id);
        return like ? 'like-active' : 'like-inactive';
    }

    private getAllPosts(): void {
        this.subs.add(
            this.postService.getAllPublishedDesc().subscribe(
                (data) => {
                    this.posts = data;
                },
                (error) => {
                    // console.error(e);
                }
            ));
    }

    private getLikesByUserId(userId: number): void {
        this.subs.add(
            this.postService.getLikesByUserId(userId).subscribe(
                (likes) => {
                    this.likes = likes;
                    // console.log(this.likes);
                },
                (error) => {
                    // console.error(e);
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
