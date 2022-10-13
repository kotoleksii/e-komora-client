import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../../shared/_services/user.service';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthValidators} from '../../../../../shared/classes/AuthValidators';
import {SubSink} from 'subsink';
import {AuthService} from '../../../../../shared/_services/auth.service';
import {first} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {
    ConfirmDialogModalComponent
} from '../../../../../shared/modals/confirm-dialog-modal/confirm-dialog-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-user-action-form',
    templateUrl: './user-action-form.component.html',
    styleUrls: ['./user-action-form.component.scss']
})
export class UserActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public errorMsg = AuthValidators.getErrorMessage;
    public userForm: any;
    public user: any;
    public username: string = '';
    public imageWidth = 100;
    public imageMargin = 2;
    public pageTitle: string = '';
    public userId: number = 0;
    public topics = ['add', 'edit', 'details'];
    public topic = '';

    constructor(private userService: UserService,
                private authService: AuthService,
                private notifierService: NotifierService,
                public dialog: MatDialog,
                private fb: UntypedFormBuilder,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.topic = this.route.snapshot.params.type;
        this.userId = this.route.snapshot.params.id;
        this.userForm = this.initUserForm();

        this.pageTitle = 'Нова картка';

        this.userForm.enable();

        if (this.topic === 'edit' || this.topic === 'details') {
            this.pageTitle = this.topic === 'edit' ? 'Редагування картки працівника' : 'Особова картка працівника';

            if (this.topic === 'details') {
                this.userForm.disable();
            }

            this.userService.getById(this.userId)
                .pipe(first())
                .subscribe((res) => {
                    this.user = res;
                    console.log(this.user);
                    if (this.user.avatar == null) {
                        this.user.avatar = './assets/images/profile-img.png';
                    }
                    this.userForm.patchValue(res);
                });
        }

        // this.topics.forEach(topic => {
        //   if (param.includes(topic)) {
        //     this.topic = topic;
        //   }
        // });
    }

    initUserForm(): UntypedFormGroup {
        return this.fb.group({
            firstName: new UntypedFormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                AuthValidators.onlyChar()
            ]),
            lastName: new UntypedFormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                AuthValidators.onlyChar()
            ]),
            email: new UntypedFormControl('', [
                Validators.required,
                AuthValidators.emailRegex()
            ]),
            password: new UntypedFormControl(null),
            profile: this.fb.group({
                post: new UntypedFormControl('')
            })
        });
    }

    get f(): any {
        return this.userForm.controls;
    }

    onSubmit(): void {
        if (this.userForm.invalid) {
            return;
        }
        if (this.topic === 'add') {
            this.createUser();
        } else if (this.topic === 'edit') {
            this.updateUser();
        } else if (this.topic === 'details') {
        }
    }

    private createUser(): void {
        const user = Object.assign({}, this.user, this.userForm.value);

        this.subs.add(this.authService.register(user.firstName, user.lastName, user.email, user.password)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `Користувача ${user.firstName} ${user.lastName} створено!`);
                    this.router.navigate(['dashboard', 'hr']).then();
                },
                error: error => {
                    if (error.status === 400) {
                        this.notifierService.notify('error', '🙈 Ймовірно користувач з таким Email вже існує');
                        return;
                    }
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    private updateUser(): void {
        this.subs.add(this.userService.update(this.userId, this.userForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `Користувача оновлено!`);
                    this.router.navigate(['dashboard', 'hr', 'user', 'details', this.userId]).then(() => {
                        window.location.reload();
                    });
                },
                error: error => {
                    this.notifierService.notify('error', error);
                }
            }));
    }

    deleteUser(id: number): void {
        this.subs.add(this.userService.deleteById(id)
            .subscribe({
                next: () => {
                    this.router.navigate(['dashboard', 'hr']).then();
                },
                error: (e) => console.error(e)
            }));
    }

    openConfirmDialog(id: number, dataToDelete?: any): void {
        // if (dataToDelete.profile.id != null) {
        //   console.log('dadad');
        //   return;
        // }
        const dialogRef = this.dialog.open(ConfirmDialogModalComponent, {
            panelClass: 'confirm-dialog-container',
            data: {
                title: 'Ви впевнені?',
                message: `Цю дію не можна скасувати. <br>` +
                    `Це назавжди видалить <span class="confirm-message-phrase">${dataToDelete.firstName + ' ' + dataToDelete.lastName}</span> і всі пов'язані дані.`,
                initialValue: dataToDelete,
            }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                this.notifierService.notify('success', 'Видалення ' + dataToDelete.lastName + ' успішне!');
                this.deleteUser(id);
            }
            console.log(dialogResult);
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
