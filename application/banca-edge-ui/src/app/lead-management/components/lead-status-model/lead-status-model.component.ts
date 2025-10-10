import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-lead-status-model',
  templateUrl: './lead-status-model.component.html',
  styleUrls: ['./lead-status-model.component.css']
})
export class LeadStatusModelComponent implements OnInit {

  policyDetails;

  leadStatusForm = this.fb.group({
    leadStatus: ['', Validators.required],
    comment: ['', Validators.required]
  });
  constructor(
    private dialogRef: MatDialogRef<LeadStatusModelComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }


  leadStatus = [
    {
      id: 1,
      value: 'Initiated'
    },
    {
      id: 2,
      value: 'Quote'
    },
    {
      id: 3,
      value: 'Proposal'
    },
    {
      id: 4,
      value: 'Issued'
    },
    {
      id: 12,
      value: 'Customer Not Interested'
    },
  ];



  ngOnInit(): void {
    this.data.online = true;
    this.policyDetails = this.data;
    if (this.policyDetails.online === true) {
      this.leadStatus = this.leadStatus.filter(element => element.id === 12);
    } else {
      this.leadStatusForm.addControl('grossPremium', new FormControl('', Validators.required));
      this.leadStatusForm.addControl('policyStartDate', new FormControl('', Validators.required));
      this.leadStatusForm.addControl('policyEndDate', new FormControl('', Validators.required));
    }
  }

  onUpdateClicked() {
    const enteredData = {
      status: '',
      comments: '',
      statusCode: 0,
      grossPremium: 0,
      policyStartDate: '',
      policyEndDate: '',
    };
    enteredData.statusCode = this.leadStatusForm.get('leadStatus').value;
    enteredData.status = this.leadStatus.find(status => status.id === this.leadStatusForm.get('leadStatus').value).value;
    enteredData.comments = this.leadStatusForm.get('comment').value;
    if (this.policyDetails.online === false && this.leadStatusForm.get('leadStatus').value === 4) {
      enteredData.grossPremium = this.leadStatusForm.get('grossPremium').value;
      enteredData.policyStartDate = this.leadStatusForm.get('policyStartDate').value;
      enteredData.policyEndDate = this.leadStatusForm.get('policyEndDate').value;
    }
    this.dialogRef.close(enteredData);
  }

  onCancelClicked() {
    this.dialogRef.close(null);
  }
}


