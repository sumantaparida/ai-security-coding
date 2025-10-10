import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ComplaintDataService } from '../complaint-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-home-complaint',
  templateUrl: './home-complaint.component.html',
  styleUrls: ['./home-complaint.component.css'],
})
export class HomeComplaintComponent implements OnInit {
  state = 'policy';

  policyDetails;

  complaintForm: FormGroup;

  isLoading;

  applicationNo;

  filePath: string;

  constructor(
    private complaintData: ComplaintDataService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.complaintForm = new FormGroup({
      policyNumber: new FormControl('', [Validators.required, Validators.pattern('.*')]),
      detailsCorrection: new FormControl('', [Validators.required]),
      customerMailId: new FormControl('', [Validators.required, Validators.email]),
      complaintAgainst: new FormControl('', [Validators.required]),
      complaintMode: new FormControl('', [Validators.required]),
      complaintNature: new FormControl('', [Validators.required]),
      uploadDocument: new FormControl('', [Validators.required]),
    });

    console.log('form', this.complaintForm);
  }

  getPath(path) {
    this.filePath = path;
  }

  setState(event) {
    console.log('hi hi', event);
    if (event === 'yes') {
      this.state = 'customerMail';
    } else if (event === 'no') {
      this.state = 'policy';
    }
  }

  stateTransition() {
    if (this.state === 'policy') {
      if (this.complaintForm.get('policyNumber').valid) {
        this.isLoading = true;
        this.route.queryParams.subscribe((params) => {
          if (params.complaintNo) {
            this.applicationNo = params.complaintNo;
            this.complaintData.getApplicationDetails(this.applicationNo).subscribe(
              (data) => {
                console.log('api application data', data);
                this.isLoading = false;
                this.policyDetails = data;

                this.state = 'detailsCorrection';
              },
              (error) => {
                console.log(error, 'this is error');
                if (error.error.message === 'Policy Not Found') {
                  this.isLoading = false;
                  this.complaintForm
                    .get('policyNumber')
                    .setErrors({ invalidPolicyNumber: true, errorDetails: error.error.details[0] });
                  console.log(this.complaintForm);
                }
              },
            );
          } else {
            this.complaintData
              .getPolicyDetails(this.complaintForm.get('policyNumber').value)
              .subscribe(
                (data) => {
                  console.log('api data', data);
                  this.isLoading = false;
                  this.policyDetails = data;
                  this.state = 'detailsCorrection';
                },
                (error) => {
                  console.log(error, 'this is error');
                  if (error.error.message === 'Policy Not Found') {
                    this.isLoading = false;
                    this.complaintForm.get('policyNumber').setErrors({
                      invalidPolicyNumber: true,
                      errorDetails: error.error.details[0],
                    });
                    console.log(this.complaintForm);
                  }
                },
              );
          }
        });
      } else {
        this.complaintForm.get('policyNumber').markAsDirty();
      }
    } else if (this.state === 'detailsCorrection') {
      if (this.complaintForm.get('detailsCorrection').valid) {
        this.state = 'customerMail';
      } else {
        this.complaintForm.get('detailsCorrection').markAsDirty();
      }
    } else if (this.state === 'customerMail') {
      if (this.complaintForm.get('customerMailId').valid) {
        this.state = 'complaintAgainst';
      } else {
        this.complaintForm.get('customerMailId').markAsDirty();
      }
      // complaint against
    } else if (this.state === 'complaintAgainst') {
      if (this.complaintForm.get('complaintAgainst').valid) {
        this.state = 'complaintMode';
      } else {
        this.complaintForm.get('complaintAgainst').markAsDirty();
      }
      // complaint mode
    } else if (this.state === 'complaintMode') {
      if (this.complaintForm.get('complaintMode').valid) {
        // if(this.complaintForm.get('complaintMode').value === 'other'){}
        this.state = 'complaintNature';
      } else {
        this.complaintForm.get('complaintMode').markAsDirty();
      }
      // complaint nature
    } else if (this.state === 'complaintNature') {
      if (this.complaintForm.get('complaintNature').valid) {
        this.state = 'uploadDocument';
      } else {
        this.complaintForm.get('complaintNature').markAsDirty();
      }
      // upload document
    } else if (this.state === 'uploadDocument') {
      if (this.complaintForm.get('uploadDocument').valid) {
        this.state = 'viewComplaint';
        this.complaintData.addComplaintDetails();
      } else {
        this.complaintForm.get('uploadDocument').markAsDirty();
      }
    }

    if (this.state === 'viewComplaint') {
      const data = {
        policyNo: this.complaintForm.get('policyNumber').value,
        complaintAgainst: this.complaintForm.get('complaintAgainst').value,
        receiptMode: this.complaintForm.get('complaintMode').value,
        complaintNature: this.complaintForm.get('complaintNature').value,
        complaintStatus: 'Open',
        documents: [],
      };

      if (this.complaintForm.get('uploadDocument').value === 'yes') {
        data.documents.push({
          documentName: 'Complaint Letter',
          documentUrl: this.filePath,
        });
      }
      if (this.complaintForm.get('complaintAgainst').value === 'Others') {
        data['otherComplaintAgainst'] = this.complaintForm.get('otherComplaintAgainst').value;
      }
      if (this.complaintForm.get('complaintMode').value === 'Others') {
        data['otherReceiptMode'] = this.complaintForm.get('otherComplaintMode').value;
      }
      if (this.complaintForm.get('complaintNature').value === 'Others') {
        data['complaintDescription'] = this.complaintForm.get('otherComplaintNature').value;
      } else if (this.complaintForm.get('complaintNature').value === 'Claim') {
        data['complaintDescription'] = this.complaintForm.get('claimDescriptive').value;
        data['claimNumber'] = this.complaintForm.get('claimNumber').value;
      }
      this.loaderService.showSpinner(true);
      this.complaintData.addComplaint(data, this.policyDetails.applicationNo).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          this.isLoading = false;
          console.log('the response', res);
          this.router.navigate(['/mycomplaints/view-complaint']);
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    } else if (this.state === 'viewComplaint' && this.complaintData.isComplaintDataValid()) {
      alert('All fields are need to be filled.');
    }
  }

