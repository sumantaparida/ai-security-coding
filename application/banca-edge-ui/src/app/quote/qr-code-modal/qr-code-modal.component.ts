import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-qr-code-modal',
    templateUrl: './qr-code-modal.component.html',
    styleUrls: ['./qr-code-modal.component.css']
})
export class QrCodeModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<QrCodeModalComponent>
    ) { }

    ngOnInit() {
        console.log(this.data);
    }

    onOkClicked() {
        this.dialogRef.close();
    }
}
