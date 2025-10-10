import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-policy-prompt-modal',
    templateUrl: './policy-prompt-modal.component.html',
    styleUrls: ['./policy-prompt-modal.component.css']
})
export class PolicyPromptModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<PolicyPromptModalComponent>
    ) { }

    ngOnInit() {
        console.log('got the data', this.data);
    }

    onClick(type) {
        this.dialogRef.close(type);
    }

    onNoClick(close){
        this.dialogRef.close(close)
    }

}