  cancelComplaintCreation() {
    this.complaintForm.reset();
    this.router.navigate(['/mycomplaints/view-complaint']);
  }

  showOrHideNextBtn() {
    if (this.state === 'policy') {
      if (this.complaintForm.get('policyNumber').valid) {
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'customerMail') {
      if (this.complaintForm.get('customerMailId').valid) {
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'complaintAgainst') {
      if (this.complaintForm.get('complaintAgainst').valid) {
        if (this.complaintForm.get('complaintAgainst').value === 'Others') {
          if (this.complaintForm.get('otherComplaintAgainst').valid) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'complaintMode') {
      if (this.complaintForm.get('complaintMode').valid) {
        if (this.complaintForm.get('complaintMode').value === 'Others') {
          if (this.complaintForm.get('otherComplaintMode').valid) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'complaintNature') {
      if (this.complaintForm.get('complaintNature').valid) {
        if (this.complaintForm.get('complaintNature').value === 'Others') {
          if (this.complaintForm.get('otherComplaintNature').valid) {
            return true;
          } else {
            return false;
          }
        } else if (this.complaintForm.get('complaintNature').value === 'Claim') {
          if (
            this.complaintForm.get('claimNumber').valid &&
            this.complaintForm.get('claimDescriptive').valid
          ) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'uploadDocument') {
      if (
        this.complaintForm.get('uploadDocument').value === 'yes' &&
        !this.complaintForm.contains('fileUpload')
      ) {
        return true;
      } else if (this.complaintForm.get('uploadDocument').value === 'no') {
        return true;
      } else {
        return false;
      }
    }
  }
}
