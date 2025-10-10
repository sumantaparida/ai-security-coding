import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { MaterialFileInputModule } from 'ngx-material-file-input';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ServiceRequestDataService } from '../../services/service-request-data.service';

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
        'viewServiceRequest',
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
export class UploadDocumentsComponent {
  @Input() state;

  @Input() form: FormGroup;

  @Input() isLoading;

  upload = true;

  constructor(private serviceRequestData: ServiceRequestDataService) { }

  onUpload() {
    // if (toUpload === 'yes') {
    //   this.upload = true;
    //   this.form.get('uploadDocument').setValue('yes');
    //   this.serviceRequestData.setComplaintInfo('uploadDocument', this.form.get('uploadDocument').value);
    // } else if (toUpload === 'no') {
    //   this.upload = false;
    //   this.form.get('uploadDocument').setValue('no');
    //   this.serviceRequestData.setComplaintInfo('uploadDocument', this.form.get('uploadDocument').value);
    // }
  }
}
