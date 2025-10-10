import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { UploadDocumentService } from '@app/_services/upload-document.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css'],
})
export class BulkUploadComponent implements OnInit {
  testData = `name, age, country
  sam,25,India, Kane, 31, NZ, Smith,40, US`;

  responseData;

  customerId: number;

  isLoading;

  quickQuoteForm: FormGroup;

  quoteData;

  orgCode = null;

  documentType;

  allowedOrg;

  checkError = false;

  checkInput = false;

  allowedProd;

  allowedLob;

  results;

  // selectedLob;

  insurerId;

  csvData;

  checkFileTypeError = false;

  documentKey = null;

  validDocType = null;

  documentName = null;

  fileName = null;

  errorReport;

  enableDownload

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
  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(
      (user) => {
        this.insurerId = user.insurerId;
        this.orgCode = user.organizationCode;
      },
      // console.log('USER LOGINGIN', (this.insurerId = x.insurerId)),
    );
    this.uploadDocumentService.getLobMasterList('DocumentTemplates', 'KB').subscribe((lobList) => {
      // let newArray = [];
      // let uniqueObject = {};
      // for (let i in lobList) {
      //   let objTitle = lobList[i]['lob'];
      //   uniqueObject[objTitle] = lobList[i];
      // }
      // for (let i in uniqueObject) {
      //   newArray.push(uniqueObject[i]);
      // }
      this.allowedLob = lobList;
    });
    this.customerService.getAllowedOrgForUser().subscribe(
      (org) => {
        this.loaderService.showSpinner(false);
        this.allowedOrg = org;
        this.orgCode = 'KB';
        this.uploadDocumentService.getDocumentMasterList('KB').subscribe(
          (product) => {
            this.loaderService.showSpinner(false);
            this.allowedProd = product['docList'];
            this.documentName = this.allowedProd[0]['documentName'];
            this.quickQuoteForm.get('product').setValue(this.documentName);
            // tslint:disable-next-line: no-shadowed-variable
            this.allowedProd.forEach((product) => {
              if (this.orgCode === product.orgCode && this.documentName === product.documentName) {
                console.log('condition matched');
                this.documentKey = product.documentKey;
                this.validDocType = product.validDocType;
              }
            });
          },
          (error) => {
            this.loaderService.showSpinner(false);
          },
        );
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
    // this.loaderService.showSpinner(true);
    this.quickQuoteForm = new FormGroup({
      bank: new FormControl('KB', Validators.required),
      product: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });
  }

  selectFile(file: any) {
    this.checkInput = true;
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
  }

  onSelectionChanged(event: any, type: string) {
    // this.selectedLob = event.value;
    this.documentType = event.value;
    // if (event.value !== '') {
    //   // this.loaderService.showSpinner(true);

    //   // this.uploadDocumentService.getDocumentMasterList(event.value).subscribe(
    //   //   (product) => {
    //   //     this.loaderService.showSpinner(false);
    //   //     this.allowedProd = product['docList'];
    //   //   },
    //   //   (error) => {
    //   //     this.loaderService.showSpinner(false);
    //   //   },
    //   // );
    // }

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

  downloadErrorReport() {
    let convertedArr = this.base64ToArrayBuffer(this.errorReport);
    this.saveByteArray(convertedArr);
  }

  uploadData() {
    this.loaderService.showSpinner(true);

    //     "documentKey":"CSB Sample",
    // "fileName":"CSB_Health_Bulk_Upload_Template.xlsx",
    // "orgCode":"CSB",
    // "lob":"Fire"

    const data = {
      orgCode: this.orgCode,
      documentType: this.documentType,
      content: this.csvData.split(',')[1],
      fileName: 'Spdetails.xlsx',
      // documentKey: `${this.orgCode}_Bulkupload`,
      // lob: this.selectedLob,
    };
    this.uploadDocumentService.uploadDocument(data).subscribe(
      (response) => {
        this.loaderService.showSpinner(false);
        this.enableDownload = false
        this.showMessage(response['returnMessage']);
        if (response['returnCode'] !== 0) {
          this.enableDownload = true
          this.errorReport = response['report']
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
    link.download = `Spdetails.xlsx`;

    link.click();
  }

  getTemplate() {
    this.loaderService.showSpinner(true);
    this.uploadDocumentService.getTemplate(this.orgCode, this.documentType).subscribe((values) => {
      this.loaderService.showSpinner(false);
      if (values['returnCode'] !== 0) {
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: values['returnMessage'],
          panelClass: 'dialog-width',
        });
      }

      this.responseData = values['template'];
      // this.base64ToArrayBuffer(this.responseData);
      // this.saveByteArray(convertedArr);
      let convertedArr = this.base64ToArrayBuffer(this.responseData);
      this.saveByteArray(convertedArr);
    }, (error) => {
      // this.loaderService.showSpinner(false);
      this.showMessage(error.error.message);

    },);
  }

  downloadErrorData() { }

  showMessage(message) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((data) => {
      // navigate
      // if (check) {
      //   this.router.navigate(['/bulkuploadview']);
      // }
    });
  }
}
