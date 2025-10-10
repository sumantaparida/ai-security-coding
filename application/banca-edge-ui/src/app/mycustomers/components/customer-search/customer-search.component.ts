import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { User } from '@app/_models';
import * as crypto from 'crypto-js';
import { ConcentOtpComponent } from '../concent-otp/concent-otp.component';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css'],
})
export class CustomerSearchComponent implements OnInit {
  @Input() isMyCustomerScreen;

  user: User;

  channels = [
    { value: 'KB', viewValue: 'Karnataka Bank' },
    { value: 'IB', viewValue: 'Indian Bank' },
    { value: 'IOB', viewValue: 'Indian Overseas Bank' },
  ];

  searchByForm: FormGroup;

  disableToggle = true;

  isProceed;

  currentCustomer;

  isBankCustomer;

  organizationCode;

  isSubmitClicked = false;

  transactionId;

  ckycNumber;

  @Output() customerDetails = new EventEmitter<any>();

  constructor(
    private customersService: CustomersService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private quoteDataRootService: QuoteDataService,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  alphaNumeric = '^[a-zA-Z0-9_]*$';

  ngOnInit() {
    this.searchByForm = new FormGroup({
      // channel: new FormControl('', Validators.required),
      searchCustomerByMobile: new FormControl(false, [
        Validators.required,
        Validators.pattern(this.alphaNumeric),
        Validators.maxLength(20),
      ]),
      inputNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.alphaNumeric),
        Validators.maxLength(20),
      ]),
      accountNumber: new FormControl('', [
        Validators.pattern(this.alphaNumeric),
        Validators.maxLength(5),
      ]),
      // dob: new FormControl('', Validators.required)
    });

    this.isBankCustomer = this.user['bankCustomer'];
    this.organizationCode = this.user['organizationCode'];
  }

  onValChange(event) {
    this.searchByForm.get('inputNumber').reset();
  }

  goToIndividual() {
    this.router.navigate(['/mycustomers/addindividualcustomer']);
  }

  goToBusiness() {
    this.router.navigate(['/mycustomers/addbusinesscustomer']);
  }

  enableBtn(event) {
    if (this.searchByForm.get('channel').valid) {
      this.searchByForm.get('searchCustomerByMobile').enable();
    } else {
      this.searchByForm.get('searchCustomerByMobile').disable();
    }
  }

  channelSelected() {
    if (this.searchByForm.get('channel').valid) {
      return true;
    } else {
      return false;
    }
  }

  enableSubmit() {
    if (this.isSubmitClicked) {
      console.log('inside submit enable');
      return true;
    }
    if (this.searchByForm.valid) {
      return false;
    } else {
      return true;
    }
  }

  validateConcent() {
    this.loaderService.showSpinner(true);

    if (this.organizationCode === 'SIB') {
      const reqBody = {
        cifNumber: this.searchByForm.get('inputNumber').value,
        accountNumber: this.searchByForm.get('accountNumber').value,
      };
      this.getCustomer();

      // this.customersService.sendCustomerConsent(reqBody).subscribe(
      //   (res) => {
      //     this.loaderService.showSpinner(false);
      //     this.transactionId = res['transactionId'];

      //     if (res['returnCode'] !== 0) {
      //       const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      //         height: '150px',
      //         width: '600px',
      //         data: res['returnMessage'],
      //       });

      //       dialogRef.afterClosed().subscribe((result) => {});
      //     } else {
      //       // this.loaderService.showSpinner(true);

      //       const dialogRef = this.dialog.open(ConcentOtpComponent, {
      //         data: {
      //           cifNumber: res['cifNumber'],
      //           accountNumber: this.searchByForm.get('accountNumber').value,
      //           transactionId: this.transactionId,
      //         },
      //       });
      //       dialogRef.afterClosed().subscribe((data) => {
      //         // this.searchByForm.get('inputNumber').reset()
      //         // this.searchByForm.get('accountNumber').reset()
      //         console.log('otp modal closed', data);
      //         if (data === 'success') {
      //           this.getCustomer();
      //         } else {
      //           // this.navigateAfterLoggingIn();
      //           this.searchByForm.get('inputNumber').reset();
      //           this.searchByForm?.get('accountNumber')?.reset();
      //         }
      //       });

      //       // const reqBody = {
      //       //   cifNumber: res['cifNumber'],
      //       //   accountNumber: this.searchByForm.get('accountNumber').value,
      //       //   transactionId: res['transactionId'],
      //       //   consentCode: "123456"
      //       // };
      //       // this.customersService.validateCustomerConsent(reqBody).subscribe(res => {
      //       //  this.loaderService.showSpinner(false);

      //       //   if(res['responseCode'] === 0){
      //       //   this.searchByForm.get('accountNumber').reset()

      //       //     this.onValidate()
      //       //     // this.searchByForm.get('searchByForm').reset()
      //       //   } else if (res['responseCode'] !== 0){

      //       //   this.searchByForm.get('accountNumber').reset()

      //       // const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      //       //   height: '150px',
      //       //   width: '600px',
      //       //   data: res['responseMessage']
      //       // });

      //       // dialogRef.afterClosed().subscribe((result) => {
      //       //   this.searchByForm.get('accountNumber').reset()
      //       // });

      //       //   }
      //       // })
      //     }
      //   },
      //   (error) => {
      //     this.loaderService.showSpinner(false);

      //     // const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      //     //   height: '150px',
      //     //   width: '600px',
      //     //   data: 'Unable to fetch Data Please try after sometime.'
      //     // });
      //   },
      // );

      // commenting for CKYC api failuerv - Prakash request 04-March-2025
    } else if (this.organizationCode === 'DCB') {
      const cifNo = this.searchByForm.get('inputNumber').value;
      const secretKey = 'ysecretkeyyy098!';

      const encryptCifNumber = crypto.AES.encrypt(
        this.searchByForm.get('inputNumber').value.trim(),
        secretKey.trim(),
      ).toString();

      const reqBody = {
        broker: 'DCB',
        reqId: encryptCifNumber,
      };
      this.customersService.checkCkycDcb(reqBody).subscribe(
        (res) => {
          console.log(res);
          if (res['returnCode'] === 0) {
            this.ckycNumber = res['ckycNumber'];
            this.getCustomer();
          } else {
            this.loaderService.showSpinner(false);

            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              height: '150px',
              width: '600px',
              data: res['returnMessage'],
            });
          }
        },
        (err) => {
          console.log(err);
          this.loaderService.showSpinner(false);

          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            height: '150px',
            width: '600px',
            data: 'Unable to retrieve CKYC details, please try after sometime.',
          });
        },
      );
    } else {
      this.getCustomer();
    }
  }

  getCustomer() {
    // this.toggle();
    this.isSubmitClicked = true;

    this.currentCustomer = [];
    // this.loaderService.showSpinner(true);
    if (this.searchByForm.get('searchCustomerByMobile').value === true) {
      const reqBody = {
        inputType: 2,
        cifNumber: this.searchByForm.get('inputNumber').value,
        orgCode: this.user['organizationCode'],
      };

      if (this.ckycNumber) {
        reqBody['ckycNumber'] = this.ckycNumber;
      }

      if (this.organizationCode === 'CSB') {
        reqBody['branchCode'] = +this.user.branchCode;
      }

      // const encryptReqBody = crypto.AES.encrypt(
      //   reqBody.toString().trim(),
      //   secretKey.trim(),
      // ).toString();
      // let decryptedMessage = crypto.AES.decrypt(encryptReqBody, secretKey.trim()).toString(
      //   crypto.enc.Utf8,
      // );

      // console.log('decrypt=', decryptedMessage);
      // this.loaderService.showSpinner(true);

      this.customersService.getCustomerInfofromBanks(reqBody).subscribe(
        (customer) => {
          this.loaderService.showSpinner(false);

          this.isSubmitClicked = false;

          if (customer['responseCode'] === 0) {
            this.currentCustomer = customer;
            this.customerDetails.emit({
              customerDetails: this.currentCustomer,
              isLoadedFromCif: false,
            });
            // this.customersService
            //   .getCustomerByMobile(this.searchByForm.get('inputNumber').value)
            //   .subscribe(
            //     (customer) => {
            //       if (customer['responseCode'] === 0) {
            //         this.currentCustomer = customer;
            //         this.customerDetails.emit({
            //           customerDetails: this.currentCustomer,
            //           isLoadedFromCif: false,
            //         });

            // this.isProceed = true;
            this.loaderService.showSpinner(false);
            // this.isShowCustomer = true;
          } else {
            this.loaderService.showSpinner(false);

            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data:
                this.organizationCode === 'CSB'
                  ? 'Invalid Mobile/Client ID number'
                  : customer['responseMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        () => {
          this.loaderService.showSpinner(false);
          this.isSubmitClicked = false;

          this.customerDetails.emit();
        },
      );
    } else {
      const cifNo = this.searchByForm.get('inputNumber').value;
      const secretKey = 'ysecretkeyyy098!';

      const encryptCifNumber = crypto.AES.encrypt(
        this.searchByForm.get('inputNumber').value.trim(),
        secretKey.trim(),
      ).toString();

      const reqBody = {
        inputType: 1,
        orgCode: this.user['organizationCode'],
      };
      if (this.organizationCode === 'CSB') {
        reqBody['branchCode'] = +this.user.branchCode;
      }

      reqBody['cifNumber'] = encryptCifNumber;
      console.log('inside SB');
      console.log(
        'decrypted',
        crypto.AES.decrypt(reqBody['cifNumber'], secretKey.trim()).toString(crypto.enc.Utf8),
      );

      if (this.organizationCode === 'SIB') {
        reqBody['accountNumber'] = this.searchByForm.get('accountNumber').value;
      }

      if (this.ckycNumber) {
        reqBody['ckycNumber'] = this.ckycNumber;
      }
      this.customersService.getCustomerInfofromBanks(reqBody).subscribe(
        (customer) => {
          console.log('customer =', customer);
          this.isSubmitClicked = false;

          if (customer['responseCode'] === 0) {
            this.currentCustomer = customer;
            this.customerDetails.emit({
              customerDetails: this.currentCustomer,
              isLoadedFromCif: true,
              cifNo,
            });
            // this.isProceed = true;
            this.loaderService.showSpinner(false);
            // this.isShowCustomer = true;
          } else {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: customer['responseMessage'],
              panelClass: 'dialog-width',
            });

            // this.isShowCustomer = false;
            // this.isProceed = false;
          }
        },
        (error) => {
          console.log(error, '--errorr');
          this.isSubmitClicked = false;

          this.loaderService.showSpinner(false);
          // this.customerDetails.emit(this.currentCustomer);
          // const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          //   data: this.organizationCode === 'CSB' ? 'Cannot find Customer for entered Client ID number' : 'Cannot find Customer for entered CIF number',
          //   panelClass: 'dialog-width',

          // });

          // this.isShowCustomer = false;
          // this.isProceed = false;
        },
      );
    }
    this.searchByForm.get('inputNumber').reset();
    this.searchByForm?.get('accountNumber')?.reset();
  }
}
