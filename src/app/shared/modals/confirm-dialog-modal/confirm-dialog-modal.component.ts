import {Component, Inject, OnInit} from '@angular/core';
import {IDialogData} from '../../interfaces/dialog-data';
import {UntypedFormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-dialog-modal',
    templateUrl: './confirm-dialog-modal.component.html',
    styleUrls: ['./confirm-dialog-modal.component.scss']
})
export class ConfirmDialogModalComponent implements OnInit {
    public dialogData: IDialogData | any;
    public title: string = '';
    public message: string = '';
    public confirmPhrase: string = '';

    public deleteForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        confirmPhrase: ['']
    });

    public itemId = 0;

    public constructor(
        private fb: UntypedFormBuilder,
        public dialogRef: MatDialogRef<ConfirmDialogModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IDialogData) {
    }

    public ngOnInit(): void {
        this.itemId = this.data.initialValue.id;
        this.deleteForm.controls.firstName.setValue(this.data.initialValue.firstName);
        this.deleteForm.controls.lastName.setValue(this.data.initialValue.lastName);
        this.confirmPhrase = this.data.initialValue.lastName + this.data.initialValue.firstName;
    }

    public onConfirm(): void {
        this.dialogRef.close(true);
    }

    public onDismiss(): void {
        this.dialogRef.close(false);
    }
}
