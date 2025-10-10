import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { MediaObserver } from '@angular/flex-layout';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { MyRenewalsService } from '@app/_services/my-renewals.service';
import { LoaderService } from '@app/_services/loader.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/_services';

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

@Component({
  selector: 'app-myrenewals',
  templateUrl: './myrenewals.component.html',
  styleUrls: ['./myrenewals.component.css'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyrenewalsComponent implements OnInit {
  customerId: number;

  columnsToDisplay = [
    'Insurer Name',
    'Product Name',
    'Policy Number',
    'Customer Name',
    'nextPremiumDueDate',
    'paymentFrequency',
    'Premium',
  ];

  policyApplicationDetailsArr;

  policyApplicationArrCopy;

  policyApplicationSearchCopy;

  policyDetailString;

  searchForm: FormGroup;

  pageIndex = 0;

  pageSize = 5;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  inforceStatusCount = 0;

  pendingStatusCount = 0;

  inactiveStatusCount = 0;

  expandedElement;

  hidden = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sortHeaderData: Sort;

  isLoading = false;

  isMobileView = false;

  innerWidth;

  displayedColumns: string[] = [];

  displayedMobileColumns: string[] = [' ', 'Customer Name',];

  user;

  reqBody = {
    pageNo: this.pageIndex + 1,
    pageSize: this.pageSize,
    searchData: '',
    branch: 0,
    product: '',
    status: 0,
    startDate: '',
    endDate: '',
  };

  totalRecords;

  constructor(
    private route: ActivatedRoute,
    private myRenewalsService: MyRenewalsService,
    public dialog: MatDialog,
    public media: MediaObserver,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private router: Router,
  ) {
    this.route.params.subscribe((params) => {
      if (params.CID) {
        this.customerId = params.CID;
      } else {
        this.customerId = null;
      }
    });
   
  }

  ngOnInit() {
    this.accountService.user.subscribe(val=>{
      this.user = val
     console.log(this.user)
     if(this.user.userGroups.includes('ADMIN')){
      this.columnsToDisplay.push('Actions')
  this.displayedMobileColumns.push('Actions')

     }
    })
    this.displayedColumns = this.columnsToDisplay

    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');
    this.innerWidth = window.innerWidth;

    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.loaderService.showSpinner(true);
    this.getPolicyApplicationDetails(this.reqBody);
  }

  

  ngAfterContentInit() {
    this.resetDisplayedColumnsXtraSmall();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.resetDisplayedColumnsXtraSmall();

    // this.isMobileView = this.breakPointObserver.isMatched('(max-width: 599px');
  }

  resetDisplayedColumnsXtraSmall() {
    if (this.innerWidth < 820) {
      this.displayedColumns = this.displayedMobileColumns;
      this.isMobileView = true;
    } else {
      this.displayedColumns = this.columnsToDisplay;
      this.isMobileView = false;
    }
  }

  onToggle(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggle(expanded) {
    expanded = !expanded;
  }




  

  getPolicyApplicationDetails(reqPayload) {
    this.loaderService.showSpinner(true);

    this.myRenewalsService.getRenewalsForCustomer(reqPayload).subscribe(
      (policyDetails) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        this.policyApplicationDetailsArr = policyDetails['renewalLeads'];
        this.totalRecords = policyDetails['totalRecords']

        // this.policyApplicationDetailsArr.forEach((policy) => {
        //   if (policy.status === 'Inforce') {
        //     this.inforceStatusCount++;
        //   } else if (policy.status === 'Pending') {
        //     this.pendingStatusCount++;
        //   } else if (policy.status !== 'Inforce' && policy.status !== 'Pending') {
        //     this.inactiveStatusCount++;
        //   }
        // });

        // this.policyApplicationDetailsArr.map((policyApplicationDetails) => {
        //   policyApplicationDetails['expanded'] = false;
        //   if (
        //     policyApplicationDetails.applicationData &&
        //     policyApplicationDetails.applicationData.insured &&
        //     policyApplicationDetails.applicationData.insured.dob
        //   ) {
        //     const dob = new Date(policyApplicationDetails.applicationData.insured.dob);
        //     const timeDiff = new Date().getTime() - dob.getTime();
        //     const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        //     policyApplicationDetails.applicationData.insured['age'] = age;
        //   }
        //   const insuredArr = policyApplicationDetails.applicationData.insureds;
        //   // console.log('insured', policyApplicationDetails.applicationData);
        //   if (insuredArr && !Array.isArray(insuredArr)) {
        //     if (insuredArr['gender'] === 'F') {
        //       insuredArr['gender'] = 'Female';
        //     } else if (insuredArr['gender'] === 'M') {
        //       insuredArr['gender'] = 'Male';
        //     }
        //   } else if (insuredArr && Array.isArray(insuredArr)) {
        //     insuredArr.map((insuredPerson) => {
        //       const dob = new Date(insuredPerson.dob);
        //       const timeDiff = new Date().getTime() - dob.getTime();
        //       const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        //       insuredPerson['age'] = age;
        //     });
        //     policyApplicationDetails['healthInsuranceDetails'] = insuredArr;
        //   }
        //   // policyApplicationDetails['cDate'] = new Date(policyApplicationDetails.createdDate);
        // });
        // this.policyApplicationSearchCopy = this.policyApplicationDetailsArr.slice();
        // this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
      },
      () => {
        this.loaderService.showSpinner(false);
      },
    );
  }
  

  



  sortData(sort: Sort, isSearching?: boolean) {
    // this.paginator.pageIndex = 0;
    // this.pageIndex = 0;
    // if (isSearching && sort !== undefined) {
    //   this.sortHeaderData = sort;
    //   this.policyApplicationSearchCopy = this.getSearchResults().slice();
    //   this.policyApplicationArrCopy = this.getSortedData();
    // } else if (isSearching) {
    //   this.paginator.pageIndex = 0;
    //   this.pageIndex = 0;
    //   this.policyApplicationSearchCopy = this.getSearchResults().slice();
    //   this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
    // } else {
    //   this.sortHeaderData = sort;
    //   this.policyApplicationArrCopy = [];
    //   this.policyApplicationDetailsArr.slice();
    //   this.policyApplicationSearchCopy = this.getSearchResults().slice();
    //   this.policyApplicationArrCopy = this.getSortedData();
    // }
  }

  getSortedData() {
    // const data = this.policyApplicationSearchCopy.slice();
    // if (
    //   this.sortHeaderData &&
    //   (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
    // ) {
    //   this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
    //     this.pageIndex,
    //     this.pageSize,
    //   );
    //   return this.policyApplicationArrCopy;
    // }
    // this.policyApplicationSearchCopy = data.sort((a, b) => {
    //   const isAsc = this.sortHeaderData.direction === 'asc';
    //   switch (this.sortHeaderData.active) {
    //     case 'Insurer Name':
    //       return this.compare(a.insurerName, b.insurerName, isAsc);
    //     case 'Product Name':
    //       return this.compare(a.productName, b.productName, isAsc);
    //     case 'Policy Number':
    //       return this.compare(a.applicationNo, b.applicationNo, isAsc);
    //     case 'Customer Name':
    //       return this.compare(a.customerName, b.customerName, isAsc);
    //     case 'Status':
    //       return this.compare(a.status, b.status, isAsc);
    //     case 'Premium':
    //       return this.compare(a.premiumAmount, b.premiumAmount, isAsc);
    //     default:
    //       return 0;
    //   }
    // });

    // return this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchFieldChange() {
    // this.paginator.pageIndex = 0;
    // this.pageIndex = 0;
    // this.sortData(this.sortHeaderData, true);
  }

  onPageChange(event: PageEvent) {
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    let reqBody = {
      pageNo: event.pageIndex + 1,
      pageSize:  event.pageSize,
      searchData: '',
      branch: 0,
      product: '',
      status: 0,
      startDate: '',
      endDate: '',
    };
    // const policiesToDisplay = event.pageIndex * event.pageSize;
    // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
    //   policiesToDisplay,
    //   policiesToDisplay + event.pageSize,
    // );

    this.getPolicyApplicationDetails(reqBody) 
  }


  getSearchResults() {
    const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
    let reqBody = {
      pageNo:1,
      pageSize: this.pageSize,
      searchData: searchValue,
      branch: 0,
      product: '',
      status: 0,
      startDate: '',
      endDate: '',
    };
    this.getPolicyApplicationDetails(reqBody) 
  }

  showOrHide(column) {
    return this.displayedMobileColumns.indexOf(column) === -1;
  }

  onNotifyPayment(leadId) {
    // console.log(leadId);
    // this.router.navigate(['/', 'initiate-payment', application]);
    this.loaderService.showSpinner(true);
    this.myRenewalsService.notifyPayment(leadId).subscribe(res=>{
      this.loaderService.showSpinner(false);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: res['returnMessage'],
        panelClass: 'dialog-width',
      });
    },error=>{
      this.loaderService.showSpinner(false);
      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: error.error['errorMessage'],
        panelClass: 'dialog-width',
      });
    })
  }
}
