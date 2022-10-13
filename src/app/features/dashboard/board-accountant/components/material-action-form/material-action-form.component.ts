import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubSink} from 'subsink';
import {NotifierService} from 'angular-notifier';
import {MaterialService} from '../../../../../shared/_services/material.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-material-action-form',
    templateUrl: './material-action-form.component.html',
    styleUrls: ['./material-action-form.component.scss']
})
export class MaterialActionFormComponent implements OnInit, OnDestroy {
    private subs: SubSink = new SubSink();
    public materialForm: any;
    public material: any;
    public userId: number = 0;
    public materialId: number = 0;
    public types = ['шт.', 'од.', 'кг', 'м'];
    public topics = ['add', 'edit', 'details'];
    public topic = '';
    public pageTitle: string = '';

    constructor(private materialService: MaterialService,
                private fb: FormBuilder,
                public dialog: MatDialog,
                private notifierService: NotifierService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.topic = this.route.snapshot.params.type;
        this.userId = this.route.snapshot.params.userId;
        this.materialId = this.route.snapshot.params.materialId;

        this.materialForm = this.initMaterialForm();

        this.pageTitle = 'Новий матеріал';

        this.materialForm.enable();

        if (this.topic === 'edit' || this.topic === 'details') {
            this.pageTitle = this.topic === 'edit' ? 'Редагування матеріалу' : 'Картка матеріалу';

            if (this.topic === 'details') {
                this.materialForm.disable();
            }

            this.subs.add(this.materialService.getByUserId(this.userId)
                .pipe(first())
                .subscribe((res) => {
                    this.material = res;
                    console.log(this.material);

                    this.materialForm.patchValue(res[0]);
                }));
        }
    }

    private initMaterialForm(): FormGroup {
        return this.fb.group({
            title: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
            ]),
            inventoryNumber: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
            ]),
            dateStart: new FormControl(new Date(), [
                Validators.required,
            ]),
            type: new FormControl(''),
            amount: new FormControl(''),
            price: new FormControl(''),
        });
    }

    get f(): FormControl {
        return this.materialForm.controls;
    }

    onSubmit(): void {
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

    private createMaterial(): void {
        this.subs.add(this.materialService.create(this.userId, this.materialForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `Матеріал створено!`);
                    this.router.navigate(['dashboard', 'accountant']).then(() => {
                        window.location.reload();
                    });
                },
                error: error => {
                    this.notifierService.notify('error', error);
                }
            }));
    }

    private updateMaterial(): void {
        this.subs.add(this.materialService.update(this.userId, this.materialId, this.materialForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifierService.notify('success', `Матеріал оновлено!`);
                    this.router.navigate(['dashboard', 'accountant', 'user', this.userId, 'material', this.materialId, 'details']).then(() => {
                        window.location.reload();
                    });
                },
                error: error => {
                    this.notifierService.notify('error', error);
                }
            }));
    }

    deleteMaterial(userId: number, materialId: number): void {
        this.subs.add(this.materialService.delete(userId, materialId)
            .subscribe({
                next: () => {
                    this.router.navigate(['dashboard', 'accountant']).then();
                },
                error: (e) => console.error(e)
            }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
