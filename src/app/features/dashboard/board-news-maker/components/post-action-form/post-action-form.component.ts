import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../../../../shared/_services/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-post-action-form',
    templateUrl: './post-action-form.component.html',
    styleUrls: ['./post-action-form.component.scss']
})
export class PostActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public postForm: any;
    public isAddMode = true;
    public postId = 0;
    public pageTitle = '';
    public postDescription = '';

    public constructor(private postService: PostService,
                       private formBuilder: FormBuilder,
                       private notifierService: NotifierService,
                       private router: Router,
                       private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.postId = this.route.snapshot.params.id;
        this.isAddMode = !this.postId;

        this.pageTitle = 'Додати новину';

        this.postForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            published: false
        });

        if (!this.isAddMode) {
            this.pageTitle = 'Редагування новини';
            this.subs.add(this.postService.get(this.postId)
                .pipe(first())
                .subscribe((x) => this.postForm.patchValue(x)));
        }
    }

    public onSubmit(): void {
        if (this.postForm.invalid) {
            return;
        }

        if (this.isAddMode) {
            this.createPost();
        } else {
            this.updatePost();
        }
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
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
                    this.notifierService.notify('success', '💪 Новину створено!');
                    this.router.navigate(['dashboard', 'news-maker']).then();
                },
                error: (error: Error) => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    private updatePost(): void {
        this.subs.add(this.postService.update(this.postId, this.postForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', '💪 Новину редаговано!');
                    this.router.navigate(['dashboard', 'news-maker']).then();
                },
                error: (error: Error) => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    public get f(): UntypedFormControl {
        return this.postForm.controls;
    }
}
