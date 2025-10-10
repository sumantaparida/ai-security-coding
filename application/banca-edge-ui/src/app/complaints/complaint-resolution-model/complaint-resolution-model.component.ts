import { Component, OnInit, Inject } from '@angular/core';
import { ComplaintDataService } from '../complaint-data.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-complaint-resolution-model',
  templateUrl: './complaint-resolution-model.component.html',
  styleUrls: ['./complaint-resolution-model.component.css']
})
export class ComplaintResolutionModelComponent implements OnInit {

  status = 'Close';
  isCloseComplaint = false;
  complaintForm: FormGroup;


  constructor(private complaintDataServ: ComplaintDataService, private dialogRef: MatDialogRef<ComplaintResolutionModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.complaintForm = new FormGroup({
      resolutionComplaint: new FormControl('', [Validators.required])
    })
  }


  onSaveStatus() {
    this.isCloseComplaint = true;
    if (this.complaintForm.valid) {
      this.dialogRef.close(this.complaintForm.get('resolutionComplaint').value);
    } else {
      alert('Please enter the Complaint Resolution');
    }
  }
}

