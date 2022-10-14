import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {NotifierService} from 'angular-notifier';
import {MaterialService} from '../../../../../shared/_services/material.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {IUser} from '../../../../../shared/interfaces/user';
import {UserService} from '../../../../../shared/_services/user.service';
import {IMaterial} from '../../../../../shared/interfaces/material';

@Component({
    selector: 'app-material-action-form',
    templateUrl: './material-action-form.component.html',
    styleUrls: ['./material-action-form.component.scss']
})
export class MaterialActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public materialForm: FormGroup | any;
    public material: IMaterial | any;
    public users?: IUser[];
    public userId: number = 0;
    public materialId: number = 0;
    public types: string[] = ['шт.', 'од.', 'кг', 'м'];
    public topics: string[] = ['add', 'edit', 'details'];
    public topic: string = '';
    public pageTitle: string = '';

    public constructor(private materialService: MaterialService,
                       private userService: UserService,
                       private fb: FormBuilder,
                       public dialog: MatDialog,
                       private notifierService: NotifierService,
                       private route: ActivatedRoute,
                       private router: Router) {
    }

    public ngOnInit(): void {
        this.topic = this.route.snapshot.params.type;
        this.userId = this.route.snapshot.params.userId;
        this.materialId = this.route.snapshot.params.materialId;

        this.materialForm = this.initMaterialForm();
        this.getEmployeeItems();

        this.pageTitle = 'Новий матеріал';

        this.materialForm.enable();

        if (this.topic === 'edit' || this.topic === 'details') {
            this.pageTitle = this.topic === 'edit' ? 'Редагування матеріалу' : 'Картка матеріалу';

            if (this.topic === 'details') {
                this.materialForm.disable();
            }

            this.subs.add(this.materialService.getByMaterialId(this.materialId)
                .pipe(first())
                .subscribe((res: IMaterial) => {
                    this.material = res;
                    // console.log(this.material);

                    this.materialForm.patchValue(res);
                }));
        }
    }

    public getEmployeeItems(): void {
        this.subs.add(
            this.userService.getAll().subscribe((res: IUser[]) => {
                this.users = res;
            }));
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
        }
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public deleteMaterial(userId: number, materialId: number): void {
        if (confirm('Are you sure you want to delete this thing into the database?')) {
            this.subs.add(this.materialService.delete(userId, materialId)
                .subscribe({
                    next: () => {
                        this.router.navigate(['dashboard', 'accountant']).then();
                    },
                    error: (error) => {
                        this.notifierService.notify('error', error.message);
                    }
                }));
            // console.log('Thing was deleted to the database.');
        } else {
            // console.log('Thing was not deleted to the database.');
            return;
        }
    }

    private initMaterialForm(): FormGroup {
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
            type: new FormControl(''),
            amount: new FormControl(''),
            price: new FormControl(''),
            userId: new FormControl('')
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
                error: (error) => {
                    this.notifierService.notify('error', error.message);
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
                error: (error) => {
                    this.notifierService.notify('error', error.message);
                }
            }));
    }

    public get f(): FormControl {
        return this.materialForm.controls;
    }
}
