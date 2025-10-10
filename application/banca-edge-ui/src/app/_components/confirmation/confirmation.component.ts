import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProposalService } from '@app/proposal/services/proposal.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyVaultService } from '@app/_services/policy-vault.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  insurerId;

  appNo;

  applicationDetails;

  downloadDocuments;

  data;

  allowPolicyPdf;

  allowPolicyPDFConvert;

  policyPDFConvertArray = [
    '113HL01I01',
    '113HL01F01',
  ]

  policyPdfArray = ['158FI01H01'];

  productIdArray = [
    '132FI01H01',
    '132FI02H01',
    '158GL01V01',
    '158FI01H01',
    '122N116V01',
    '117N080V02',
    '130N092V01'
  ];

  restrictDownloadPdf = false;

  defaultMessage =
    'Your Policy has been issued Successfully.You will receive your Policy Schedule shortly.';

  successMessage;

  confirmation: Confirmation = {
    status: '',
    policyNo: '',
    premiumPaid: '',
    paymentReferenceNo: '',
    message: '',
    appNo: '',
    coiNo: '',
    logoUrl: '',
    policyEndDate: '',
    policyStartDate: '',
    receiptNo: '',
    responseMessage: '',
    responseCode: '',
  };

  constructor(
    private route: ActivatedRoute,
    private policyVaultService: PolicyVaultService,
    private proposalService: ProposalService,
    private loaderService: LoaderService,
    private dialog: MatDialog,


  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.insurerId = params.insurerId;
      this.appNo = params.appNo;
    });
    console.log('insurerId: ', this.insurerId, ' appNo: ', this.appNo);
    this.route.queryParams.subscribe((queryParams) => {
      console.log('query params', queryParams);
      this.confirmation.status = queryParams.status;
      this.confirmation.policyNo = queryParams.policyNo;
      this.confirmation.premiumPaid = queryParams.premiumPaid;
      this.confirmation.paymentReferenceNo = queryParams.paymentReferenceNo;
      this.confirmation.appNo = queryParams.appNo;
      this.confirmation.coiNo = queryParams.coiNo;
      this.confirmation.logoUrl = queryParams.logoUrl;
      this.confirmation.message = queryParams.message;
      this.confirmation.receiptNo = queryParams.receiptNo;
      this.confirmation.policyStartDate = queryParams.policyStartDate;
      this.confirmation.policyEndDate = queryParams.policyEndDate;
      this.confirmation.responseMessage = queryParams.responseMessage;
      this.confirmation.responseCode = queryParams.responseCode;
    });
    this.successMessage = this.confirmation.message
      ? this.confirmation.message
      : this.defaultMessage;
    this.proposalService.getApplicationbyApplicationNo(this.appNo).subscribe((data) => {
      this.data = data;
      if (this.productIdArray.findIndex((productId) => productId === this.data.productId) > -1) {
        this.restrictDownloadPdf = true;
      }
      if (this.policyPdfArray.findIndex((productId) => productId === this.data.productId) > -1) {
        this.allowPolicyPdf = true;
      }
      if (this.policyPDFConvertArray.findIndex((productId) => productId === this.data.productId) > -1) {
        this.allowPolicyPDFConvert = true;
        this.restrictDownloadPdf = false;
      }
    });
  }

  base64ToPdfNew(applicationNo) {
    this.loaderService.showSpinner(true);
    this.policyVaultService.getFnaBase64(applicationNo).subscribe(
      (data) => {
        this.loaderService.showSpinner(false);
        const byte64Data = data['base64Pdf'];
        const url = data['base64Pdf'];
        // const byteArray = new Uint8Array(
        //   atob(byte64Data)
        //     .split('')
        //     .map((char) => char.charCodeAt(0)),
        // );
        // const blob = new Blob([byteArray], { type: 'application/pdf' });
        // // Here is your URL you can use
        // const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      (error) => {
        this.loaderService.showSpinner(false);
        const message = error.responseMessage;
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
  }

  base64ToPdf(data) {
    const byte64Data = data;
    const byteArray = new Uint8Array(
      atob(byte64Data)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    // Here is your URL you can use
    const url = window.URL.createObjectURL(blob);
    console.log('url-->', url);
    window.open(url, '_blank');
  }

  downloadURLDoc(url) {
    window.open(url, '_blank');
  }

  downloadProposalForm(applicationNumber, documentType) {
    this.applicationDetails = {
      applicationNo: applicationNumber,
      // applicationNo: '12750546319',
      documentType: documentType,
    };
    this.policyVaultService.downloadProposalForm(this.applicationDetails).subscribe(
      (download) => {
        if (download['documents'] !== null) {
          this.downloadDocuments = download['documents'];
          // this.downloadPdf(this.downloadDocuments[0]?.documentUrl, this.downloadDocuments[0]?.applicationNo)
          window.open(this.downloadDocuments[0]?.documentUrl, '_blank');
        }
      },
      () => {
        console.log('error downloading');
      },
    );
  }
}

interface Confirmation {
  status: string;
  policyNo: string;
  premiumPaid: string;
  paymentReferenceNo: string;
  appNo: string;
  coiNo: string;
  message: string;
  logoUrl: string;
  receiptNo: string;
  policyStartDate: string;
  policyEndDate: string;
  responseMessage: string;
  responseCode: string;
}
