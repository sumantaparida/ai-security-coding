import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterContentInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Customer } from '@interface/Customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { CookieService } from 'ngx-cookie-service';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MyCustomerUserInterface } from '@interface/ui-customer';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuoteDataService } from '@app/_services/quoteData.service';

export interface FetchData {
  postData;
  product;
}

import { CifModalComponent } from './components/cif-modal/cif-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { AccountService } from '@app/_services';
import { PolicyPromptModalComponent } from '@app/shared/components/policy-prompt-modal/policy-prompt-modal.component';

@Component({
  selector: 'app-mycustomers',
  templateUrl: './mycustomers.component.html',
  styleUrls: ['./mycustomers.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MycustomersComponent implements OnInit, AfterContentInit {
  @Input() isMyCustomerScreen = true;

  @Output() customerSelected = new EventEmitter();

  expandedCustomer: MyCustomerUserInterface | null;

  public show = false;

  public hide = false;

  public innerWidth: any;

  isLoading = false;

  isLoadedFromCif = false;

  cifNo;

  dsCustomers: MatTableDataSource<MyCustomerUserInterface>;

  selection = new SelectionModel<MyCustomerUserInterface>(true, []);

  customers: Array<Customer>;

  displayedColumns: string[] = [];

  isMobileView: boolean;

  isQuoteId;

  quoteId;

  selectedCustomerId;

  quoteForm: FormGroup;

  searchForm: FormGroup;

  isCustomerSelected;

  createApplicationData;

  productId;

  applicationNo;

  isShowCustomer = false;

  isBranchUser = false;

  currentCustomer;

  primaryMobileNo;

  isProceed = false;

  newCustomerId;

  user;

  constructor(
    private customersService: CustomersService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private quoteDataRootService: QuoteDataService,
    private loaderService: LoaderService,
    private cookie: CookieService,
    private accountService: AccountService,
  ) {
    // console.log(this.router.getCurrentNavigation().extras.state as FetchData);
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dsCustomers.sort = value;
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dsCustomers.paginator = value;
  }

  toggle() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

  openDialog() {
    const dialogRef = this.dialog.open(CifModalComponent, {
      data: '',
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((data) => {
      // navigate
      // console.log('button clicked', data);
      if (data === 'close') {
        this.toggle();
      }
    });
  }

  ngOnInit(): void {
    // const product = history.state;
    // console.log(this.location.getState(), product);

    // this.route
    //   .data
    //   .subscribe(v => console.log(v));
    // console.log(this.router.getCurrentNavigation().extras.state as FetchData);
    console.log('mycustomer = ', this.user);
    if ( this.user.organizationCode === 'SB' && this.user.insurerUser == true) {
      this.router.navigate(['/lms']);
    } else if (
      this.user.organizationCode === 'DCB' &&
      (this.user.isSP == 'false' || this.user.isSP == false)
    ) {
      this.router.navigate(['/lms']);

    }
    this.isBranchUser = this.accountService.isBranchUser;

    this.route.params.subscribe((params) => {
      if (params.productId) {
        this.isQuoteId = true;
        this.productId = params.productId;
        this.createApplicationData = this.quoteDataRootService.getData();
        // const appData = this.cookie.get('appData');
        // this.createApplicationData = JSON.parse(appData);
        // console.log('cretae', this.createApplicationData, this.productId);
        // this.quoteId = params.quoteId;
      }
      if (params.newCustomerId) {
        this.newCustomerId = params.newCustomerId;

        this.loaderService.showSpinner(true);
        this.customersService.getCustomerById(this.newCustomerId).subscribe(
          (customer) => {
            this.loaderService.showSpinner(false);

            if (customer['responseCode'] === 0) {
              this.currentCustomer = customer;
            } else {
              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: customer['responseMessage'],
                panelClass: 'dialog-width',
              });
            }
          },
          (error) => {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
              data: 'Something went wrong, please try later',
              panelClass: 'dialog-width',
            });
          },
        );
      }
    });

    // this.loaderService.showSpinner(true);
    this.innerWidth = window.innerWidth;
    this.dsCustomers = new MatTableDataSource<MyCustomerUserInterface>();
    // this.dsCustomers.filterPredicate = (data, filter: string) => {
    //   const accumulator = (currentTerm, key) => {
    //     return this.nestedFilterCheck(currentTerm, data, key);
    //   };
    //   const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();

    //   const transformedFilter = filter.trim().toLowerCase();
    //   return dataStr.indexOf(transformedFilter) !== -1;
    // };

    this.searchForm = new FormGroup({
      customerBy: new FormControl('cifNo', Validators.required),
      inputNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  public doFilter = (value: string) => {
    this.dsCustomers.filter = value.trim().toLocaleLowerCase();
  };

  onValChange(val) {
    this.searchForm.get('inputNumber').reset();
  }

  customerDetails(customerInfo) {
    this.currentCustomer = customerInfo.customerDetails;
    this.isLoadedFromCif = customerInfo.isLoadedFromCif;
    if (this.isLoadedFromCif) {
      this.cifNo = customerInfo.cifNo;
    }
    this.customerSelected.emit(customerInfo.customerDetails);
  }

  goToIndividual() {
    this.router.navigate(['/mycustomers/addindividualcustomer']);
  }

  goToBusiness() {
    this.router.navigate(['/mycustomers/addbusinesscustomer']);
  }

  checkCustomer() {
    if (!this.currentCustomer) {
      return true;
    } else {
      false;
    }
  }

  routeToPolicy(customerId) {
    this.router.navigate(['/policyvault'], { queryParams: { customerId } });
  }

  routeToNeedAnalysis(customerId) {
    this.router.navigate(['/needanalysis/home', customerId]);
  }

  selectedCustomer(customerId) {
    this.createApplicationData.customerId = this.currentCustomer?.customerId;
    // console.log('cretaefe', this.createApplicationData);
    this.isCustomerSelected = true;
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
        (error) => {
          // this.isLoading = false;
          this.loaderService.showSpinner(false);
        },
      );
  }
}
