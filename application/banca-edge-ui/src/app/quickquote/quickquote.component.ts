import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { LoaderService } from '@app/_services/loader.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-quickquote',
  templateUrl: './quickquote.component.html',
  styleUrls: ['./quickquote.component.css'],
})
export class QuickquoteComponent implements OnInit {
  customerId: number;

  customerData;

  isLoading;

  quickQuoteForm: FormGroup;

  quoteData;

  productKey = [];

  insuranceProductsCopy = [];

  insuranceProducts = [
    {
      name: 'Child Education',
      score: 0,
      value: 'childEducation',
      img: '../../../assets/images/Child_Education_ICON_og.svg',
    },
    {
      name: 'Critical Illness',
      score: 0,
      value: 'ci',
      img: '../../../assets/images/Critical_illness_ICON.svg',
    },
    {
      name: 'Cyber Theft',
      score: 0,
      value: 'cyber',
      img: '../../../assets/images/anon-hacker-behind-pc.svg',
    },
    {
      name: 'Health Insurance',
      score: 0,
      value: 'health',
      img: '../../../assets/images/Health_Hospi_ICON.svg',
    },
    {
      name: 'Home Insurance',
      score: 0,
      value: 'home',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
    // {
    //   name: 'Fire Insurance',
    //   score: 0,
    //   value: 'sme',
    //   img: '../../../assets/icons/quick-quote/standard_fire_special_perils.svg',
    // },
    {
      name: 'Regular Income',
      score: 0,
      value: 'income',
      img: '../../../assets/images/Regular_Income_ICON.svg',
    },
    {
      name: 'Protection',
      score: 0,
      value: 'protection',
      img: '../../../assets/images/Protection_ICON.svg',
    },
    {
      name: 'Saving Traditional',
      score: 0,
      value: 'savings',
      img: '../../../assets/images/Savings Traditional_ICON.svg',
    },
    {
      name: 'Saving Unit Linked',
      score: 0,
      value: 'ulip',
      img: '../../../assets/images/Saving_Unit_Linked_ICON_og.svg',
    },
    {
      name: 'Personal Accident',
      score: 0,
      value: 'pa',
      img: '../../../assets/icons/quick-quote/personal_accident.svg',
    },
    {
      name: 'Motor Insurance',
      score: 0,
      value: 'car',
      img: '../../../assets/images/Car_Insurance_ICON_og.svg',
    },
    {
      name: 'Two Wheeler',
      score: 0,
      value: '2w',
      img: '../../../assets/icons/quick-quote/two_wheeler.svg',
    },
    {
      name: 'Travel',
      score: 0,
      value: 'travel',
      img: '../../../assets/icons/quick-quote/travel.svg',
    },
    {
      name: 'Offline Policies',
      score: 1,
      value: 'offline',
      img: '../../../assets/icons/quick-quote/offline_policies.svg',
    },
    {
      name: 'Shop Keeper',
      score: 0,
      value: 'sme',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
    {
      name: 'Life Annuity',
      score: 0,
      value: 'ann',
      img: '../../../assets/images/Saving_Unit_Linked_ICON_og.svg',
    },
  ];

  planPriorities = [
    { name: 'Must Have', id: 3, checked: false },
    { name: 'Important', id: 2, checked: true },
    { name: 'Consider', id: 1, checked: true },
    { name: 'Not Needed', id: 0, checked: true },
  ];

  isPlanCompleted;

  isIndividual;

  isDialogOpened = false;

  cifNumber;

  user;

  orgCode;

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private router: Router,
    private customerService: CustomersService,
    public dialog: MatDialog,
    // private spinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    // this.isLoading = true;
    // console.log('new log');
    this.loaderService.showSpinner(true);

    this.accountService.user.subscribe((user) => {
      this.orgCode = user.organizationCode;
    });

    this.route.params.subscribe((params) => {
      if (params.CID) {
        this.customerId = params.CID;
        //  *--- plan is completed or not --*
        this.customerService.getCustomerById(this.customerId).subscribe((customerData) => {
          this.loaderService.showSpinner(false);
          this.customerData = customerData;
          this.isPlanCompleted = this.customerData?.planCompleted;
          this.isIndividual = this.customerData?.isIndividual;
          this.getAvailablePlanForCustomer();
          // get plans if need analysis is completred
        });

        // *-- commented fro Union bank demo --*
        // this.customerService.getCustomerById(this.customerId).subscribe((customerData) => {
        //   this.customerData = customerData;
        //   // get plans if need analysis is completred
        //   this.loaderService.showSpinner(false);

        //   if (this.customerData?.planCompleted) {
        //     this.isPlanCompleted = true;
        //     this.quoteData = customerData['customerNeeds']['plan'];
        //     console.log('prinitng', customerData['customerNeeds']['plan']);
        //     this.productKey = Object.keys(this.quoteData);
        //     console.log('test', this.insuranceProducts);
        //     this.insuranceProductsCopy = this.insuranceProducts.filter((arr) => {
        //       if (this.productKey.indexOf(arr.value) > -1) {
        //         return arr;
        //       }
        //     });
        //     Object.keys(customerData['customerNeeds']['plan']).forEach((key) => {
        //       // this.insuranceProductsCopy = this.insuranceProducts;
        //       const index = this.insuranceProductsCopy.findIndex((element) => {
        //         return element.value === key;
        //       });
        //       if (index > -1) {
        //         this.insuranceProductsCopy[index]['score'] =
        //           customerData['customerNeeds']['plan'][key]['score'];
        //       }
        //     });
        //     this.insuranceProductsCopy.sort(this.compareValues('score', 'desc'));
        //   } else {
        //     this.isPlanCompleted = false;
        //     this.getQuickQuote();
        //   }

        // });
      } else {
        console.log('user=', this.accountService.user);

        this.accountService.user.subscribe((user) => {
          this.user = user;
          this.cifNumber = user.userName;
        });
        this.customerService.getCustomerByCif(this.cifNumber).subscribe((customer) => {
          console.log('customer=', customer);
          this.customerId = customer['customerId'];
          console.log('customer Id', this.customerId);
          this.getAvailablePlanForCustomer();
        });
        // this.customerId = 0;
        // this.getQuickQuote();
      }
    });
    // this.isLoading = true;
    // this.spinner.show();

    this.quickQuoteForm = new FormGroup({
      policyName: new FormControl(''),
    });
  }

  getAvailablePlanForCustomer() {
    this.customerService.getAvailablePlansForCustomer(this.customerId).subscribe(
      (plans) => {
        console.log(plans, '--.,');
        this.loaderService.showSpinner(false);

        this.quoteData = plans;
        this.productKey = Object.keys(this.quoteData);
        console.log('product key=', this.productKey);
        this.insuranceProductsCopy = this.insuranceProducts.filter((arr) => {
          if (this.productKey.indexOf(arr.value) > -1) {
            return arr;
          }
        });
        console.log('test', this.insuranceProductsCopy);

        Object.keys(plans).forEach((key) => {
          // this.insuranceProductsCopy = this.insuranceProducts;
          const index = this.insuranceProductsCopy.findIndex((element) => {
            return element.value === key;
          });
          if (index > -1) {
            this.insuranceProductsCopy[index]['score'] = plans[key]['score'];
          }
        });
        this.insuranceProductsCopy.sort(this.compareValues('score', 'desc'));
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  getQuickQuote() {
    this.customerService.getQuickQuote().subscribe(
      (quote) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        // this.spinner.hide();
        this.quoteData = quote;
        this.productKey = Object.keys(this.quoteData);

        this.insuranceProductsCopy = this.insuranceProducts.filter((arr) => {
          if (this.productKey.indexOf(arr.value) > -1) {
            return arr;
          }
        });
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  routeToQuote(policyValue) {
    if (this.customerId) {
      if (policyValue === 'health') {
        this.router.navigate(['/quote/health-detail', this.customerId]);
      } else if (policyValue === 'car') {
        this.router.navigate(['/quote/motor', this.customerId]);
      } else if (policyValue === 'savings') {
        if (this.isIndividual) {
          if (this.isPlanCompleted) {
            this.router.navigate(['/quote/saving-traditionals', this.customerId]);
          } else {
            this.routeToNeedAnalysis();
          }
        } else {
          this.router.navigate(['/quote/saving-traditionals', this.customerId]);
        }
      } else if (policyValue === 'protection') {
        this.router.navigate(['/quote/life-protections', this.customerId]);
      } else if (policyValue === 'sme') {
        this.router.navigate(['/quote/shop-keeper', this.customerId]);
      } else if (policyValue === 'childEducation') {
        if (this.isIndividual) {
          if (this.isPlanCompleted) {
            this.router.navigate(['/quote/children-plan', this.customerId]);
          } else {
            this.routeToNeedAnalysis();
          }
        } else {
          this.router.navigate(['/quote/children-plan', this.customerId]);
        }
      } else if (policyValue === 'home') {
        this.router.navigate(['/quote/generate-quotes', this.customerId]);
      } else if (policyValue === 'pa') {
        this.router.navigate(['/quote/pa-insurance', this.customerId]);
      } else if (policyValue === 'travel') {
        this.router.navigate(['/quote/travel-detail', this.customerId]);
      } else if (policyValue === 'ulip') {
        if (this.isIndividual) {
          if (this.isPlanCompleted) {
            this.router.navigate(['/quote/unit-linked', this.customerId]);
          } else {
            this.routeToNeedAnalysis();
          }
        } else {
          this.router.navigate(['/quote/unit-linked', this.customerId]);
        }
        // this.router.navigate(['/quote/travel-details'], { queryParams: { customerId: this.customerId } });
      } else if (policyValue === 'offline') {
        if (this.orgCode === 'CSB') {
          this.router.navigate(['/offline-policies/new-application', this.customerId]);
        } else {
          this.router.navigate(['lms/new-application', this.customerId]);
        }
      } else if (policyValue === 'ann') {
        this.router.navigate(['/quote/annuiti', this.customerId]);
      } else if (policyValue === 'ci') {
        this.router.navigate(['/quote/ci', this.customerId]);
      }
    } else {
      if (policyValue === 'health') {
        this.router.navigate(['/quote/health-details']);
      } else if (policyValue === 'car') {
        this.router.navigate(['/quote/motor']);
      } else if (policyValue === 'savings') {
        if (this.isPlanCompleted) {
          this.router.navigate(['/quote/saving-traditionals']);
        } else {
          this.routeToNeedAnalysis();
        }
      } else if (policyValue === 'protection') {
        this.router.navigate(['/quote/life-protection']);
      } else if (policyValue === 'sme') {
        this.router.navigate(['/quote/shop-keeper']);
      } else if (policyValue === 'childEducation') {
        if (this.isPlanCompleted) {
          this.router.navigate(['/quote/children-plan']);
        } else {
          this.routeToNeedAnalysis();
        }
      } else if (policyValue === 'home') {
        this.router.navigate(['/quote/generate-quote']);
      } else if (policyValue === 'pa') {
        this.router.navigate(['/quote/personal-accident']);
      } else if (policyValue === 'travel') {
        this.router.navigate(['/quote/travel-details']);
      } else if (policyValue === 'ulip') {
        if (this.isPlanCompleted) {
          console.log('plan is not there');
        } else {
          this.routeToNeedAnalysis();
        }
        // this.router.navigate(['/quote/travel-details'], { queryParams: { customerId } });
      } else if (policyValue === 'offline') {
        this.router.navigate(['/offline-policies/new-application']);
      } else if (policyValue === 'ann') {
        this.router.navigate(['/quote/annuiti']);
      }
    }
  }

  routeToNeedAnalysis() {
    // You need to complete Need Analysis before buying this Product
    const message = 'You need to complete Need Analysis before buying this Product';
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe(() => {
      if (this.customerId) {
        this.router.navigate(['/needanalysis/home', this.customerId]);
      } else {
        this.router.navigate(['/needanalysis/home']);
      }
    });
  }

  compareValues(key, order) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    };
  }
}
