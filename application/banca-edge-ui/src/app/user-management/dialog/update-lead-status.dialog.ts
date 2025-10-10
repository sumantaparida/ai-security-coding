import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import { UploadDocumentService } from '@app/_services/upload-document.service';

@Component({
  selector: 'update-lead-status-dialog',
  templateUrl: './update-lead-status.dialog.html',
  styleUrls: ['./update-lead-status-dialog.css'],
})
export class UpdateLeadStatusDialog implements OnInit {
  isTrue = false;

  link;

  form;
  selectedFile: any = null;
  insurerId;
  orgCode;
  documentType = 'LEAD_STATUS_UPDATE';
  errorMessage = '';
  showErrorMsg = '';
  fileName;
  enableDownload = false;
  csvData;
  checkFileTypeError;
  isFileSelected;
  checkInput = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<UpdateLeadStatusDialog>,

    private uploadDocumentService: UploadDocumentService,

    // private spinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      selectedFile: new FormControl('', Validators.required),
    });
    this.accountService.user.subscribe((user) => {
      this.insurerId = user.insurerId;
      this.orgCode = user.organizationCode;
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }
  getTemplate() {
    this.loaderService.showSpinner(true);

    this.uploadDocumentService.getTemplate(this.orgCode, this.documentType).subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        if (values['returnCode'] !== 0) {
          this.errorMessage = values['returnMessage'];
        }

        let responseData = values['template'];
        // this.base64ToXslx(this.responseData, this.fileName);
        // this.base64ToArrayBuffer(this.responseData);
        // this.saveByteArray(convertedArr);
        let convertedArr = this.base64ToArrayBuffer(responseData);
        this.saveByteArray(convertedArr);
      },
      (error) => {
        // this.loaderService.showSpinner(false);
        this.errorMessage = error.error.message;
      },
    );
  }

  base64ToArrayBuffer(responseData) {
    var binaryString = window.atob(responseData);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    // var fileName = reportName;
    // link.download = `BulkUploadTemplate_${this.selectedLob}.xlsx`;
    link.download = `${this.documentType}.xlsx`;

    link.click();
  }

  uploadData() {
    this.loaderService.showSpinner(true);

    const data = {
      orgCode: this.orgCode,
      documentType: this.documentType,
      content: this.csvData.split(',')[1],
      fileName: this.fileName.replace(' ', '_'),
      // documentKey: `${this.orgCode}_Bulkupload`,
      // lob: this.selectedLob,
    };
    this.uploadDocumentService.uploadDocument(data).subscribe(
      (response) => {
        this.loaderService.showSpinner(false);
        this.errorMessage = response['returnMessage'];
        this.dialogRef.close(response);

        // if (response['returnCode'] !== 0) {
        //   this.enableDownload = true;
        //   // this.errorReport = response['report'];
        //   this.dialogRef.close(response);
        // }
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.errorMessage = 'Failed uploading, please try again with .xlsx file';
      },
    );
  }

  selectFile(file: any) {
    // this.isFileSelected = true;
    // this.enableUpload();
    this.checkInput = true;
    const data = file.target.files[0];

    this.fileName = data.name;
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = () => {
      that.checkFileTypeError = false;
      that.csvData = reader.result;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };

    this.errorMessage = 'File chosen successfully. Click on Upload Batch';
    this.isFileSelected = true;
  }
}
