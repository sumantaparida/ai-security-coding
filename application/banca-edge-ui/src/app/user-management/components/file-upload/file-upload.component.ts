import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import { UploadDocumentService } from '@app/_services/upload-document.service';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { UserManagementService } from '@app/user-management/services/user-managent.service';
import moment from 'moment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  testData = `name, age, country
    sam,25,India, Kane, 31, NZ, Smith,40, US`;

  responseData;

  customerId: number;

  isLoading;

  quickQuoteForm: FormGroup;

  quoteData;

  orgCode = null;

  documentType;

  fileName;

  allowedOrg;

  checkError = false;

  checkInput = false;

  allowedProd;

  allowedLob;

  results;

  selectedLob;

  insurerId;

  csvData;

  checkFileTypeError = false;

  documentKey = null;

  validDocType = null;

  documentName = null;

  // fileName = null;

  errorReport;

  enableDownload;

  isFileSelected = false;

  isDocumentSelected = false;

  pageSize = 5;

  pageSizeOptions = [5, 10, 15];
  reconciliationReportList = [];
  resultsLength = 0;
  reqBody;

  displayedColumns: string[] = ['Username', 'Report_Type', 'Start Date', 'Status', 'Action'];

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private router: Router,
    private customerService: CustomersService,
    private uploadDocumentService: UploadDocumentService,
    public dialog: MatDialog,
    // private spinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private userService: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.loaderService.showSpinner(true);
    this.quickQuoteForm = new FormGroup({
      docType: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });

    this.accountService.user.subscribe((user) => {
      this.insurerId = user.insurerId;
      this.orgCode = user.organizationCode;
    });
    this.uploadDocumentService
      .getLobMasterList('DocumentTemplates', this.orgCode)
      .subscribe((lobList) => {
        this.loaderService.showSpinner(false);
        this.allowedLob = lobList;


        this.route.paramMap.subscribe(params => {
          const type = params.get('type');
          console.log('Type param:', type); // bulk-upload

          if(type === "bulk-upload"){
              this.quickQuoteForm.get('docType').setValue("Customer Opt-Out Update");
              this.documentType = "CUSTOMER_OPT_OUT";
              this.reqBody = {
                page: 1,
                size: this.pageSize,
                reportType: "Customer Opt-Out Update",
              };
          }else{
            this.quickQuoteForm.get('docType').setValue(this.allowedLob[0].value);
            this.documentType = this.allowedLob[0].id;
            this.reqBody = {
              page: 1,
              size: this.pageSize,
              reportType: this.allowedLob[0].value,
            };
          }
          

          this.getBulkList();
        });
        



      });

    console.log(this.quickQuoteForm.value);
  }

  getBulkList() {
    this.loaderService.showSpinner(true);
    this.userService.getBulkList(this.reqBody).subscribe(
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

  onSelectionChanged(event: any, type: string) {
    console.log(this.quickQuoteForm.value);

    this.isDocumentSelected = true;
    this.enableUpload();
    this.reqBody.reportType = event.value;
    this.getBulkList();
    this.selectedLob = event.value;
    this.allowedLob.forEach((lob) => {
      if (lob.value == event.value) {
        this.documentType = lob.id;
      }
    });

    this.fileName = event.value;

    console.log('fiolename', this.fileName, this.documentType);

    if (event.value !== '' && type === 'product') {
      this.documentName = event.value;
      this.allowedProd.forEach((product) => {
        if (this.orgCode === product.orgCode && this.documentName === product.documentName) {
          this.documentKey = product.documentKey;
          this.validDocType = product.validDocType;
        }
      });
    }
  }

  selectFile(file: any) {
    this.isFileSelected = true;
    this.enableUpload();
    // this.checkInput = true;
    const data = file.target.files[0];
    // if (data.name.match(/\./g).length > 1) {
    //   this.showMessage('Please select ' + this.validDocType + ' file type', false);
    //   this.checkFileTypeError = true;
    //   return false;
    // }

    // if (data.name.split('.').pop() !== this.validDocType) {
    //   this.showMessage('Please select ' + this.validDocType + ' file type', false);
    //   this.checkFileTypeError = true;
    //   return false;
    // }

    // if (data.size > 5000000) {
    //   this.showMessage('File size should not exceed 5 MB', false);
    //   this.checkFileTypeError = true;
    //   return false;
    // }

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
    this.isFileSelected = true;
  }

  downloadErrorReport() {
    let convertedArr = this.base64ToArrayBuffer(this.errorReport);
    this.saveByteArray(convertedArr);
  }

  enableUpload() {
    if (this.isFileSelected) {
      this.checkInput = true;
    }
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
        this.enableDownload = false;
        this.showMessage(response['returnMessage'], 1);
        if (response['returnCode'] !== 0) {
          this.enableDownload = true;
          this.errorReport = response['report'];
        }
      },
      (error) => {
        // this.loaderService.showSpinner(false);
        this.showMessage(error.error.message);
        console.log(error);
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
    // console.log('file', responseData)
    // const byte64Data = responseData;
    // const byteArray = new Uint8Array(
    //   atob(byte64Data)
    //     .split('')
    //     .map((char) => char.charCodeAt(0)),
    // );
    // console.log(byteArray)
    // const blob = new Blob([byteArray], { type: 'application/vnd.ms-excel' });
    // // Here is your URL you can use
    // const url = window.URL.createObjectURL(blob);
    // console.log('url-->', url);
    // window.open(url);
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

  getTemplate() {
    this.loaderService.showSpinner(true);

    console.log('this. document', this.documentType);

    this.uploadDocumentService.getTemplate(this.orgCode, this.documentType).subscribe(
      (values) => {
        this.loaderService.showSpinner(false);
        if (values['returnCode'] !== 0) {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: values['returnMessage'],
            panelClass: 'dialog-width',
          });
        }

        this.responseData = values['template'];
        // this.base64ToXslx(this.responseData, this.fileName);
        // this.base64ToArrayBuffer(this.responseData);
        // this.saveByteArray(convertedArr);
        let convertedArr = this.base64ToArrayBuffer(this.responseData);
        this.saveByteArray(convertedArr);
      },
      (error) => {
        // this.loaderService.showSpinner(false);
        this.showMessage(error.error.message);
      },
    );
  }

  downloadFile(fileData, reportType) {
    const fileName = this.generateFileName(reportType);
    this.base64ToXslx(fileData, fileName);
  }

  generateFileName(reportType) {
    reportType = reportType.split(' ').join('_');
    const date = moment(new Date(Date.now())).format('YYYYMMDD');
    const randomNumber = Math.random().toString().split('.')[1].substring(0, 9);
    const fileName = `${reportType}_${this.orgCode}_${date}${randomNumber}`;
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

  showMessage(message, clear = 0) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (clear == 1) {
        this.quickQuoteForm.get('file').reset();

        this.getBulkList();
      }

      // navigate
      // if (check) {
      //   this.router.navigate(['/bulkuploadview']);
      // }
    });
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    const reqBody = {
      page: event.pageIndex + 1,
      size: event.pageSize,
      reportType: '',
    };
    this.loaderService.showSpinner(true);

    this.userService.getBulkList(reqBody).subscribe(
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
}
