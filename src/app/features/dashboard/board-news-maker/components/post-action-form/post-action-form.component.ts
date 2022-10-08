import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../../../../shared/_services/post.service';
import {IPost} from '../../../../../shared/interfaces/Post';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UntypedFormBuilder, UntypedFormControl, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-post-action-form',
    templateUrl: './post-action-form.component.html',
    styleUrls: ['./post-action-form.component.scss']
})
export class PostActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    postForm: any;
    isAddMode = true;
    postId = 0;
    pageTitle = '';
    postDescription = '';

    constructor(private postService: PostService,
                private formBuilder: UntypedFormBuilder,
                private notifierService: NotifierService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.postId = this.route.snapshot.params.id;
        this.isAddMode = !this.postId;

        this.pageTitle = 'Нова новина';

        this.postForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            published: false,
        });

        if (!this.isAddMode) {
            this.pageTitle = 'Редагування новини';
            this.subs.add(this.postService.get(this.postId)
                .pipe(first())
                .subscribe(x => this.postForm.patchValue(x)));
        }
    }

    get f(): UntypedFormControl {
        return this.postForm.controls;
    }

    onSubmit(): void {
        if (this.postForm.invalid) {
            return;
        }

        if (this.isAddMode) {
            this.createPost();
        } else {
            this.updatePost();
        }
    }

    private createPost(): void {
        const data = {
            title: this.postForm.value.title,
            description: this.postForm.value.description
        };

        this.subs.add(this.postService.create(data)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `💪 Новину створено!`);
                    this.router.navigate(['dashboard', 'news-maker']).then();
                },
                error: error => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    private updatePost(): void {
        this.subs.add(this.postService.update(this.postId, this.postForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `💪 Новину редаговано!`);
                    this.router.navigate(['dashboard', 'news-maker']).then();
                },
                error: error => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
