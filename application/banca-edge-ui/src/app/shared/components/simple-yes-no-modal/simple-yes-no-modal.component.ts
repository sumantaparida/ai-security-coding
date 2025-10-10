import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-simple-yes-no-modal',
    templateUrl: './simple-yes-no-modal.component.html',
    styleUrls: ['./simple-yes-no-modal.component.css']
})
export class SimpleYesNoModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<SimpleYesNoModalComponent>
    ) { }

    ngOnInit() {
        console.log('got the data', this.data);
    }

    onClick(type) {
        this.dialogRef.close(type);
    }
}
