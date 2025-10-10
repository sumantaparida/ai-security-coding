import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';
import { AccountService } from '@app/_services/account.service';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteDataService } from '@app/_services/quoteData.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerMobileNoDobModalComponent } from '@app/mycustomers/components/customer-mobile-no-dob-modal/customer-mobile-no-dob-modal.component';
import { User } from '@app/_models';
import { CreateLeadModalComponent } from '../create-lead-modal/create-lead-modal.component';
import { RetakeOneMinPlanComponent } from '../retake-one-min-plan/retake-one-min-plan.component';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent implements OnInit, OnChanges {
  user: User;

  isQuoteId;

  productId;

  createApplicationData;

  isBranchUser;

  isInsurer;

  applicationNo;

  dob;

  mobileNO;

  orgCode;

  contactList = [];

  @Input() currentCustomer;

  @Input() isMyCustomerScreen;

  @Input() isLoadedFromCif;

  @Input() cifNo;

  insurerUser;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private quoteDataRootService: QuoteDataService,
    private loaderService: LoaderService,
    private customersService: CustomersService,
    public dialog: MatDialog,
    private accountService: AccountService,
  ) {}

  ngOnChanges() {
    if (this.currentCustomer?.isIndividual) {
      this.checkforDobMobile(this.currentCustomer);
    }
  }

  ngOnInit(): void {
    this.accountService.user.subscribe((x) => (this.user = x));
    this.orgCode = this.user.organizationCode;
    this.isBranchUser = this.accountService.isBranchUser;
    console.log(typeof this.user.insurerUser);

    if (typeof this.user.insurerUser == 'boolean') {
      this.insurerUser = this.user.insurerUser;
    } else {
      this.insurerUser = this.user.insurerUser == 'true' ? true : false;
    }

    this.isInsurer = this.user.isInsurerUser;
    this.route.params.subscribe((params) => {
      if (params.productId) {
        this.isQuoteId = true;
        this.productId = params.productId;
        this.createApplicationData = this.quoteDataRootService.getData();
      }
      if (params.primaryMobileNo) {
        this.customersService.getCustomerByMobile(params.primaryMobileNo).subscribe((customer) => {
          this.currentCustomer = customer;
        });
      }
    });
    this.checkDuplicateMobileNumber();
  }

  routeToPolicy(customerId) {
    this.router.navigate(['/policyvault'], { queryParams: { customerId } });
  }

  routeToNeedAnalysis(customerId) {
    // console.log('currentCustomer',this.currentCustomer)
    if (this.orgCode === 'DCB') {
      let mobileValid = /^[6-9][0-9]*$/.test(this.currentCustomer?.mobileNo);
      let emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.currentCustomer?.email);

      if (mobileValid || emailValid) {
        const dialog = this.dialog.open(CreateLeadModalComponent, {
          data: {
            customerId: this.currentCustomer?.customerId,
            planCompleted: this.currentCustomer?.planCompleted,
            oneMinPlan: true,
            customerMbNo: mobileValid || emailValid,
          },
          panelClass: 'dialog-width',
        });
        dialog.afterClosed().subscribe((res) => {
          console.log('result', res);
          if (res.val === 1) {
            this.router.navigate([
              `/lms/new-application/${this.currentCustomer?.customerId}/physical/${res.lobType}`,
            ]);
          } else if (res.val === 2) {
            this.router.navigate(['/needanalysis/home', customerId, res.lobType]);
          }
        });
      } else {
        const dialog = this.dialog.open(CreateLeadModalComponent, {
          data: {
            customerId: this.currentCustomer?.customerId,
            planCompleted: this.currentCustomer?.planCompleted,
            oneMinPlan: false,
            customerMbNo: mobileValid || emailValid,
          },
          panelClass: 'dialog-width',
        });
        dialog.afterClosed().subscribe((res) => {});
      }
    } else {
      this.router.navigate(['/needanalysis/home', customerId]);
    }
  }

  proceedToQuote() {
    // this.isLoading = true;
    this.createApplicationData.customerId = this.currentCustomer?.customerId;
    this.loaderService.showSpinner(true);
    this.quoteDataRootService
      .createHealthApplication(this.productId, this.createApplicationData)
      .subscribe(
        (result) => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          this.applicationNo = applicationArr['applicationNo'];
          if (applicationArr['online'] === false) {
            if (this.createApplicationData.lob === 'Life') {
              this.router.navigate(['/proposal', this.productId, this.applicationNo]);
            } else if (this.createApplicationData.lob === 'Health') {
              this.router.navigate(['/quote/offline-purchase', this.applicationNo]);
            } else if (this.createApplicationData.lob === 'Motor') {
              this.router.navigate(['/quote/offline-motor-purchase', this.applicationNo]);
            }
          } else if (applicationArr['online'] === true) {
            if (this.isBranchUser) {
              const dialogRef = this.dialog.open(PolicyPromptModalComponent, {
                data: '',
                panelClass: 'dialog-width',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe((formType) => {
                this.router.navigate(['/proposal', this.productId, this.applicationNo, formType]);
              });
            } else {
              this.router.navigate(['/proposal', this.productId, this.applicationNo, 'Long']);
            }
          }
        },
        () => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
        },
      );
  }

  enableProceed() {}

  checkforDobMobile(customerDetail) {
    let dobTrue = '';
    let mobileNo = '';
    if (customerDetail.hasOwnProperty('dob')) {
      dobTrue = customerDetail.dob;
    }
    if (customerDetail.hasOwnProperty('mobileNo')) {
      mobileNo = customerDetail.mobileNo;
    }
    if ((dobTrue === '' || mobileNo === '') && customerDetail.organizationCode !== 'DCB') {
      const dialogRef = this.dialog.open(CustomerMobileNoDobModalComponent, {
        data: {
          customerdetail: JSON.parse(JSON.stringify(customerDetail)),
          mobilenumber: mobileNo,
          dob: dobTrue,
        },
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe((updateddetails) => {
        this.loaderService.showSpinner(true);
        const user = this.accountService.userValue;
        // this.organizationCode = user.organizationCode;
        const customerData: any = {
          branchCode: user.branchCode,
          dob: updateddetails.dob,
          firstName: updateddetails.firstName,
          gender: updateddetails.gender,
          isIndividual: updateddetails.isIndividual,
          lastName: updateddetails.lastName,
          mobileNo: updateddetails.mobileNo,
          organizationCode: updateddetails.organizationCode,
        };
        const customerid = this.currentCustomer?.customerId;
        // this.currentCustomer = updateddetails;
        this.customersService.updateCustomer(customerData, customerid).subscribe(
          (res) => {
            if (res.hasOwnProperty('responseCode')) {
              if (updateddetails.bankCustomerId !== '') {
                const cifNo = updateddetails.bankCustomerId;
                const secretKey = 'ysecretkeyyy098!';

                const encryptCifNumber = crypto.AES.encrypt(
                  cifNo.trim(),
                  secretKey.trim(),
                ).toString();

                const reqBody = {
                  inputType: 1,
                  orgCode: this.user['organizationCode'],
                };

                reqBody['cifNumber'] = encryptCifNumber;

                // this.customersService.getCustomerInfofromBanks(reqBody).subscribe(

                // ----

                this.customersService.getCustomerInfofromBanks(reqBody).subscribe(
                  // this.customersService.getCustomerByCif(updateddetails.bankCustomerId).subscribe(
                  (res1) => {
                    this.loaderService.showSpinner(false);
                    this.currentCustomer = res1;
                  },
                  () => {
                    this.loaderService.showSpinner(false);
                  },
                );
              } else {
                this.customersService.getCustomerByMobile(updateddetails.mobileNo).subscribe(
                  (res1) => {
                    this.currentCustomer = res1;
                  },
                  () => {
                    this.loaderService.showSpinner(false);
                    // console.log('error = ', error);
                  },
                );
              }
            } else {
              this.loaderService.showSpinner(false);
            }
          },
          () => {
            this.loaderService.showSpinner(false);
            // console.log('error = ', error);
          },
        );
      });
    }
  }

  checkDuplicateMobileNumber() {
    const mobileNum = this.currentCustomer.mobileNo;
    // console.log(mobileNum);
    this.contactList = this.currentCustomer.contactList?.filter((contact) => {
      if (contact.contactType === 'MOBILE' && contact.contactText === mobileNum) {
        console.log(contact);
        return false;
      } else {
        return true;
      }
    });
    // console.log(this.contactList);
  }

  routeToLMS() {
    console.log('CLICK');
    const journey = 'digital';
    this.router.navigate([`/lms/new-application/${this.currentCustomer?.customerId}/${journey}`]);
  }

  cisDcb() {
    // console.log('currentCustomer',this.currentCustomer)
    let mobileValid = /^[6-9][0-9]*$/.test(this.currentCustomer?.mobileNo);
    let emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.currentCustomer?.email);
    let planCreatedOn = new Date(this.currentCustomer.customerNeeds?.planCreatedDate);
    let today = new Date();
    let diff = this.dateDiffInDays(planCreatedOn, today);
    console.log('plan created', diff);
    if (diff > 364) {
      const dialog = this.dialog.open(RetakeOneMinPlanComponent, {
        data: {
          customerId: this.currentCustomer?.customerId,
        },
      });
    } else {
      // if (this.currentCustomer?.mobileNo?.length > 2) {
      console.log(emailValid, mobileValid);
      const dialog = this.dialog.open(CreateLeadModalComponent, {
        data: {
          customerId: this.currentCustomer?.customerId,
          planCompleted: this.currentCustomer?.planCompleted,
          oneMinPlan: false,
          customerMbNo: mobileValid || emailValid,
        },
        panelClass: 'dialog-width',
      });
      dialog.afterClosed().subscribe((res) => {});
      // } else {
      //   const dialog = this.dialog.open(CreateLeadModalComponent, {
      //     data: {
      //       customerId: this.currentCustomer?.customerId,
      //       planCompleted: this.currentCustomer?.planCompleted,
      //       oneMinPlan: false,
      //       customerMbNo: mobileValid || emailValid,
      //     },
      //     panelClass: 'dialog-width',
      //   });
      //   dialog.afterClosed().subscribe((res) => {});
      // }
    }
  }

  dateDiffInDays(a, b) {
    const minPerDays = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / minPerDays);
  }

  routeToCIS() {
    this.router.navigate(['/cis/lob', this.currentCustomer?.bankCustomerId]);
  }

  disableCreateLead() {
    if (this.currentCustomer['planCompleted'] === true) {
      return false;
    } else return true;
  }

  createLeadCall() {
    if (this.orgCode === 'KB') {
      this.routeToCIS();
    } else if (this.orgCode === 'DCB') {
      this.cisDcb();
    } else {
      this.routeToLMS();
    }
  }
}
