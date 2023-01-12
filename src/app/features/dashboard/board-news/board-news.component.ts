import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {SubSink} from 'subsink';
import {UserService} from '../../../shared/_services/user.service';
import {PostService} from '../../../shared/_services/post.service';
import {TestService} from '../../../shared/_services/test.service';
import {TokenStorageService} from '../../../shared/_services/token-storage.service';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-board-news',
    templateUrl: './board-news.component.html',
    styleUrls: ['./board-news.component.scss']
})
export class BoardNewsComponent implements OnInit, OnDestroy {
    @ViewChildren('iconRef') private iconRefs: any;
    private subs: SubSink = new SubSink();
    public posts: any;
    public currentPage: number = 1;
    public content?: string;
    public btnLikeColor: string = '#9b9bab';
    // public isLiked: boolean = false;
    public isLiked: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public likeStatus: boolean = false;

    public constructor(private userService: UserService,
                       private postService: PostService,
                       private testService: TestService,
                       private token: TokenStorageService) {
    }

    public ngOnInit(): void {
        this.getAllPosts();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public incrementViews(post: any): void {
        this.postService.incrementViews(post);
    }

    public onLikeChange(post: any): void {
        const user = this.token.getUser();
        const postId = post.id;
        const userId = user.id;

        this.subs.add(
            this.postService.getLikeStatus(postId, userId).subscribe((likeStatus) => {
                    this.isLiked = likeStatus;
                    console.log(likeStatus, this.isLiked);
                    if (likeStatus) {
                        this.subs.add(
                            this.postService.dislikePost(postId, userId).subscribe(() => {
                                console.log('dislike');
                                this.btnLikeColor = '#9b9bab';
                                this.postService.decrementLikes(post);
                            }));
                    } else {
                        this.subs.add(
                            this.postService.likePost(postId, userId).subscribe(() => {
                                console.log('like');
                                this.btnLikeColor = '#ffffff';
                                this.postService.incrementLikes(post);
                            }));
                    }
                }
            )
        );
    }

    // public getBestPlayerNickname(): any {
    //   this.subs.add(
    //     this.userService.getUserIdWithMaxRate().pipe(
    //       switchMap((id) => {
    //         return this.userService.getUserById(id);
    //       })).subscribe((data) => {
    //       this.bestPlayer.next(data.nickname);
    //     }));
    // }


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
