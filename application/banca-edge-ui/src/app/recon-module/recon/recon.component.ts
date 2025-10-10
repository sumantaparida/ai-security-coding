import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ReconService } from '../recon-service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from '@app/_services/loader.service';
import { AccountService } from '@app/_services/account.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-recon',
  templateUrl: './recon.component.html',
  styleUrls: ['./recon.component.css'],
})
export class ReconComponent implements OnInit {
  samplRes;

  documentType = 'RECONCILIATION_REPORT';

  orgCode;

  pageSize = 5;

  pageSizeOptions = [5, 10, 15];

  enableDownload;
  fileName;
  checkInput;
  csvData;
  errorReport;
  checkFileTypeError;
  reqBody;

  reconciliationReportList = [];

  displayedColumns: string[] = ['Username', 'Start Date', 'Status', 'Action'];

  resultsLength = 0;

  @ViewChild('fileSelected') fileSelected: ElementRef;

  constructor(
    private reconService: ReconService,
    public dialog: MatDialog,

    private loaderService: LoaderService,
    private accountService: AccountService,
    public media: MediaObserver,
  ) {}

  ngOnInit(): void {
    this.accountService.user.subscribe((user) => {
      console.log(user);
      this.orgCode = user?.organizationCode;
    });
    this.reqBody = {
      page: 1,
      size: this.pageSize,
      reportType: 'Recon',
    };
    this.loaderService.showSpinner(true);
    this.getReconList();
  }

  getReconList() {
    this.reconService.getReconList(this.reqBody).subscribe(
      (res) => {
        this.loaderService.showSpinner(false);
        if (res['returnCode'] === 0) {
          this.reconciliationReportList = res['bulkUploadReportList'];
          this.resultsLength = res['totalRecords'];
        } else if (res['returnCode'] === 1) {
          this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });
        }

        console.log(res);
      },
      (error) => {
        this.loaderService.showSpinner(false);

        this.dialog.open(PolicyErrorModalComponent, {
          data: error,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    const reqBody = {
      page: event.pageIndex + 1,
      size: event.pageSize,
      reportType: 'Recon',
    };
    this.loaderService.showSpinner(true);

    this.reconService.getReconList(reqBody).subscribe(
      (report) => {
        this.loaderService.showSpinner(false);
        console.log('report=', report);
        if (report['returnCode'] === 0) {
          this.reconciliationReportList = report['bulkUploadReportList'];
          this.resultsLength = report['totalRecords'];
        } else if (report['returnCode'] === 1) {
          this.dialog.open(PolicyErrorModalComponent, {
            data: report['responseMessage'],
            panelClass: 'dialog-width',
          });
        }
      },
      (error) => {
        this.loaderService.showSpinner(false);

        this.dialog.open(PolicyErrorModalComponent, {
          data: error,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  getTemplate() {
    this.loaderService.showSpinner(true);
    this.reconService.getTemplate(this.orgCode, this.documentType).subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        if (values['returnCode'] !== 0) {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: values['returnMessage'],
            panelClass: 'dialog-width',
          });
        }

        let responseData = values['template'];

        let convertedArr = this.base64ToArrayBuffer(responseData);
        this.saveByteArray(convertedArr);
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.showMessage(error.error.message);
      },
    );
  }

  getAllReports() {}

  uploadData() {
    this.loaderService.showSpinner(true);

    const data = {
      orgCode: this.orgCode,
      documentType: this.documentType,
      content: this.csvData.split(',')[1],
      fileName: this.fileName,
    };
    this.reconService.uploadDocument(data).subscribe(
      (response) => {
        this.checkInput = false;

        this.loaderService.showSpinner(false);
        this.enableDownload = false;
        this.showMessage(response['returnMessage']);
        if (response['returnCode'] !== 0) {
          this.enableDownload = true;
          this.errorReport = response['report'];
        }
        // this.ngOnInit();
        this.fileName = '';
        this.fileSelected.nativeElement.value = '';
        this.getReconList();
      },
      (error) => {
        this.loaderService.showSpinner(false);
        this.showMessage(error.error.message);
        console.log(error);
      },
    );
  }

  selectFile(file: any) {
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

    this.showMessage('File chosen successfully. Click on Upload Batch');
  }

  saveByteArray(byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    // var fileName = reportName;
    // link.download = `BulkUploadTemplate_${this.selectedLob}.xlsx`;
    link.download = `RECONCILIATION_REPORT.xlsx`;

    link.click();
  }

  showMessage(message) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((data) => {});
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

  downloadFile(fileData) {
    const fileName = this.generateFileName();
    this.base64ToXslx(fileData, fileName);
  }
  generateFileName() {
    const date = moment(new Date(Date.now())).format('YYYYMMDD');
    const randomNumber = Math.random().toString().split('.')[1].substring(0, 9);
    const fileName = `RECONCILIATION_REPORT_${this.orgCode}_${date}${randomNumber}`;
    return fileName;
  }

  base64ToXslx(data, fileName?) {
    let contentType = 'application/vnd.ms-excel';
    let blob1 = this.b64toBlob(data, contentType);
    let blobUrl1 = URL.createObjectURL(blob1);
    if (fileName) {
      var downloadLink = document.createElement('a');
      downloadLink.href = blobUrl1;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      window.open(blobUrl1);
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
