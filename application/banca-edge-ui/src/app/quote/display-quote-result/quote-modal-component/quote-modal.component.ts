import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldModalComponent } from '@app/shared/components/common-field-modal/field-modal/field-modal.component';
@Component({
  selector: 'app-quote-modal',
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.css']
})
export class QuoteModalComponent implements OnInit {
    constructor( public dialogRef: MatDialogRef<FieldModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,){}
    ngOnInit(): void {
        console.log(this.data.content)
    }

    onClose(){
        this.dialogRef.close() 
    }
}