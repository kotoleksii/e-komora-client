import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {DialogData} from '../../interfaces/dialog-data';
import {UntypedFormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-modal',
  templateUrl: './confirm-dialog-modal.component.html',
  styleUrls: ['./confirm-dialog-modal.component.scss']
})
export class ConfirmDialogModalComponent implements OnInit {
  public dialogData: DialogData | any;
  public title = '';
  public message = '';
  public confirmPhrase = '';

  public deleteForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    confirmPhrase: ['']
  });

  public itemId = 0;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ConfirmDialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.itemId = this.data.initialValue.id;
    this.deleteForm.controls.firstName.setValue(this.data.initialValue.firstName);
    this.deleteForm.controls.lastName.setValue(this.data.initialValue.lastName);
    this.confirmPhrase = this.data.initialValue.lastName + this.data.initialValue.firstName;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
