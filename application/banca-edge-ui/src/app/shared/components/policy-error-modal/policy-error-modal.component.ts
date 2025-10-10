import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-policy-error-modal',
  templateUrl: './policy-error-modal.component.html',
  styleUrls: ['./policy-error-modal.component.css'],
})
export class PolicyErrorModalComponent implements OnInit {
  isTrue = false;

  link;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PolicyErrorModalComponent>,
  ) {}

  ngOnInit() {
    if (this.data?.hasOwnProperty('message')) {
      this.link = this.data.link ? this.data.link : '';
      this.isTrue = this.data['isTrue'];
      this.data = this.data.message;
    }
  }

  onOkClicked(type?) {
    if (type === 'Online') {
      this.dialogRef.close('Online');
    } else if (type === 'cancel') {
      return 'cancel';
    } else {
      this.dialogRef.close(null);
    }
  }
}
