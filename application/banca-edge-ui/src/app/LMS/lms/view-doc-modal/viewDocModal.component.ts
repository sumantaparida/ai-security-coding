import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpModalComponent } from '@app/LMS/components/pop-up-modal/pop-up-modal.component';
import { LmsService } from '@app/LMS/services/lms.service';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { ModalComponent } from '../modal-comnponent/modal.component';
import { NewModalComponent } from '../new-modal-component/new-modal.component';

@Component({
  selector: 'app-viewDocModal',
  templateUrl: './viewDocModal.component.html',
  styleUrls: ['./viewDocModal.component.css'],
})
export class ViewDocModalComponent implements OnInit {
  isCreateLead;

  docs;

  fileUploadError;

  totalSize;

  myFiles = [];

  isUpload;

  docForm: FormGroup;

  leadId;

  isAdmin;

  errorFetchingDoc = false;

  riskProfileStatus;

  remarks;

  docList;

  uploadFailure = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewDocModalComponent>,
    private loaderService: LoaderService,
    private lmsService: LmsService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    // this.loaderService.showSpinner(false);
    console.log('data', this.data);
    this.docForm = new FormGroup({
      remarks: new FormControl('', Validators.required),
    });

    let user = this.accountService.userValue;
    this.isAdmin = user['userGroups'].indexOf('ADMIN') > -1 ? true : false;
    console.log('user', user['userGroups'], user);

    if (this.data.isUpload) {
      this.isUpload = true;
      this.leadId = this.data.leadId;
      this.errorFetchingDoc = false;
    } else {
      this.isUpload = false;
      this.leadId = this.data?.leadId;
      this.riskProfileStatus = this.data.riskProfileStatus;
      this.loaderService.showSpinner(true);
      this.lmsService.getUploadedDocuments(this.leadId).subscribe(
        (res) => {
          this.loaderService.showSpinner(false);
          this.docs = res;
          this.docList = this.docs.filter((doc) => doc.documentStatus !== 'Rejected');
          this.errorFetchingDoc = false;
          this.remarks = this.docs.remarks;
          console.log('remarks=', this.remarks);
          this.remarks = this.docs[this.docs.length - 1].remarks;
          console.log('docs', this.docs);
        },
        (error) => {
          console.log('error');
          this.errorFetchingDoc = true;
        },
      );
    }
  }

  onOkClicked(bol) {
    this.dialogRef.close(bol);
  }

  // downloadDocument(url) {
  //   this.lmsService.downloadDocument(leadId, docName).subscribe((res) => {
  //     console.log('res=', res);
  //     // window.open(res, '_blank');

  //     // const linkSource = `data:application/pdf;base64,${res['data']}`;
  //     // const downloadLink = document.createElement('a');
  //     // const fileName = 'vct_illustration.pdf';

  //     // downloadLink.href = linkSource;
  //     // downloadLink.download = fileName;
  //     // downloadLink.click();
  //     // window.location.href = 'data:application/octet-stream;base64,' + res;
  //     this.base64ToPdf(res['data']);
  //   });
  // }

  downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  base64ToPdf(file) {
    // const byte64Data = file.url;
    // const byteArray = new Uint8Array(
    //   atob(byte64Data)
    //     .split('')
    //     .map((char) => char.charCodeAt(0)),
    // );
    // let type = file.documentName.split('.').pop();
    // console.log('type=', type);
    // const blob = new Blob([byteArray], {
    //   type: file.mimetype,
    // });
    // // Here is your URL you can use
    // const url = window.URL.createObjectURL(blob);
    // console.log('url-->', url);
    window.open(file.s3Url, '_blank');
  }

  updateStatus(status: string) {
    let isAccept;
    if (status === 'Approved') {
      isAccept = true;
    } else {
      isAccept = false;
    }
    let payload = {
      leadId: this.leadId,
      status: status,
      remarks: this.docForm.get('remarks').value,
    };
    this.lmsService.updateRiskProfileStatus(payload).subscribe(() => {
      if (status !== 'Pending') {
        const updateDialog = this.dialog.open(PopUpModalComponent, {
          data: isAccept,
        });
      }

      this.dialogRef.close();
    });
  }

  calculateFilesSize(size) {
    console.log('totalsize  --', this.totalSize, size);
    this.totalSize = this.totalSize + size;
    if (this.totalSize / 1024 > 5000) {
      this.totalSize = this.totalSize - size;
      this.fileUploadError = true;
      return false;
    } else {
      let newArr = [];
      console.log('totalsize=', this.totalSize);
      let fSExt = ['Bytes', 'KB', 'MB'];
      let j = 0;
      while (size > 900) {
        size /= 1024;
        j++;
      }
      let exactSizeNumber = Math.round(this.totalSize * 100) / 100;
      let exactSize = Math.round(size * 100) / 100 + fSExt[j];
      newArr.push(exactSize);
      console.log('FILE SIZE = ', j, exactSize, exactSizeNumber, newArr);
      // alert(exactSize);
      console.log(this.totalSize / 1024);

      this.fileUploadError = false;
      return true;
    }
  }

  getFileDetails(e) {
    console.log(e.target.files);
    this.fileUploadError = false;
    let canUpload;
    for (var i = 0; i < e.target.files.length; i++) {
      let size = e.target.files[i].size;
      canUpload = this.calculateFilesSize(size);
      console.log('size=', size);
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
    }

    console.log('proinitng files', this.myFiles);
    reader.onload = () => {
      // console.log(reader.result);
      if (canUpload) {
        this.myFiles.push(reader.result);
      }
    };
    console.log('print files', this.myFiles);
  }

  upload() {
    const payload = {
      leadId: this.data.leadId,
      files: [],
    };
    for (let i = 0; i < this.myFiles.length; i++) {
      payload.files.push(this.myFiles[i]);
    }
    this.loaderService.showSpinner(true);
    this.lmsService.uploadDocument(payload).subscribe(
      (result) => {
        this.loaderService.showSpinner(false);
        console.log('uploaded succesfullly');
        if (result['message']) {
          this.onOkClicked(true);
        } else {
          this.onOkClicked(false);

        }
      },
      (err) => {
        this.loaderService.showSpinner(false);
        this.uploadFailure = true;
        this.myFiles = [];

        // this.onOkClicked(false);
        let newdialog = this.dialog.open(ModalComponent, {
          data: { message: 'Error uploading documents.' },
          panelClass: 'dialog-width',
        });

        console.log('err', err);
      },
    );
    if (!this.data.sendToInsurer) {
      this.updateStatus('Pending');
    }
  }

  disableUpload() {
    // console.log('inside disable', this.myFiles);
    if (this.myFiles.length === 0) {
      // console.log('inside disable true');
      return true;
    } else {
      // console.log('inside disable false');
      return false;
    }
  }

  disableReject() {
    if (this.docForm.valid) {
      return false;
    } else {
      return true;
    }
  }
}
