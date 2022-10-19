import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IQrDialogData} from '../../interfaces/qr-dialog-data';

@Component({
    selector: 'app-qr-reader-modal',
    templateUrl: './qr-reader-modal.component.html',
    styleUrls: ['./qr-reader-modal.component.scss']
})
export class QrReaderModalComponent {
    public qrModalData: string = '';
    public showButtons: boolean = false;

    public constructor(
        public dialogRef: MatDialogRef<QrReaderModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IQrDialogData
    ) {
    }

    public scanSuccessHandler(event: any): void {
        // console.log(JSON.stringify(event));
        this.qrModalData = event;
        this.data.qrReadData = this.qrModalData.split('№: ')[1];
        this.showButtons = true;
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }
}
