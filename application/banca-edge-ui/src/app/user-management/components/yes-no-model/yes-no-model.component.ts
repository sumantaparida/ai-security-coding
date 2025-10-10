import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-yes-no-model',
  templateUrl: './yes-no-model.component.html',
  styleUrls: ['./yes-no-model.component.css']
})
export class YesNoModelComponent implements OnInit {

  isTrue = false;

  link;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<PolicyErrorModalComponent>,
  ) { }

  ngOnInit() {

  }

  onOkClicked(type?) {
    if (type === 'single') {
      this.dialogRef.close('single');
    } else {
      this.dialogRef.close('bulk');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
