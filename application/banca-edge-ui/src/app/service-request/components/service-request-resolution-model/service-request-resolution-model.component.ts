import { Component, OnInit, Inject } from '@angular/core';
import { ServiceRequestDataService } from '../../services/service-request-data.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-request-resolution-model',
  templateUrl: './service-request-resolution-model.component.html',
  styleUrls: ['./service-request-resolution-model.component.css']
})
export class ServiceRequestResolutionModelComponent implements OnInit {

  status = 'Close';
  isCloseServiceRequest = false;
  serviceRequestForm: FormGroup;


  constructor(
    private complaintDataServ: ServiceRequestDataService,
    private dialogRef: MatDialogRef<ServiceRequestResolutionModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.serviceRequestForm = new FormGroup({
      resolutionServiceRequest: new FormControl('', [Validators.required])
    });
  }


  onSaveStatus() {
    this.isCloseServiceRequest = true;
    if (this.serviceRequestForm.valid) {
      this.dialogRef.close(this.serviceRequestForm.get('resolutionServiceRequest').value);
    } else {
      alert('Please enter the Service Request Resolution');
    }
  }
}

