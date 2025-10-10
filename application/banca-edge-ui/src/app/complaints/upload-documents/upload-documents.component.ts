import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { MaterialFileInputModule } from 'ngx-material-file-input';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ComplaintDataService } from '../complaint-data.service';
import { UploadDocumentService } from '@app/_services/upload-document.service';
import { LoaderService } from '@app/_services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css'],
  animations: [
    trigger('uploadDocumentShowHide', [
      state(
        'uploadDocument',
        style({
          // display: 'block',
          display: 'block',
          opacity: 1,
          marginTop: '0px',
        }),
      ),
      state(
        'viewComplaint',
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
      transition('uploadDocument <=> *', [animate('1s')]),
    ]),
  ],
})
export class UploadDocumentsComponent implements OnInit {
  @Input() state;

  @Input() form: FormGroup;

  @Input() isLoading;

  @Output() uploadSuccess = new EventEmitter();

  upload = false;

  base64Format;

  docName = '';

  fileToUpload;

  constructor(
    private complaintData: ComplaintDataService,
    private uploadDocumentService: UploadDocumentService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.form.get('uploadDocument').valueChanges.subscribe((change) => {
      console.log('is this even working', change);
      if (change === 'yes') {
        this.form.addControl('fileUpload', new FormControl(null, Validators.required));
      } else {
        this.form.removeControl('fileUpload');
      }
      this.form.updateValueAndValidity();
    });
  }

  onUpload(toUpload) {
    if (toUpload === 'yes') {
      this.upload = true;
      this.form.get('uploadDocument').setValue('yes');
      this.complaintData.setComplaintInfo('uploadDocument', this.form.get('uploadDocument').value);
    } else if (toUpload === 'no') {
      this.upload = false;
      this.form.get('uploadDocument').setValue('no');
      this.complaintData.setComplaintInfo('uploadDocument', this.form.get('uploadDocument').value);
    }
  }

  handleFile(event) {
    this.fileToUpload = event.target.files[0];
    console.log(event, 'file tttt');
  }

  handleUpload(event) {
    console.log('got the file', event);
    const file = event.target.files[0];
    this.docName = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('the doc name', this.docName);
      console.log(reader.result);
      this.base64Format = reader.result;
    };
  }

  onSubmit() {
    const data = {
      docName: 'ClaimIntimation',
      path: `Complaint/${this.docName}`,
      data: this.base64Format.split(';base64,')[1],
    };
    this.loaderService.showSpinner(true);
    this.uploadDocumentService.uploadFile(data).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        console.log('upload successful', res);
        if (res['status'] === 200) {
          this.form.removeControl('fileUpload');
          this.uploadSuccess.emit(res['path']);
        } else {
          const message = 'Unable to upload Document currently. Please try after sometime.';
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        }
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to upload Document currently. Please try after sometime.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }
}
