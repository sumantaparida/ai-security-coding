import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-policy-error-modal',
    templateUrl: './policy-error-modal.component.html',
    styleUrls: ['./policy-error-modal.component.css']
})
export class PolicyErrorModal2Component implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<PolicyErrorModal2Component>
    ) { }

    ngOnInit() {
    }

    onOkClicked() {
        this.dialogRef.close();
    }
}
