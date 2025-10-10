import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceRequestDataService } from '../../services/service-request-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

import { LoaderService } from '@app/_services/loader.service';
@Component({
  selector: 'app-home-service-request',
  templateUrl: './home-service-request.component.html',
  styleUrls: ['./home-service-request.component.css'],
})
export class HomeServiceRequestComponent implements OnInit {
  state = 'policy';

  policyDetails;

  serviceRequestForm: FormGroup;

  isLoading;

  serviceNatureRequest;

  documentArray;

  uploadedDocuments = [];

  constructor(
    private serviceRequestData: ServiceRequestDataService,
    private router: Router,
    public dialog: MatDialog,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    // console.log('url complaint is', this.router.url);
    this.serviceRequestForm = new FormGroup({
      policyNumber: new FormControl('', [Validators.required, Validators.pattern('.*')]),
      detailsCorrection: new FormControl('', [Validators.required]),
      customerMailId: new FormControl('', [Validators.required, Validators.email]),
      serviceRequestAgainst: new FormControl('', [Validators.required]),
      serviceRequestMode: new FormControl('', [Validators.required]),
      serviceRequestNature: new FormControl('', [Validators.required]),
      uploadDocument: new FormControl('', [Validators.required]),
    });

    // Validators.pattern('[A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
    // console.log('form', this.serviceRequestForm);
  }

  onDocsUploaded(event) {
    this.uploadedDocuments = event;
  }

  setState(event) {
    // console.log('hi hi', event);
    if (event === 'yes') {
      this.state = 'serviceRequestAgainst';
      this.loaderService.showSpinner(true);
      this.serviceRequestData
        .getServiceNatureRequest(this.serviceRequestForm.get('policyNumber').value)
        .subscribe(
          (data) => {
            this.loaderService.showSpinner(false);
            this.serviceNatureRequest = data;
            // console.log(this.serviceNatureRequest, 'service nature of request fetch');
          },
          (error) => {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: error.error.details,
              panelClass: 'dialog-width',
            });
            dialogRef.afterClosed().subscribe((data) => {
              // navigate
            });
          },
        );
    } else if (event === 'no') {
      this.state = 'policy';
    }
  }

  stateTransition() {
    if (this.state === 'policy') {
      if (this.serviceRequestForm.get('policyNumber').valid) {
        this.loaderService.showSpinner(true);
        this.serviceRequestData
          .getPolicyDetails(this.serviceRequestForm.get('policyNumber').value)
          .subscribe(
            (data) => {
              // console.log('api data', data);
              this.loaderService.showSpinner(false);
              this.policyDetails = data;
              // sessionStorage.setItem('service_id',this.policyDetails.id);
              this.state = 'detailsCorrection';
            },
            (error) => {
              this.loaderService.showSpinner(false);
              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: error.error.details,
                panelClass: 'dialog-width',
              });
              dialogRef.afterClosed().subscribe((data) => {
                // navigate
              });
            },
          );
      } else {
        this.serviceRequestForm.get('policyNumber').markAsDirty();
      }
    } else if (this.state === 'detailsCorrection') {
      // console.log('in detail correction');
      if (this.serviceRequestForm.get('detailsCorrection').valid) {
        // console.log('in detail correction is valid');
        this.state = 'serviceRequestAgainst';
      } else {
        this.serviceRequestForm.get('detailsCorrection').markAsDirty();
      }
    } else if (this.state === 'serviceRequestAgainst') {
      // console.log('in service request');
      if (
        this.serviceRequestForm.get('serviceRequestAgainst').valid &&
        this.serviceRequestForm.get('otherServiceRequestAgainst').valid
      ) {
        // console.log('in service request is valid');
        this.state = 'viewServiceRequest';
      } else {
        this.serviceRequestForm.get('serviceRequestAgainst').markAsDirty();
        this.serviceRequestForm.get('otherServiceRequestAgainst').markAsDirty();
      }
    } else if (this.state === 'uploadDocument') {
      if (this.serviceRequestForm.get('uploadDocument').valid) {
        this.state = 'viewServiceRequest';
        this.serviceRequestData.addComplaintDetails();
      } else {
        this.serviceRequestForm.get('uploadDocument').markAsDirty();
      }
    }

    if (this.state === 'viewServiceRequest') {
      const data = {
        policyNo: this.serviceRequestForm.get('policyNumber').value,
        requestType: this.serviceRequestForm.get('serviceRequestAgainst').value,
      };
      data['description'] = this.serviceRequestForm.get('otherServiceRequestAgainst').value;
      data['customerName'] = sessionStorage.getItem('customerName');
      data['id'] = sessionStorage.getItem('serviceRequestId');
      data['documents'] = [];

      this.uploadedDocuments.forEach((doc, key) => {
        const eachDoc = { documentName: doc.documentName, documentUrl: doc.documentUrl };
        data['documents'].push(eachDoc);
      });

      this.loaderService.showSpinner(true);
      this.serviceRequestData.updateRequest(data).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          // console.log('the response', res);
          sessionStorage.removeItem('customerName');
          sessionStorage.removeItem('serviceRequestId');
          sessionStorage.removeItem('lob');
          sessionStorage.removeItem('documentArray');
          sessionStorage.removeItem('productType');
          sessionStorage.removeItem('requestType');
          sessionStorage.removeItem('processLink');
          this.router.navigate(['/myrequest/view-service-request']);
        },
        (error) => {
          this.loaderService.showSpinner(false);
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: error.error.details,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(() => {
            // navigate
            // console.log(data);
          });
        },
      );
    } else if (
      this.state === 'viewServiceRequest' &&
      this.serviceRequestData.isComplaintDataValid()
    ) {
      alert('All fields are need to be filled.');
    }
  }

  cancelComplaintCreation() {
    this.serviceRequestForm.reset();
    this.router.navigate(['/myrequest/view-service-request']);
  }

  showOrHideNextBtn() {
    if (this.state === 'policy') {
      if (this.serviceRequestForm.get('policyNumber').valid) {
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'customerMail') {
      if (this.serviceRequestForm.get('customerMailId').valid) {
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'serviceRequestAgainst') {
      if (
        this.serviceRequestForm.get('serviceRequestAgainst').valid &&
        this.serviceRequestForm.get('otherServiceRequestAgainst').valid
      ) {
        // if (this.serviceRequestForm.get('serviceRequestAgainst').value === 'Others') {
        // if (this.serviceRequestForm.get('otherServiceRequestAgainst').valid) {
        // return true;
        // } else {
        // return false;
        // }
        return true;
      } else {
        return false;
      }
    }
    if (this.state === 'serviceRequestMode') {
      if (this.serviceRequestForm.get('serviceRequestMode').valid) {
        if (this.serviceRequestForm.get('serviceRequestMode').value === 'Others') {
          if (this.serviceRequestForm.get('otherServiceRequestMode').valid) {
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
    if (this.state === 'serviceRequestNature') {
      if (this.serviceRequestForm.get('serviceRequestNature').valid) {
        if (this.serviceRequestForm.get('serviceRequestNature').value === 'Others') {
          if (this.serviceRequestForm.get('otherServiceRequestNature').valid) {
            return true;
          } else {
            return false;
          }
        } else if (this.serviceRequestForm.get('serviceRequestNature').value === 'Claim') {
          if (
            this.serviceRequestForm.get('claimNumber').valid &&
            this.serviceRequestForm.get('claimDescriptive').valid
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
      if (this.serviceRequestForm.get('uploadDocument').valid) {
        return true;
      } else {
        return false;
      }
    }
  }
}
