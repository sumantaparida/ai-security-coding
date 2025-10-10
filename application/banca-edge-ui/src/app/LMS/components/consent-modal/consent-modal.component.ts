import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.css'],
})
export class ConsentModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ConsentModalComponent>,
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  onAgreeClicked() {
    this.dialogRef.close(true);
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }
}
