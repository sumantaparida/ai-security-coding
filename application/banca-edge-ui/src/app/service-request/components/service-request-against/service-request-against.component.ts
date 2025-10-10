import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ServiceRequestDataService } from '../../services/service-request-data.service';
import { UploadDocumentService } from '@app/_services/upload-document.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-service-request-against',
  templateUrl: './service-request-against.component.html',
  styleUrls: ['./service-request-against.component.css'],
  animations: [
    trigger('serviceRequestAgainstShowHide', [
      state(
        'serviceRequestAgainst',
        style({
          // display: 'block',
          display: 'block',
          opacity: 1,
          marginTop: '0px',
        }),
      ),
      state(
        'serviceRequestMode',
        style({
          // display: 'none',
          display: 'none',
          opacity: 0,
          marginTop: '-150px',
        }),
      ),
      state(
        '*',
        style({
          marginTop: '150px',
          display: 'none',
          opacity: 0,
        }),
      ),
      transition('serviceRequestAgainst <=> *', [animate('1s')]),
    ]),
  ],
})
export class ServiceRequestAgainstComponent {
  @Input() state;

  @Input() form: FormGroup;

  @Input() serviceNatureRequest;

  @Input() isLoading;

  @Input() documentArray;

  @Output() docs = new EventEmitter();

  selectPosition;

  otherServiceRequest = false;

  selectedValue: string;

  productType = '';

  requestType = '';

  lob = '';

  processLink = '';

  claimIcons = false;

  serviceRequestForm: FormGroup;

  showUploadBtn = false;

  serviceRequestId;

  documentTypeId;

  documentName;

  fileToUpload;

  document;

  docsToUpload = [];

  constructor(
    private serviceRequestData: ServiceRequestDataService,
    private uploadDocumentService: UploadDocumentService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    @Inject(DOCUMENT) document,
  ) {
    this.document = document;
  }

  changeOption(e) {
    // console.log(e, 'value e');
    const opt = this.form.get('serviceRequestAgainst').value;
    const data = {
      policyNo: this.form.get('policyNumber').value,
      requestType: opt,
    };

    this.loaderService.showSpinner(true);
    this.serviceRequestData.addRequest(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        // console.log('the response', res);
        this.serviceRequestId = res['id'];
        sessionStorage.setItem('serviceRequestId', res['id']);
        sessionStorage.setItem('customerName', res['customerName']);
      },
      () => {
        return false;
      },
    );

    this.form.addControl(
      'otherServiceRequestAgainst',
      new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1500),
      ]),
    );

    this.form.get('serviceRequestAgainst').setValue(e.value);
    this.otherServiceRequest = true;
    this.serviceRequestData.setComplaintInfo(
      'serviceRequestAgainst',
      this.form.get('serviceRequestAgainst').value,
    );

    this.serviceNatureRequest.forEach((value) => {
      if (e.value === value['desc']) {
        // const that = this;
        sessionStorage.setItem('documentArray', JSON.stringify(value['requiredDocs']));
        // console.log("process link",value['processLink']);
        // console.log("type of ",typeof value['processLink']);
        sessionStorage.setItem('processLink', value['processLink']);
        sessionStorage.setItem('productType', value['productType']);
        sessionStorage.setItem('requestType', value['requestType']);
        sessionStorage.setItem('lob', value['lob']);
      }
    });

    // console.log(this.documentArray);
    // console.log("sessionStorage doc",JSON.parse(sessionStorage.getItem('documentArray')));
    this.documentArray = JSON.parse(sessionStorage.getItem('documentArray'));
    this.processLink = sessionStorage.getItem('processLink');
    this.productType = sessionStorage.getItem('productType');
    this.requestType = sessionStorage.getItem('requestType');
    this.lob = sessionStorage.getItem('lob');
    // this.serviceRequestId = 1;
    // console.log("document array",this.documentArray);
    // console.log("sessionStorage processLink",sessionStorage.getItem('processLink'));
    // console.log('processLink', this.processLink);
    // console.log('product type', this.productType);
    // console.log('request type', this.requestType);
    // console.log('lob', this.lob);
    // console.log('service_id', this.serviceRequestId);
    this.claimIcons = false;
    if (!this.processLink) {
      // console.log('setting claim icon');
      this.claimIcons = true;
    }

    const that = this;
    this.documentArray.forEach((value, key) => {
      console.log('adding key', key);
      that.form.addControl('document_' + key, new FormControl('', [Validators.required]));
    });
  }

  selectFile(file: any, id: number, index: number, desc: string) {
    // if (event.target.files.length > 0) {
    // const file = event.target.files[0];
    // console.log(file);
    this.fileToUpload = file.target.files[0];
    this.documentTypeId = id;
    this.documentName = desc;
    this.document.getElementById('button_' + index).disabled = false;
    // this.form.get('button_'+index).disable(false);
    // }
  }

  handleUpload(event, docDesc, fileIndex) {
    console.log('got the file', event);
    const file = event.target.files[0];
    const doc = { documentName: docDesc, documentUrl: '', docBase64: '', fileName: file.name };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      doc.docBase64 = <string>reader.result;
      this.docsToUpload[fileIndex] = doc;
    };
  }

  uploadFile(docIndex) {
    console.log('docs', this.docsToUpload);

    const data = {
      docName: this.docsToUpload[docIndex].documentName,
      path: `Requests/${this.docsToUpload[docIndex].fileName}`,
      data: this.docsToUpload[docIndex].docBase64.split(';base64,')[1],
    };

    this.loaderService.showSpinner(true);
    this.uploadDocumentService.uploadFile(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        console.log('upload successful', res);
        if (res['status'] === 200) {
          this.docsToUpload[docIndex].documentUrl = res['path'];
          this.docs.emit(this.docsToUpload);
        } else {
          const message = 'Unable to upload Document currently. Please try after sometime.';
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        }
        // console.log('upload successful');
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: error.error.details,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe(() => {
          // navigate
        });
      },
    );
  }
}
