import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QrReaderModalComponent} from './qr-reader-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [QrReaderModalComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ZXingScannerModule,
        FormsModule,
        MatButtonModule
    ]
})
export class QrReaderModalModule {
}
