import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-mismatchdialog',
  templateUrl: './mismatch-dialog.component.html',
  styleUrls: ['./mismatch-dialog.component.css']
})
export class MismatchDialogComponent implements OnInit {


  status = 'Close';
  isCloseComplaint = false;
  declartionForm: FormGroup;
  oldPremium;
  newPremium;
  message;


  constructor(
    private dialogRef: MatDialogRef<MismatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
    this.oldPremium = data.oldPremium;
    this.newPremium = data.newPremium;
  }

  ngOnInit(): void { }

  agreeClick() {
    this.dialogRef.close('yes');
  }

}
