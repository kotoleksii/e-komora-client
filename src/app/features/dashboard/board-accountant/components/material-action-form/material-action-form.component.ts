import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {NotifierService} from 'angular-notifier';
import {MaterialService} from '../../../../../shared/_services/material.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, first, map, startWith, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {IUser} from '../../../../../shared/interfaces/user';
import {UserService} from '../../../../../shared/_services/user.service';
import {IMaterial} from '../../../../../shared/interfaces/material';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-material-action-form',
    templateUrl: './material-action-form.component.html',
    styleUrls: ['./material-action-form.component.scss']
})
export class MaterialActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public materialForm: FormGroup = {} as FormGroup;
    public material: IMaterial | any;
    public users: any;
    public userId: number = 0;
    public materialId: number = 0;
    public types: string[] = ['шт.', 'од.', 'кг', 'м'];
    public topics: string[] = ['add', 'edit', 'details'];
    public topic: string = '';
    public pageTitle: string = '';
    public materialToSendInfo: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public qrCodeData: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public isLoading: boolean = true;

    public constructor(private materialService: MaterialService,
                       private userService: UserService,
                       private fb: FormBuilder,
                       public dialog: MatDialog,
                       private notifierService: NotifierService,
                       private route: ActivatedRoute,
                       private router: Router) {
        this.materialForm = this.initMaterialForm();
    }

    public ngOnInit(): void {
        this.topic = this.route.snapshot.params.type;
        this.userId = this.route.snapshot.params.userId;
        this.materialId = this.route.snapshot.params.materialId;

        this.checkBadUrl();
        this.getEmployeeItems();

        this.pageTitle = 'Новий матеріал';

        this.materialForm.enable();

        if (this.topic === 'edit' || this.topic === 'details' || this.topic === 'send') {
            this.pageTitle = this.topic === 'edit' ? 'Редагування матеріалу' : 'Передача матеріалу';

            if (this.topic === 'details') {
                this.pageTitle = 'Картка матеріалу';
                this.materialForm.disable();
            }

            this.subs.add(this.materialService.getByMaterialId(this.materialId)
                .pipe(first())
                .subscribe((res: IMaterial) => {
                    this.material = res;
                    // console.log(this.material);
                    this.materialToSendInfo.next(
                        `ID - ${res.id}<br>
                        Найменування - ${res.title}<br>
                        Інв.№ - ${res.inventoryNumber}<br>`
                    );
                    this.qrCodeData.next(
                        `найменування: ${res.title}, ` +
                        `інвентарний №: ${res.inventoryNumber}`
                    );
                    this.materialForm.patchValue(res);
                }));
        }
    }

    public getEmployeeItems(): void {
        this.isLoading = true;
        this.subs.add(
            this.userService.getAll().subscribe((res: IUser[]) => {
                this.users = res;
                this.isLoading = false;
            }, () => {
                this.isLoading = false;
            }));
    }

    public getEmployeeById(id: number): string {
        const user = this.users?.find((el: IUser) => el.id === id);
        return `${user?.lastName} ${user?.firstName?.slice(0, 1)}.(${user?.id})`;
    }

    public onSubmit(): void {
        if (this.materialForm.invalid) {
            return;
        }
        if (this.topic === 'add') {
            this.createMaterial();
        } else if (this.topic === 'edit') {
            this.updateMaterial();
        } else if (this.topic === 'details') {
        } else if (this.topic === 'send') {
            this.sendMaterial();
        }
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public deleteMaterial(userId: number, materialId: number): void {
        if (confirm('Ви впевнені, що хочете видалити цей матеріал назавжди?')) {
            this.subs.add(this.materialService.delete(userId, materialId)
                .subscribe({
                    next: () => {
                        this.router.navigate(['dashboard', 'accountant']).then();
                    },
                    error: (error: Error) => {
                        this.notifierService.notify('error', error.message);
                    }
                }));
            // console.log('Thing was deleted to the database.');
        } else {
            // console.log('Thing was not deleted to the database.');
            return;
        }
    }

    private initMaterialForm(): any {
        return this.fb.group({
            title: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]),
            inventoryNumber: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30)
            ]),
            dateStart: new FormControl(new Date(), [
                Validators.required
            ]),
            type: new FormControl('', [Validators.required]),
            amount: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required]),
            userId: new FormControl('', [Validators.required])
        });
    }

    private createMaterial(): void {
        const selectedUser = this.materialForm.controls.userId.value;

        this.subs.add(this.materialService.create(selectedUser, this.materialForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', 'Матеріал створено!');
                    this.router.navigate(['dashboard', 'accountant']).then(() => {
                        window.location.reload();
                    });
                },
                error: (error: Error) => {
                    this.notifierService.notify('error', error?.message);
                }
            }));
    }

    private updateMaterial(): void {
        this.subs.add(this.materialService.update(this.userId, this.materialId, this.materialForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', 'Матеріал оновлено!');
                    this.router.navigate(
                        ['dashboard', 'accountant', 'user', this.userId, 'material', this.materialId, 'details'])
                        .then(() => {
                            window.location.reload();
                        });
                },
                error: (error: Error) => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    private sendMaterial(): void {
        const selectedUser = this.materialForm.controls.userId.value;

        this.subs.add(this.materialService.send(selectedUser, this.materialId, this.materialForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success',
                        `Матеріал відправлено користувачу ${this.getEmployeeById(selectedUser)}!`);
                    this.router.navigate(
                        ['dashboard', 'accountant', 'user', selectedUser, 'material', this.materialId, 'details'])
                        .then(() => {
                            window.location.reload();
                        });
                },
                error: (error: Error) => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    private checkBadUrl(): void {
        if (this.topic !== 'add' && this.topic !== 'edit' && this.topic !== 'send' && this.topic !== 'details') {
            this.router.navigate(['dashboard', 'accountant']).then();
        }
    }

    public get f(): any {
        return this.materialForm.controls;
    }
}
